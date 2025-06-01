import os
import json
import autogen
from typing import Dict, Any, Optional
from dotenv import load_dotenv
import groq
from datetime import datetime
import tempfile
from fpdf import FPDF
from PIL import Image, ImageEnhance
import base64
import io
import re
import uuid
import traceback

# Load environment variables
load_dotenv()

class ESignatureAgent:
    def __init__(self):
        # Initialize Groq client
        self.groq_api_key ='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'
        if not self.groq_api_key:
            raise ValueError("Groq API key not found in environment variables")
            
        self.groq_client = groq.Groq(api_key=self.groq_api_key)
        
        # Initialize AutoGen assistant with Groq
        self.assistant = autogen.AssistantAgent(
            name="ESignatureProcessor",
            llm_config={
                "config_list": [{
                    "model": "llama-3.3-70b-versatile",
                    "api_key": self.groq_api_key,
                    "base_url": "https://api.groq.com/v1",
                    "api_type": "groq"
                }],
                "temperature": 0.7,
            },
            system_message="""You are an E-Signature Processing agent that helps add signatures to contracts
            and handle the final steps of agreement workflows."""
        )

    def add_signature_to_contract(self, contract_path: str, signature_data: str, position: Dict[str, int] = None) -> str:
        """Add a signature image to the contract PDF and return the new file path."""
        signature_file_path = None
        try:
            print("[DEBUG] Adding signature to contract...")
            print(f"[DEBUG] Original contract path: {contract_path}")
            print(f"[DEBUG] Signature data length: {len(signature_data)}")
            
            # Create directories if needed
            signatures_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "signatures")
            contracts_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "signed_contracts")
            for directory in [signatures_dir, contracts_dir]:
                if not os.path.exists(directory):
                    os.makedirs(directory)
        
            # Process signature data - extract the base64 string properly
            if "base64," in signature_data:
                signature_data = signature_data.split("base64,")[1]
        
            # Save original signature bytes first for troubleshooting
            raw_signature_bytes = base64.b64decode(signature_data)
            raw_timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            raw_signature_path = os.path.join(signatures_dir, f"raw_signature_{raw_timestamp}.png")
            with open(raw_signature_path, 'wb') as f:
                f.write(raw_signature_bytes)
            print(f"[DEBUG] Saved raw signature to: {raw_signature_path}")
        
            # Decode and process signature
            signature_image = Image.open(io.BytesIO(raw_signature_bytes))
            print(f"[DEBUG] Decoded signature image: {signature_image.size}, {signature_image.mode}")
        
            # Simple image processing - prioritize visibility
            if signature_image.mode != 'RGBA':
                signature_image = signature_image.convert('RGBA')
        
            # Create white background
            white_bg = Image.new('RGBA', signature_image.size, (255, 255, 255, 255))
            signature_with_bg = Image.alpha_composite(white_bg, signature_image)
        
            # Convert to RGB (required for PDF)
            signature_image = signature_with_bg.convert('RGB')
        
            # Enhance contrast for better visibility
            enhancer = ImageEnhance.Contrast(signature_image)
            signature_image = enhancer.enhance(2.0)
        
            # Darken the signature
            enhancer = ImageEnhance.Brightness(signature_image)
            signature_image = enhancer.enhance(0.8)
        
            # Save processed signature
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            signature_file_path = os.path.join(signatures_dir, f"signature_{timestamp}.png")
            signature_image.save(signature_file_path)
            print(f"[DEBUG] Processed signature saved to: {signature_file_path}")
        
            # Generate a new PDF with the signature
            from PyPDF2 import PdfReader, PdfWriter
            from reportlab.pdfgen import canvas
            from reportlab.lib.pagesizes import letter
            import io as BytesIO
        
            # Create a PDF for the signature
            signature_pdf_buffer = BytesIO.BytesIO()
            c = canvas.Canvas(signature_pdf_buffer, pagesize=letter)
        
            # Better signature placement - use bottom section of page for signature
            # Use more space for signature
            sig_x, sig_y = 120, 150  # Positioned for visibility
            sig_width, sig_height = 240, 120
        
            # Add signature image
            c.drawImage(signature_file_path, sig_x, sig_y, 
                       width=sig_width, height=sig_height, 
                       preserveAspectRatio=True, mask='auto')
        
            # Add a strong signature line
            c.setStrokeColorRGB(0, 0, 0)  
            c.setLineWidth(1)
            c.line(sig_x, sig_y-10, sig_x+sig_width, sig_y-10)
        
            # Add date text
            c.setFillColorRGB(0, 0, 0)  # Black text
            c.setFont("Helvetica", 10)
            current_date = datetime.now().strftime('%B %d, %Y')
            c.drawString(sig_x, sig_y-30, f"Date: {current_date}")
        
            c.save()
            signature_pdf_buffer.seek(0)
        
            # Combine with original contract
            original_pdf = PdfReader(contract_path)
            output_pdf = PdfWriter()
        
            # Find the signature page (usually last page)
            signature_page_index = len(original_pdf.pages) - 1
        
            # Process all pages
            for i in range(len(original_pdf.pages)):
                page = original_pdf.pages[i]
                
                # Add signature to the signature page
                if i == signature_page_index:
                    print(f"[DEBUG] Adding signature to page {i+1}")
                    signature_pdf = PdfReader(signature_pdf_buffer)
                    page.merge_page(signature_pdf.pages[0])
                    print("[DEBUG] Signature merged successfully")
            
            output_pdf.add_page(page)
        
            # Save the signed PDF
            signed_pdf_path = os.path.join(contracts_dir, f"signed_contract_{timestamp}.pdf")
            with open(signed_pdf_path, "wb") as f:
                output_pdf.write(f)
        
            print(f"[DEBUG] Generated signed PDF at: {signed_pdf_path}")
            return signed_pdf_path
        
        except Exception as e:
            print(f"[ERROR] Error adding signature to contract: {str(e)}")
            traceback.print_exc()
            return None

    def send_final_documents(self, 
                             email_template: str, 
                             contract_path: str, 
                             creator_email: str,
                             user_email: str) -> dict:
        """Send the final email and contract to the creator and user."""
        try:
            print("[DEBUG] Sending final documents...")
            
            # Extract subject and body from email template
            subject_match = re.search(r'SUBJECT:\s*(.*?)(?=\n\nBODY:|$)', email_template, re.DOTALL)
            body_match = re.search(r'BODY:\s*([\s\S]*)', email_template, re.DOTALL)
            
            subject = subject_match.group(1).strip() if subject_match else "Influencer Marketing Agreement"
            body = body_match.group(1).strip() if body_match else email_template
            
            # Add signature confirmation to the email body
            finalized_body = f"{body}\n\n---\nThis agreement has been electronically signed and is now official. The signed contract is attached to this email."
            
            # In a real implementation, we would send actual emails
            # For this demo, we'll just simulate sending and return success
            print(f"[DEBUG] Would send email to {creator_email} with subject: {subject}")
            print(f"[DEBUG] Would CC: {user_email}")
            print(f"[DEBUG] With attachment: {contract_path}")
            
            # Using Groq to generate confirmation message
            completion = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "You are an email confirmation service. Generate a brief confirmation message."
                    },
                    {
                        "role": "user",
                        "content": f"Create a brief confirmation message stating that an agreement email with the subject '{subject}' has been sent to {creator_email} with a copy to {user_email}."
                    }
                ],
                temperature=0.7,
                max_tokens=150
            )
            
            confirmation_message = completion.choices[0].message.content
            
            return {
                "success": True,
                "message": confirmation_message,
                "details": {
                    "subject": subject,
                    "recipient": creator_email,
                    "cc": user_email,
                    "timestamp": datetime.now().isoformat()
                }
            }
            
        except Exception as e:
            print(f"Error sending final documents: {str(e)}")
            traceback.print_exc()
            return {
                "success": False,
                "message": f"Failed to send documents: {str(e)}"
            }
    
    def process_signature_request(self, 
                                  contract_id: str, 
                                  signature_data: str,
                                  email_template: str,
                                  creator_email: str,
                                  user_email: str,
                                  contract_path: str = None) -> Dict[str, Any]:
        """Process a signature request and finalize the contract workflow."""
        try:
            print(f"[DEBUG] Processing signature for contract ID: {contract_id}")
            print(f"[DEBUG] Signature data length: {len(signature_data) if signature_data else 'None'}")
            print(f"[DEBUG] First 100 chars of signature data: {signature_data[:100] if signature_data else 'None'}...")
            
            # Add signature to contract
            signed_contract_path = self.add_signature_to_contract(contract_path, signature_data)
            
            if not signed_contract_path:
                return {
                    "success": False,
                    "message": "Failed to add signature to contract"
                }
            
            # Send final documents
            send_result = self.send_final_documents(
                email_template=email_template,
                contract_path=signed_contract_path,
                creator_email=creator_email,
                user_email=user_email
            )
            
            if not send_result["success"]:
                return send_result
            
            return {
                "success": True,
                "message": "Contract signed and documents sent successfully!",
                "signed_contract_path": signed_contract_path,
                "confirmation": send_result["message"],
                "details": send_result.get("details", {})
            }
            
        except Exception as e:
            print(f"Error processing signature request: {str(e)}")
            traceback.print_exc()
            return {
                "success": False,
                "message": f"Error processing signature: {str(e)}"
            }
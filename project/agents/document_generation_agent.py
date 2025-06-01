import os
import json
import autogen
import traceback
from typing import Dict, Any, Tuple
from dotenv import load_dotenv
import groq
from datetime import datetime
import re
from fpdf import FPDF
import tempfile
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

# Load environment variables
load_dotenv()

__all__ = ['DocumentGenerationAgent']

class DocumentGenerationAgent:
    def __init__(self):
        # Initialize Groq client
        self.groq_api_key = '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'
        if not self.groq_api_key:
            raise ValueError("Groq API key not found in environment variables")
            
        self.groq_client = groq.Groq(api_key=self.groq_api_key)
        
        # Initialize AutoGen assistant with Groq
        self.assistant = autogen.AssistantAgent(
            name="DocumentGenerator",
            llm_config={
                "config_list": [{
                    "model": "llama-3.3-70b-versatile",
                    "api_key": self.groq_api_key,
                    "base_url": "https://api.groq.com/v1",
                    "api_type": "groq"
                }],
                "temperature": 0.7,
            },
            system_message="""You are a Document Generation agent that creates professional emails and contracts
            based on campaign proposal data. You generate legally sound contracts and compelling email templates."""
        )

    def generate_email_template(self, form_data: Dict[str, Any]) -> str:
        """Generate an email template based on the form data."""
        try:
            print("[DEBUG] Generating email template...")
            
            # Extract all relevant data including new fields
            recruiter_type = form_data.get('recruiterType', '')
            recruiter_full_name = form_data.get('recruiterFullName', '') 
            recruiter_name = form_data.get('recruiterName', '')
            recruiter_email = form_data.get('recruiterEmail', '')
            budget = form_data.get('budget', 0)
            proposal = form_data.get('proposal', '')
            creator_details = form_data.get('creator_details', {})
            
            # Extract new fields
            campaign_start = form_data.get('campaignStart', '')
            campaign_end = form_data.get('campaignEnd', '')
            deliverables = form_data.get('deliverables', '')
            content_requirements = form_data.get('contentRequirements', '')
            payment_terms = form_data.get('paymentTerms', 'full')
            exclusivity = "Yes" if form_data.get('exclusivity', False) else "No"
            revisions = form_data.get('revisions', '2')
            
            # Map payment terms to descriptions
            payment_terms_map = {
                "full": "100% payment upfront",
                "split": "50% payment upfront, 50% upon completion",
                "completion": "100% payment upon completion",
                "milestone": "Payment based on agreed milestones"
            }
            payment_description = payment_terms_map.get(payment_terms, payment_terms)
            
            creator_name = creator_details.get('username', '')
            platform = creator_details.get('platform', '')
            
            # Add company details to ensure complete emails
            company_address = "123 Tech Park, Innovation District, San Francisco, CA 94107"
            company_phone = "+1 (555) 123-4567"
            company_email = "creatorconnect@gmail.com"
            website = "www.creatorconnect.com"
            
            # Use Groq for email generation with detailed prompt and explicit instructions
            completion = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert email copywriter specialized in influencer marketing outreach. 
                        Create professional outreach emails for brands/agencies reaching out to creators.
                        Format the email with SUBJECT and BODY clearly marked.
                        
                        IMPORTANT GUIDELINES:
                        1. DO NOT use ANY placeholders like [name], [company], etc. - use the actual provided data
                        2. Make clear the email is from CreatorConnect representing the client company
                        3. Include a professional signature with complete contact details at the end
                        4. Make the emails personalized, specific, and compelling with clear next steps
                        5. Always address the creator by their username and include their platform"""
                    },
                    {
                        "role": "user",
                        "content": f"""Generate a detailed and personalized email template for a {recruiter_type} named "{recruiter_name}" 
                        with contact person "{recruiter_full_name}" reaching out to creator "{creator_name}" on {platform}.
                        
                        CAMPAIGN DETAILS:
                        - Budget: ${budget}
                        - Campaign period: {campaign_start} to {campaign_end}
                        - Deliverables: {deliverables}
                        - Content requirements: {content_requirements}
                        - Payment terms: {payment_description}
                        - Exclusivity required: {exclusivity}
                        - Revision allowance: {revisions} revision(s)
                        
                        Additional proposal details:
                        {proposal}
                        
                        COMPANY DETAILS:
                        - Email: {company_email}
                        - Address: {company_address}
                        - Phone: {company_phone}
                        - Website: {website}
                        
                        Format as:
                        SUBJECT: [Clear and compelling subject line]
                        
                        BODY:
                        [Professional email with:
                        1. Warm, personalized greeting addressed to the creator by name
                        2. Clear introduction of CreatorConnect as a platform representing the brand/agency
                        3. Brief introduction of the brand/agency and why this creator was specifically chosen
                        4. Clear campaign details with all specifics
                        5. Clear compensation and payment terms
                        6. Specific next steps and call to action
                        7. Professional sign-off including CreatorConnect and client details]
                        
                        Make the email concise yet comprehensive, with NO PLACEHOLDERS, using all data provided."""
                    }
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            email_template = completion.choices[0].message.content
            print(f"[DEBUG] Generated detailed email template")
            
            return email_template
            
        except Exception as e:
            print(f"Error generating email template: {str(e)}")
            return f"Error generating email: {str(e)}"

    def generate_contract(self, form_data: Dict[str, Any]) -> str:
        """Generate a contract PDF based on the form data with enhanced details."""
        try:
            print("[DEBUG] Generating detailed contract...")
            
            # Extract all relevant data including new fields
            recruiter_type = form_data.get('recruiterType', '')
            recruiter_full_name = form_data.get('recruiterFullName', '')
            recruiter_name = form_data.get('recruiterName', '')
            recruiter_email = form_data.get('recruiterEmail', '')
            budget = form_data.get('budget', 0)
            proposal = form_data.get('proposal', '')
            creator_details = form_data.get('creator_details', {})
            
            # Extract new fields
            campaign_start = form_data.get('campaignStart', '')
            campaign_end = form_data.get('campaignEnd', '')
            deliverables = form_data.get('deliverables', '')
            content_requirements = form_data.get('contentRequirements', '')
            payment_terms = form_data.get('paymentTerms', 'full')
            exclusivity = form_data.get('exclusivity', False)
            revisions = form_data.get('revisions', '2')
            
            creator_name = creator_details.get('username', '')
            platform = creator_details.get('platform', '')
            
            # Map payment terms to descriptions
            payment_terms_map = {
                "full": "100% payment upfront",
                "split": "50% payment upfront, 50% upon completion",
                "completion": "100% payment upon completion", 
                "milestone": "Payment based on agreed milestones"
            }
            payment_description = payment_terms_map.get(payment_terms, payment_terms)
            
            # Add company details to ensure complete contracts
            company_address = "123 Tech Park, Innovation District, San Francisco, CA 94107"
            company_phone = "+1 (555) 123-4567"
            company_email = "creatorconnect@gmail.com"
            website = "www.creatorconnect.com"
            
            # Use Groq for contract generation with improved prompt
            completion = self.groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": """You are a legal contract generator specialized in influencer marketing agreements.
                        Create comprehensive, professionally formatted contracts with all necessary clauses.
                        Use clear legal language but make it accessible.
                        Include all relevant details and protections for both parties.
                        
                        IMPORTANT GUIDELINES:
                        1. DO NOT use placeholders like [name], [company], etc. - use the actual provided data
                        2. Create sections with clear headings and numbered clauses
                        3. Include complete details of all parties and contract terms
                        4. Use simple formatting - avoid markdown, asterisks, or other special characters
                        5. Create a professional plain-text document suitable for PDF conversion"""
                    },
                    {
                        "role": "user",
                        "content": f"""Generate a detailed influencer marketing contract between 
                        {recruiter_type} "{recruiter_name}" (represented by {recruiter_full_name}) and 
                        creator "{creator_name}" on {platform}.
                        
                        CAMPAIGN DETAILS:
                        - Budget: ${budget}
                        - Campaign period: {campaign_start} to {campaign_end}
                        - Deliverables: {deliverables}
                        - Content requirements: {content_requirements}
                        - Payment terms: {payment_description}
                        - Exclusivity clause required: {"Yes" if exclusivity else "No"}
                        - Content revisions allowed: {revisions}
                        - Company contact email: {recruiter_email}
                        
                        CREATORCONNECT DETAILS:
                        - Email: {company_email}
                        - Address: {company_address}
                        - Phone: {company_phone}
                        - Website: {website}
                        
                        Additional campaign details:
                        {proposal}
                        
                        Include the following sections with comprehensive details for each:
                        1. PARTIES TO THE AGREEMENT - Full details of both parties
                        2. EFFECTIVE DATE AND TERM - Campaign start and end dates with clear timelines
                        3. SCOPE OF SERVICES - Detailed description of all deliverables and content requirements
                        4. COMPENSATION AND PAYMENT TERMS - Clear payment schedule and methods
                        5. CONTENT REQUIREMENTS - Specific guidelines, hashtags, and requirements
                        6. APPROVAL PROCESS - How content will be reviewed and approved
                        7. CONTENT REVISIONS - Number of revisions allowed and process
                        8. CONTENT RIGHTS AND USAGE - Who owns the content and how it can be used
                        9. EXCLUSIVITY TERMS - Restrictions on working with competitors {"if applicable" if not exclusivity else ""}
                        10. CONFIDENTIALITY - Handling of confidential information
                        11. CANCELLATION POLICY - Terms for cancellation by either party
                        12. TERMINATION CONDITIONS - Circumstances for contract termination
                        13. INDEMNIFICATION - Protection against claims
                        14. DISPUTE RESOLUTION - How disputes will be handled
                        15. GOVERNING LAW - Which laws apply to the agreement
                        16. SIGNATURES - Signature blocks for both parties
                        
                        Format as a plain text legal contract with clear section headings. 
                        DO NOT use any special formatting, markdown or asterisks that could cause rendering issues."""
                    }
                ],
                temperature=0.7,
                max_tokens=3000
            )
            
            contract_content = completion.choices[0].message.content
            
            # Generate enhanced PDF with better formatting
            pdf = FPDF()
            pdf.add_page()
            
            # Add company logo/branding
            pdf.set_font("Arial", 'B', 20)
            pdf.set_text_color(0, 102, 204)  # Blue color for header
            pdf.cell(200, 10, txt="CREATOR CONNECT", ln=True, align='C')
            pdf.set_font("Arial", 'B', 16)
            pdf.cell(200, 10, txt="INFLUENCER MARKETING AGREEMENT", ln=True, align='C')
            pdf.ln(10)
            
            # Add professional header with information
            pdf.set_font("Arial", 'B', 12)
            pdf.set_text_color(0, 0, 0)  # Black text
            pdf.cell(200, 10, txt=f"Date: {datetime.now().strftime('%B %d, %Y')}", ln=True)
            pdf.cell(200, 10, txt=f"Creator: {creator_name} ({platform})", ln=True)
            pdf.cell(200, 10, txt=f"Client: {recruiter_name} ({recruiter_type})", ln=True)
            pdf.ln(10)
            
            # Add contract content with improved formatting
            pdf.set_font("Arial", size=10)
            
            # Process and add contract content with better formatting
            for line in contract_content.split('\n'):
                # Remove any asterisks or markdown formatting that might come from the LLM
                line = re.sub(r'\*\*(.*?)\*\*', r'\1', line)  # Remove bold markdown
                line = re.sub(r'\*(.*?)\*', r'\1', line)  # Remove italic markdown
                
                # Check if line is a main section heading (all caps or starts with number and period)
                if line.strip().isupper() or (line.strip() and line.strip()[0].isdigit() and '.' in line[:5]):
                    pdf.ln(5)  # Add space before new section
                    pdf.set_font("Arial", 'B', 12)
                    pdf.set_fill_color(240, 240, 240)  # Light gray background
                    pdf.cell(0, 8, txt=line, ln=True, fill=True)
                    pdf.set_font("Arial", size=10)
                    pdf.ln(2)
                # Check if line is a subsection (starts with letter+period or number+number)
                elif re.match(r'^[a-zA-Z]\.|^\d+\.\d+', line.strip()):
                    pdf.set_font("Arial", 'B', 10)
                    pdf.cell(0, 6, txt=line, ln=True)
                    pdf.set_font("Arial", size=10)
                else:
                    # Regular text - better word wrapping
                    if line.strip():  # Only process non-empty lines
                        pdf.multi_cell(0, 5, txt=line)
                        pdf.ln(1)  # Small space between paragraphs
            
            # Add signature section with clean formatting
            pdf.ln(10)
            pdf.set_font("Arial", 'B', 12)
            pdf.set_fill_color(240, 240, 240)  # Light gray background
            pdf.cell(0, 8, txt="SIGNATURES", ln=True, fill=True)
            pdf.ln(5)
            
            # Client signature block
            pdf.set_font("Arial", 'B', 10)
            pdf.cell(95, 10, txt="CLIENT:", ln=True)
            pdf.set_font("Arial", size=10)
            pdf.cell(95, 5, txt=f"Name: {recruiter_full_name}", ln=True)
            pdf.cell(95, 5, txt=f"Company: {recruiter_name}", ln=True)
            pdf.cell(95, 5, txt=f"Title: {recruiter_type}", ln=True)
            pdf.cell(95, 5, txt=f"Email: {recruiter_email}", ln=True)
            pdf.cell(95, 5, txt="Signature: _________________________", ln=True)
            pdf.cell(95, 5, txt="Date: _________________________", ln=True)
            pdf.ln(10)
            
            # Creator signature block
            pdf.set_font("Arial", 'B', 10)
            pdf.cell(95, 10, txt="CREATOR:", ln=True)
            pdf.set_font("Arial", size=10)
            pdf.cell(95, 5, txt=f"Name: {creator_name}", ln=True)
            pdf.cell(95, 5, txt=f"Platform: {platform}", ln=True)
            pdf.cell(95, 5, txt="Signature: _________________________", ln=True)
            pdf.cell(95, 5, txt="Date: _________________________", ln=True)
            pdf.ln(10)
            
            # Add CreatorConnect facilitation notice
            pdf.set_font("Arial", 'I', 9)
            pdf.cell(0, 10, txt="This agreement is facilitated by CreatorConnect", ln=True)
            pdf.cell(0, 5, txt=f"Contact: {company_email} | {company_phone}", ln=True)
            pdf.cell(0, 5, txt=f"Address: {company_address}", ln=True)
            
            # Create temp file for the PDF
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
            pdf_path = temp_file.name
            pdf.output(pdf_path)
            
            print(f"[DEBUG] Generated enhanced contract at {pdf_path}")
            
            return pdf_path
            
        except Exception as e:
            print(f"Error generating contract: {str(e)}")
            traceback.print_exc()
            return None

    def process_form_data(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process form data and generate both email template and contract PDF."""
        try:
            result = {
                "success": True,
                "email_template": self.generate_email_template(form_data),
                "contract_path": self.generate_contract(form_data),
                "message": "Documents generated successfully!"
            }
            return result
        except Exception as e:
            print(f"Error processing form data: {str(e)}")
            return {
                "success": False,
                "message": f"Error generating documents: {str(e)}"
            }

# Example usage
if __name__ == "__main__":
    document_agent = DocumentGenerationAgent()
    sample_form_data = {
        "recruiterType": "brand",
        "recruiterName": "Acme Corporation",
        "budget": 5000,
        "proposal": "We're looking for a 3-post campaign highlighting our new product line.",
        "creator_details": {
            "username": "Instagrammer500",
            "platform": "Instagram",
            "followers": 1000000
        }
    }
    result = document_agent.process_form_data(sample_form_data)
    print(json.dumps(result, indent=2))
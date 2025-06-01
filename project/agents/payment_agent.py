import os
import razorpay
from typing import Dict, Any
from datetime import datetime
import uuid
import hmac
import hashlib
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class PaymentAgent:
    def __init__(self):
        self.razorpay_key_id = 'rzp_test_WhYxs6g85FsA5a'
        self.razorpay_key_secret = 'nFs9CBRvozQ4ONIPsun3ynFe'
        if not self.razorpay_key_id or not self.razorpay_key_secret:
            raise ValueError("Razorpay API keys not found in environment variables")
            
        self.client = razorpay.Client(auth=(self.razorpay_key_id, self.razorpay_key_secret))
        
    def create_order(self, amount: float, creator_email: str, description: str) -> Dict[str, Any]:
        """Create a Razorpay order for the specified amount."""
        try:
            # Convert amount to paise (Razorpay uses smallest currency unit)
            amount_paise = int(amount * 100)
            
            # Create a unique receipt ID
            receipt_id = f"rcpt_{str(uuid.uuid4())[:8]}"
            
            # Create the order
            order_data = {
                'amount': amount_paise,
                'currency': 'INR',
                'receipt': receipt_id,
                'notes': {
                    'creator_email': creator_email,
                    'description': description,
                    'timestamp': datetime.now().isoformat(),
                    'transaction_id': str(uuid.uuid4())
                }
            }
            
            order = self.client.order.create(data=order_data)
            
            return {
                "success": True,
                "order_id": order['id'],
                "amount": amount,
                "currency": "INR",
                "key_id": self.razorpay_key_id
            }
            
        except Exception as e:
            print(f"Error creating Razorpay order: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to set up payment: {str(e)}"
            }
            
    def verify_payment(self, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Verify that a payment has been successfully processed."""
        try:
            # Extract the necessary data
            razorpay_order_id = payment_data.get('razorpay_order_id')
            razorpay_payment_id = payment_data.get('razorpay_payment_id')
            razorpay_signature = payment_data.get('razorpay_signature')
            
            if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
                return {
                    "success": False,
                    "message": "Missing payment verification data"
                }
            
            # Verify the signature
            # The message to verify is order_id + "|" + payment_id
            msg = f"{razorpay_order_id}|{razorpay_payment_id}"
            generated_signature = hmac.new(
                bytes(self.razorpay_key_secret, 'utf-8'),
                msg=bytes(msg, 'utf-8'),
                digestmod=hashlib.sha256
            ).hexdigest()
            
            if generated_signature != razorpay_signature:
                return {
                    "success": False,
                    "message": "Invalid payment signature"
                }
            
            # Get payment details from Razorpay
            payment = self.client.payment.fetch(razorpay_payment_id)
            
            # Get order details to retrieve creator email from notes
            order = self.client.order.fetch(razorpay_order_id)
            
            return {
                "success": True,
                "status": payment['status'],
                "amount": float(payment['amount']) / 100,  # Convert back from paise
                "creator_email": order['notes'].get('creator_email'),
                "transaction_id": order['notes'].get('transaction_id') or payment['id'],
                "payment_method": payment.get('method', 'Razorpay'),
                "payment_date": datetime.fromtimestamp(payment['created_at']).isoformat()
            }
            
        except Exception as e:
            print(f"Error verifying payment: {str(e)}")
            return {
                "success": False,
                "message": f"Failed to verify payment: {str(e)}"
            }
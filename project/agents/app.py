from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import os
import uuid
import json
from influencer_search_engine import InfluencerSearchEngine
from document_generation_agent import DocumentGenerationAgent
from esignature_agent import ESignatureAgent
from payment_agent import PaymentAgent
import base64

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load mock data from data folder
def load_mock_data():
    try:
        with open('data/mock_instagram_influencers.json', 'r') as f:
            instagram_profiles = json.load(f)
        with open('data/mock_youtube_influencers.json', 'r') as f:
            youtube_profiles = json.load(f)
        return instagram_profiles + youtube_profiles
    except Exception as e:
        print(f"Error loading mock data: {e}")
        return []

# Initialize agents
mock_profiles = load_mock_data()
search_engine = InfluencerSearchEngine()
document_agent = DocumentGenerationAgent()
esignature_agent = ESignatureAgent()
payment_agent = PaymentAgent()

@app.route('/api/search', methods=['POST'])
def search_creators():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No search criteria provided'}), 400

        session_id = data.get('sessionId', str(uuid.uuid4()))

        # Use the search engine to filter profiles
        filtered_results = search_engine.search(data)
        
        return jsonify({
            'sessionId': session_id,
            'results': filtered_results
        })
        
    except Exception as e:
        error_msg = f"Error in search endpoint: {str(e)}"
        print(error_msg)
        return jsonify({'error': error_msg}), 500

@app.route('/api/negotiate', methods=['POST'])
def generate_documents():
    try:
        form_data = request.json
        if not form_data:
            return jsonify({'error': 'No form data provided'}), 400

        # Process form data and generate documents
        result = document_agent.process_form_data(form_data)
        
        if not result["success"]:
            return jsonify({'error': result["message"]}), 500
            
        # Return the email template and a temporary URL to download the contract
        response = {
            'success': True,
            'email_template': result['email_template'],
            'contract_available': bool(result.get('contract_path')),
            'contract_id': str(uuid.uuid4()) if result.get('contract_path') else None,
            'message': result['message']
        }
        
        # Store the contract path temporarily (in a real app, you'd use a database)
        # For demo purposes, we're using a global variable
        if result.get('contract_path'):
            app.config[response['contract_id']] = result['contract_path']
        
        return jsonify(response)
        
    except Exception as e:
        error_msg = f"Error generating documents: {str(e)}"
        print(error_msg)
        return jsonify({'error': error_msg}), 500

@app.route('/api/download-contract/<contract_id>', methods=['GET'])
def download_contract(contract_id):
    try:
        # Get the contract path from the config
        contract_path = app.config.get(contract_id)
        if not contract_path:
            return jsonify({'error': 'Contract not found'}), 404
            
        # Send the file
        return send_file(contract_path, as_attachment=True, download_name='influencer_contract.pdf')
        
    except Exception as e:
        error_msg = f"Error downloading contract: {str(e)}"
        print(error_msg)
        return jsonify({'error': error_msg}), 500

@app.route('/api/signature/upload', methods=['POST'])
def upload_signature():
    try:
        print("[DEBUG] Signature upload endpoint called")
        data = request.json
        if not data:
            print("[ERROR] No data provided in request")
            return jsonify({'error': 'No data provided'}), 400
            
        contract_id = data.get('contract_id')
        signature_data = data.get('signature_data')
        email_template = data.get('email_template')
        creator_email = data.get('creator_email')
        user_email = data.get('user_email')
        
        print(f"[DEBUG] Received signature request for contract_id: {contract_id}")
        print(f"[DEBUG] Signature data length: {len(signature_data) if signature_data else 'None'}")
        
        if not contract_id or not signature_data:
            print("[ERROR] Missing required fields")
            return jsonify({'error': 'Missing required fields (contract_id, signature_data)'}), 400
            
        # Get the contract path from the config
        contract_path = app.config.get(contract_id)
        if not contract_path:
            print(f"[ERROR] Contract not found for ID: {contract_id}")
            return jsonify({'error': 'Contract not found'}), 404
            
        print(f"[DEBUG] Found contract path: {contract_path}")
        
        # Process the signature request
        result = esignature_agent.process_signature_request(
            contract_id=contract_id,
            signature_data=signature_data,
            email_template=email_template,
            creator_email=creator_email,
            user_email=user_email,
            contract_path=contract_path
        )
        
        if not result["success"]:
            print(f"[ERROR] Signature processing failed: {result['message']}")
            return jsonify({'error': result["message"]}), 500
            
        # Store the signed contract path
        signed_contract_id = str(uuid.uuid4())
        app.config[signed_contract_id] = result["signed_contract_path"]
        
        print(f"[DEBUG] Signature processing successful. Signed contract ID: {signed_contract_id}")
        
        # Return success with signed contract ID
        return jsonify({
            'success': True,
            'signed_contract_id': signed_contract_id,
            'confirmation': result.get("confirmation", "Contract has been signed successfully."),
            'details': result.get("details", {})
        })
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        error_msg = f"Error processing signature: {str(e)}"
        print(f"[ERROR] {error_msg}")
        return jsonify({'error': error_msg}), 500

@app.route('/api/download-signed-contract/<signed_contract_id>', methods=['GET'])
def download_signed_contract(signed_contract_id):
    try:
        # Get the signed contract path from the config
        signed_contract_path = app.config.get(signed_contract_id)
        if not signed_contract_path:
            return jsonify({'error': 'Signed contract not found'}), 404
            
        # Send the file
        return send_file(signed_contract_path, as_attachment=True, download_name='signed_influencer_contract.pdf')
        
    except Exception as e:
        error_msg = f"Error downloading signed contract: {str(e)}"
        print(error_msg)
        return jsonify({'error': error_msg}), 500

@app.route('/api/payment/create-order', methods=['POST'])
def create_payment_order():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        amount = data.get('amount')
        creator_email = data.get('creator_email')
        description = data.get('description', 'Creator payment')
        
        if not amount or not creator_email:
            return jsonify({'error': 'Missing required fields (amount, creator_email)'}), 400
            
        # Create a Razorpay order
        result = payment_agent.create_order(
            amount=float(amount), 
            creator_email=creator_email, 
            description=description
        )
        
        if not result["success"]:
            return jsonify({'error': result["message"]}), 500
            
        return jsonify(result)
        
    except Exception as e:
        error_msg = f"Error creating payment order: {str(e)}"
        print(f"[ERROR] {error_msg}")
        return jsonify({'error': error_msg}), 500

@app.route('/api/payment/verify', methods=['POST'])
def verify_payment():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        # Verify the Razorpay payment
        result = payment_agent.verify_payment(data)
        
        if not result["success"]:
            return jsonify({'error': result["message"]}), 500
            
        return jsonify(result)
        
    except Exception as e:
        error_msg = f"Error verifying payment: {str(e)}"
        print(f"[ERROR] {error_msg}")
        return jsonify({'error': error_msg}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3001))
    app.run(host='0.0.0.0', port=port, debug=True)
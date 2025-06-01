"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Check, X, Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import SignaturePad from './signature-pad';
import PaymentForm from './payment-form';
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const API_BASE_URL = 'http://localhost:3001/api';

interface DocumentGenerationResponse {
  success: boolean;
  email_template: string;
  contract_available?: boolean;
  contract_id?: string;
  message?: string;
}

interface DocumentGeneratorProps {
  formData: {
    recruiterType: string;
    recruiterName: string;
    budget: string | number;
    proposal: string;
    recruiterEmail?: string;
    creator_details: {
      username: string;
      platform: string;
      followers: number;
      [key: string]: any;
    };
  };
  onDocumentsGenerated?: (emailTemplate: string, contractId: string) => void;
}

export default function DocumentGenerator({ formData, onDocumentsGenerated }: DocumentGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [showAcceptReject, setShowAcceptReject] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signedContractId, setSignedContractId] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [processingSignature, setProcessingSignature] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const generateDocuments = async () => {
    setLoading(true);
    try {
      // Change the endpoint from /generate-documents to /negotiate
      const response = await axios.post<DocumentGenerationResponse>(`${API_BASE_URL}/negotiate`, formData);
      
      if (response.data.success) {
        setEmailTemplate(response.data.email_template);
        if (response.data.contract_available) {
          setContractId(response.data.contract_id ?? null);
        }
        
        // Call the callback if provided
        if (onDocumentsGenerated) {
          onDocumentsGenerated(response.data.email_template, response.data.contract_id || "");
        }
        
        setShowAcceptReject(true);
        toast.success("Documents generated successfully!");
      } else {
        toast.error(response.data.message || "Failed to generate documents");
      }
    } catch (error) {
      console.error("Error generating documents:", error);
      toast.error("Failed to generate documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadContract = () => {
    if (contractId) {
      window.open(`${API_BASE_URL}/download-contract/${contractId}`, '_blank');
    }
  };

  const handleAccept = () => {
    // Show signature pad component
    setShowSignaturePad(true);
    setShowAcceptReject(false);
  };

  const handleReject = () => {
    setEmailTemplate(null);
    setContractId(null);
    setShowAcceptReject(false);
    toast.info("Contract rejected. You can modify your proposal and try again.");
  };

  interface SignatureUploadResponse {
    success: boolean;
    signed_contract_id?: string;
    confirmation?: string;
    error?: string;
  }

  const handleSignatureComplete = async (signatureData: string) => {
    setProcessingSignature(true);
    try {
      console.log("Signature complete triggered, data length:", signatureData.length);
      
      // Get creator email from form data
      const creatorEmail = formData.creator_details.email || 
                          `${formData.creator_details.username}@example.com`; // Fallback
    
      // Get user email (recruiter)
      const userEmail = formData.recruiterEmail || 'user@example.com'; // Fallback
      
      console.log("Preparing to send signature to backend", {
        contractId,
        creatorEmail,
        userEmail,
        dataLength: signatureData.length
      });
      
      // Send signature data to backend
      const response = await axios.post<SignatureUploadResponse>(`${API_BASE_URL}/signature/upload`, {
        contract_id: contractId,
        signature_data: signatureData,
        email_template: emailTemplate,
        creator_email: creatorEmail,
        user_email: userEmail
      });
      
      console.log("Signature upload response:", response.data);
      
      if (response.data.success) {
        setSignedContractId(response.data.signed_contract_id || null);
        setConfirmationMessage(response.data.confirmation || null);
        setShowSignaturePad(false);
        // Add this animation and notification
        toast.success("Signature added successfully! Your contract now has a blue-green signature that makes it easy to see.", {
          duration: 5000,
          icon: "✅",
        });
      } else {
        toast.error(response.data.error || "Failed to process signature");
      }
    } catch (error: any) {
      console.error("Error processing signature:", error);
      // More detailed error logging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      toast.error(`Failed to process signature: ${error.message}`);
    } finally {
      setProcessingSignature(false);
    }
  };

  const handleCancelSignature = () => {
    setShowSignaturePad(false);
    setShowAcceptReject(true);
  };

  const downloadSignedContract = () => {
    if (signedContractId) {
      window.open(`${API_BASE_URL}/download-signed-contract/${signedContractId}`, '_blank');
    }
  };

  // Function to format email display (separate subject and body)
  const formatEmailDisplay = (emailTemplate: string) => {
    const subjectMatch = emailTemplate.match(/SUBJECT: (.*?)(?=\n\nBODY:)/s);
    const bodyMatch = emailTemplate.match(/BODY:([\s\S]*)/);
    
    const subject = subjectMatch ? subjectMatch[1].trim() : "";
    const body = bodyMatch ? bodyMatch[1].trim() : emailTemplate;
    
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Subject:</h3>
          <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">{subject}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Body:</h3>
          <div className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded whitespace-pre-wrap">
            {body}
          </div>
        </div>
      </div>
    );
  };

  const handlePayNow = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentComplete = (paymentData: any) => {
    setPaymentComplete(true);
    setPaymentData(paymentData);
    setShowPaymentForm(false);
    toast.success("Payment complete! The creator has been notified.");
  };

  const handleCancelPayment = () => {
    setShowPaymentForm(false);
  };

  return (
    <div className="space-y-6">
      {!emailTemplate && !showSignaturePad && !signedContractId && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button 
            onClick={generateDocuments} 
            disabled={loading}
            className="w-full relative group overflow-hidden h-14 bg-gradient-to-r from-cc-green to-cc-green-dark text-black hover:shadow-[0_0_25px_rgba(0,255,148,0.5)] transition-all duration-300 font-mono"
          >
            <div className="absolute inset-0 w-full h-full bg-cc-green/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span className="font-semibold tracking-wide">Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Sparkles className="mr-2 h-5 w-5" />
                <span className="font-semibold tracking-wide">Generate Email & Contract</span>
              </div>
            )}
          </Button>
        </motion.div>
      )}

      {showSignaturePad && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SignaturePad 
            onSignatureComplete={handleSignatureComplete} 
            onCancel={handleCancelSignature} 
          />
        </motion.div>
      )}

      {emailTemplate && !showSignaturePad && !signedContractId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden bg-gradient-to-b from-cc-gray-dark to-cc-black border-cc-gray rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="p-1">
              <div className="bg-gradient-to-r from-cc-green/20 to-transparent p-4 rounded-t-lg border-b border-cc-gray">
                <h2 className="text-xl font-bold font-mono text-cc-white flex items-center">
                  <span className="bg-cc-green text-cc-black py-1 px-2 rounded text-sm mr-2">EMAIL</span>
                  Preview
                </h2>
              </div>
              <div className="p-5 text-cc-white">
                {formatEmailDisplay(emailTemplate)}
              </div>
            
              {contractId && (
                <div className="px-5 pb-5">
                  <Button
                    onClick={downloadContract}
                    className="w-full mb-4 bg-cc-gray hover:bg-cc-gray-light text-cc-white border border-cc-gray-light/50 shadow-lg h-12 transition-all duration-300"
                  >
                    <Download className="mr-2 h-5 w-5 text-cc-green" />
                    <span className="font-mono">Download Contract PDF</span>
                  </Button>
                </div>
              )}
            
              {showAcceptReject && (
                <div className="p-5 pt-0 grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleAccept}
                    className="bg-gradient-to-r from-cc-green to-cc-green-dark hover:brightness-110 text-cc-black font-mono h-12 transition-all duration-300"
                  >
                    <Check className="mr-2 h-5 w-5" />
                    Accept
                  </Button>
                  
                  <Button
                    onClick={handleReject}
                    className="bg-cc-gray hover:bg-cc-gray-light text-cc-white font-mono border border-cc-gray-light/50 h-12 transition-all duration-300"
                  >
                    <X className="mr-2 h-5 w-5" />
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {signedContractId && confirmationMessage && !showPaymentForm && !paymentComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden bg-gradient-to-b from-cc-gray-dark to-cc-black border-cc-gray rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="p-1">
              <div className="bg-gradient-to-r from-cc-green/20 to-transparent p-4 rounded-t-lg border-b border-cc-gray">
                <h2 className="text-xl font-bold font-mono text-cc-white flex items-center">
                  <Sparkles className="h-5 w-5 text-cc-green mr-2" />
                  Contract Finalized!
                </h2>
              </div>
              
              <div className="p-5">
                <div className="bg-gradient-to-r from-cc-green/10 to-transparent border border-cc-green/30 rounded-xl p-5 mb-5 backdrop-blur-sm">
                  <div className="bg-cc-green text-cc-black rounded-full w-10 h-10 flex items-center justify-center mb-3">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="text-cc-white">{confirmationMessage}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={downloadSignedContract}
                    className="bg-cc-gray hover:bg-cc-gray-light text-cc-white border border-cc-gray-light/50 transition-all duration-300 h-12"
                  >
                    <Download className="mr-2 h-5 w-5 text-cc-green" />
                    <span className="font-mono">Get Contract</span>
                  </Button>
                  
                  <Button
                    onClick={handlePayNow}
                    className="bg-gradient-to-r from-cc-green to-cc-green-dark hover:brightness-110 text-cc-black transition-all duration-300 h-12"
                  >
                    <DollarSign className="mr-2 h-5 w-5" />
                    <span className="font-mono">Pay Creator</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {showPaymentForm && (
        <PaymentForm
          amount={typeof formData.budget === 'string' ? parseFloat(formData.budget) : formData.budget}
          creatorEmail={formData.creator_details.email || `${formData.creator_details.username}@example.com`}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handleCancelPayment}
        />
      )}

      {paymentComplete && paymentData && (
        <Card className="p-4 bg-[#1A1A1A] border-[#2A2A2A]">
          <h2 className="text-xl font-bold font-mono text-white mb-4">Payment Successful!</h2>
          
          <div className="bg-green-900/20 border border-green-500 rounded-md p-4 mb-4">
            <Check className="h-6 w-6 text-green-500 mb-2" />
            <p className="text-white">Payment of ${paymentData.amount.toFixed(2)} has been sent to {paymentData.creator_email}.</p>
            <p className="text-white text-sm mt-2">Transaction ID: {paymentData.transaction_id}</p>
            <p className="text-white text-sm">Date: {new Date(paymentData.payment_date).toLocaleString()}</p>
          </div>
          
          <Button
            onClick={downloadSignedContract}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-mono"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Signed Contract
          </Button>
        </Card>
      )}
    </div>
  );
}
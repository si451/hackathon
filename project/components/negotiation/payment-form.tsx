"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, X, CreditCard, DollarSign } from "lucide-react";
import { toast } from "sonner";
import axios from 'axios';
import Script from 'next/script';

// Define response types
interface OrderResponse {
  success: boolean;
  order_id?: string;
  key_id?: string;
  amount?: number;
  currency?: string;
  message?: string;
}

interface PaymentVerifyResponse {
  success: boolean;
  message?: string;
  status?: string;
  amount?: number;
  creator_email?: string;
  transaction_id?: string;
  payment_method?: string;
  payment_date?: string;
}

const API_BASE_URL = 'http://localhost:3001/api';

// Define Window interface with Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentFormProps {
  amount: number;
  creatorEmail: string;
  onPaymentComplete: (paymentData: any) => void;
  onCancel: () => void;
}

export default function PaymentForm({ amount, creatorEmail, onPaymentComplete, onCancel }: PaymentFormProps) {
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [keyId, setKeyId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Create a Razorpay order when the component loads
    const createOrder = async () => {
      try {
        const response = await axios.post<OrderResponse>(`${API_BASE_URL}/payment/create-order`, {
          amount,
          creator_email: creatorEmail,
          description: `Payment for creator: ${creatorEmail}`
        });

        if (response.data.success) {
          setOrderId(response.data.order_id || null);
          setKeyId(response.data.key_id || null);
        } else {
          setError(response.data.message || "Failed to set up payment");
          toast.error(response.data.message || "Failed to set up payment");
        }
      } catch (error: any) {
        console.error("Error creating order:", error);
        setError(error.message || "Failed to set up payment");
        toast.error("Failed to set up payment. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [amount, creatorEmail]);

  const handlePayment = () => {
    setProcessing(true);

    if (!window.Razorpay || !orderId || !keyId) {
      setError("Payment system not ready. Please try again.");
      setProcessing(false);
      return;
    }

    const options = {
      key: keyId,
      amount: amount * 100, // in paise
      currency: "INR",
      name: "CreatorConnect",
      description: `Payment to ${creatorEmail}`,
      order_id: orderId,
      handler: async function (response: any) {
        try {
          // Verify the payment with backend
          const verifyResponse = await axios.post<PaymentVerifyResponse>(`${API_BASE_URL}/payment/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyResponse.data.success) {
            toast.success("Payment successful!");
            onPaymentComplete(verifyResponse.data);
          } else {
            setError(verifyResponse.data.message || "Payment verification failed");
            toast.error(verifyResponse.data.message || "Payment verification failed");
          }
        } catch (error: any) {
          console.error("Error verifying payment:", error);
          setError(error.message || "Payment verification failed");
          toast.error("Payment verification failed. Please contact support.");
        } finally {
          setProcessing(false);
        }
      },
      prefill: {
        email: creatorEmail,
      },
      theme: {
        color: "#00FF94",
      },
      modal: {
        ondismiss: function() {
          setProcessing(false);
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  // Handle Razorpay script loading
  const handleRazorpayScriptLoad = () => {
    setRazorpayLoaded(true);
  };

  if (loading) {
    return (
      <Card className="p-4 bg-[#1A1A1A] border-[#2A2A2A]">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-bold font-mono text-white">
            Setting Up Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#00FF94]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-gradient-to-b from-cc-gray-dark to-cc-black border-cc-gray rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <div className="p-1">
        <div className="bg-gradient-to-r from-cc-green/20 to-transparent p-4 rounded-t-lg border-b border-cc-gray">
          <h2 className="text-xl font-bold font-mono text-cc-white flex items-center">
            <span className="bg-cc-green text-cc-black py-1 px-2 rounded text-sm mr-2">PAY</span>
            Creator
          </h2>
        </div>
        
        <div className="p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-cc-green" />
                <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-2 border-cc-green opacity-20"></div>
              </div>
              <p className="text-cc-white font-mono mt-4">Setting Up Payment...</p>
            </div>
          ) : (
            <>
              <div className="bg-gradient-to-r from-cc-gray to-cc-gray-dark rounded-xl p-5 mb-5 backdrop-blur-sm border border-cc-gray-light/30">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-cc-white/70 text-sm font-mono mb-1">Payment Amount</p>
                    <p className="text-cc-green font-bold font-mono text-2xl">₹{amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-cc-white/70 text-sm font-mono mb-1">To Creator</p>
                    <p className="text-cc-white font-mono break-all">{creatorEmail}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-900/20 border border-red-500 rounded-xl p-4 text-red-400 text-sm mb-5">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handlePayment}
                  disabled={processing || !razorpayLoaded}
                  className="bg-gradient-to-r from-cc-green to-cc-green-dark hover:brightness-110 text-cc-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-12"
                >
                  {processing ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span className="font-mono">Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      <span className="font-mono">Pay ₹{amount.toFixed(2)}</span>
                    </div>
                  )}
                </Button>
                
                <Button
                  onClick={onCancel}
                  disabled={processing}
                  className="bg-cc-gray hover:bg-cc-gray-light text-cc-white border border-cc-gray-light/50 transition-all duration-300 h-12"
                >
                  <X className="mr-2 h-5 w-5" />
                  <span className="font-mono">Cancel</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
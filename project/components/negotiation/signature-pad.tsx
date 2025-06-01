"use client";

import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, X, RefreshCw, Upload } from "lucide-react";
import { toast } from "sonner";

interface SignaturePadProps {
  onSignatureComplete: (signatureData: string) => void;
  onCancel: () => void;
}

export default function SignaturePad({ onSignatureComplete, onCancel }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const save = () => {
    if (sigCanvas.current?.isEmpty()) {
      toast.error("Please sign before submitting");
      return;
    }

    setIsSaving(true);
    const dataURL = sigCanvas.current?.toDataURL("image/png");
    if (dataURL) {
      console.log("Signature data generated, length:", dataURL.length);
      onSignatureComplete(dataURL);
    } else {
      setIsSaving(false);
      toast.error("Could not save signature");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept image files
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        setIsUploading(false);
        toast.error("Failed to read the uploaded file");
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Draw the uploaded image to the canvas
        if (sigCanvas.current) {
          const canvas = sigCanvas.current.getCanvas();
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setIsUploading(false);
            toast.error("Canvas context not available");
            return;
          }
          
          // Clear canvas
          sigCanvas.current.clear();
          
          // Calculate dimensions to fit the image
          const maxWidth = canvas.width;
          const maxHeight = canvas.height;
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }
          
          if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
          }
          
          // Center the image
          const x = (maxWidth - width) / 2;
          const y = (maxHeight - height) / 2;
          
          ctx.drawImage(img, x, y, width, height);
          
          // Drawing to the canvas should make it non-empty
          // Add a minimal drawing to ensure isEmpty() returns false
          const currentData = sigCanvas.current.toData();
          if (!currentData || currentData.length === 0) {
            // Add an invisible dot if needed
            ctx.fillRect(0, 0, 1, 1);
          }
          
          toast.success("Signature uploaded successfully");
        }
        setIsUploading(false);
      };
      
      img.onerror = () => {
        setIsUploading(false);
        toast.error("Failed to load the image");
      };
      
      img.src = event.target.result as string;
    };
    
    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Failed to read the file");
    };
    
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-b from-cc-gray-dark to-cc-black border-cc-gray rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <div className="p-1">
        <div className="bg-gradient-to-r from-cc-green/20 to-transparent p-4 rounded-t-lg border-b border-cc-gray">
          <h2 className="text-xl font-bold font-mono text-cc-white flex items-center">
            <span className="bg-cc-green text-cc-black py-1 px-2 rounded text-sm mr-2">SIGN</span>
            Contract
          </h2>
        </div>
        
        <div className="p-5">
          <div className="mb-5">
            <p className="text-cc-white mb-2 text-sm font-mono">Sign below to accept the agreement:</p>
          </div>
          
          <div className="signature-container mb-5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cc-green/5 to-transparent pointer-events-none rounded-lg" />
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: "signature-canvas rounded-lg border-2 border-cc-gray",
                width: 600,
                height: 250,
                style: {
                  width: '100%',
                  height: '250px',
                  touchAction: 'none',
                  msTouchAction: 'none',
                  backgroundColor: '#1A1A1A',
                  borderRadius: '8px',
                }
              }}
              backgroundColor="rgba(26, 26, 26, 1)"
              penColor="#00FF94"
              dotSize={2}
              minWidth={2}
              maxWidth={4}
              throttle={0}
              velocityFilterWeight={0.2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              onClick={clear}
              className="bg-cc-gray hover:bg-cc-gray-light text-cc-white border border-cc-gray-light/50 transition-all duration-300 h-12"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              <span className="font-mono">Clear</span>
            </Button>
            
            <Button
              type="button"
              onClick={onCancel}
              className="bg-cc-gray hover:bg-cc-gray-light text-cc-white border border-cc-gray-light/50 transition-all duration-300 h-12"
            >
              <X className="mr-2 h-5 w-5" />
              <span className="font-mono">Cancel</span>
            </Button>
          </div>
          
          <Button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="w-full mt-4 bg-gradient-to-r from-cc-green to-cc-green-dark hover:brightness-110 text-cc-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-12"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Complete Signature
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
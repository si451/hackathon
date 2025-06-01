"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Maximize2, Minimize2, ChevronLeft, ChevronRight } from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';

// Use a specific version that's known to exist on the CDN with HTTPS
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;

interface DocumentPreviewProps {
  documentUrl: string;
}

export default function DocumentPreview({ documentUrl }: DocumentPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    console.log(`Document loaded successfully with ${numPages} pages`);
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  // Add error handler
  function onDocumentLoadError(err: Error): void {
    console.error("Error loading document:", err);
    setLoading(false);
    setError(`Failed to load document: ${err.message}`);
  }

  // Add function to ensure proper URL formation
  const getDocumentUrl = () => {
    console.log("Loading document from URL:", documentUrl);
    
    // Check if URL is properly formed
    if (!documentUrl.startsWith('http')) {
      // If URL doesn't start with http, assume it's a relative path
      return `${window.location.origin}${documentUrl.startsWith('/') ? '' : '/'}${documentUrl}`;
    }
    
    return documentUrl;
  };

  const goToPreviousPage = () => {
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);
  };

  const goToNextPage = () => {
    setPageNumber(pageNumber + 1 >= numPages! ? numPages! : pageNumber + 1);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <Card className={`bg-[#1A1A1A] border-[#2A2A2A] overflow-hidden ${fullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardContent className={`p-0 ${fullscreen ? 'h-screen flex flex-col' : ''}`}>
        <div className="bg-[#2A2A2A] p-4 flex justify-between items-center">
          <h3 className="font-mono font-bold text-white">Document Preview</h3>
          <div className="flex gap-2">
            {numPages && numPages > 1 && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={goToPreviousPage} 
                  disabled={pageNumber <= 1}
                  className="text-white hover:bg-[#3A3A3A]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-white font-mono">
                  {pageNumber} / {numPages}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={goToNextPage} 
                  disabled={pageNumber >= numPages}
                  className="text-white hover:bg-[#3A3A3A]"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleFullscreen}
              className="text-white hover:bg-[#3A3A3A]"
            >
              {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className={`flex justify-center items-center bg-[#0D0D0D] ${fullscreen ? 'flex-1 overflow-auto' : 'p-4'}`}>
          {loading && (
            <div className="flex flex-col items-center justify-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#00FF94] mb-2" />
              <p className="text-sm text-white font-mono">Loading document...</p>
            </div>
          )}
          
          {error && (
            <div className="text-red-400 p-10 text-center">
              <p className="font-bold">Error loading document</p>
              <p className="mt-2">{error}</p>
              <Button 
                onClick={() => window.open(getDocumentUrl(), '_blank')}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Download Directly
              </Button>
            </div>
          )}
          
          <Document
            file={getDocumentUrl()}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center p-10">
                <Loader2 className="h-8 w-8 animate-spin text-[#00FF94]" />
              </div>
            }
            error={
              <div className="text-red-400 p-10 text-center">
                <p>Failed to load document.</p>
                <p className="text-sm mt-2">Please try downloading directly instead.</p>
              </div>
            }
            options={{
              cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
              cMapPacked: true,
            }}
          >
            {!error && (
              <Page 
                pageNumber={pageNumber} 
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={fullscreen ? 800 : 500}
                className="mx-auto shadow-lg bg-white"
                error={<p className="text-red-400">Error loading this page.</p>}
              />
            )}
          </Document>
        </div>
      </CardContent>
    </Card>
  );
}
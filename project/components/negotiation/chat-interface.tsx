"use client";

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'; // Import axios
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Download, Copy, CheckCircle, Loader2, Bot, DollarSign, Mail, ChevronDown, ChevronUp, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: string; // Add type for different message renderings
  timestamp?: string;
}

interface CreatorDetails {
  username: string;
  platform: string;
  // Add other creator details as needed, e.g., email for sending contracts
  email?: string;
}

interface ChatInterfaceProps {
  creatorDetails: CreatorDetails;
}

// Define the expected structure of the chat API response
interface ChatApiResponse {
  sessionId: string;
  history: Message[];
}

// Add interface for API response
interface SearchResponse {
  sessionId: string;
  results: Array<{
    username: string;
    platform: string;
    followers: number;
    engagement_rate: number;
    email: string;
  }>;
  history?: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
}

export default function ChatInterface({ creatorDetails }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

  // Load session ID from local storage or generate a new one
  useEffect(() => {
    const storedSessionId = localStorage.getItem(`session_${creatorDetails.username}`);
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem(`session_${creatorDetails.username}`, newSessionId);
      setSessionId(newSessionId);
    }
  }, [creatorDetails.username]);

  // Load chat history when session ID is available
  useEffect(() => {
    if (sessionId) {
      const loadChatHistory = async () => {
        try {
          // Explicitly type the response data
          const response = await axios.get(`${API_BASE_URL}/chat/history/${sessionId}`);
          setMessages(response.data as Message[]);
        } catch (error) {
          console.error('Error loading chat history:', error);
          // Optionally display an error message to the user
        }
      };
      loadChatHistory();
    }
  }, [sessionId, API_BASE_URL]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '' || !sessionId) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    // Optimistically add user message to the chat
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Explicitly type the response data
      const response = await axios.post<SearchResponse>(`${API_BASE_URL}/chat`, {
        sessionId: sessionId,
        message: userMessage.content,
        creatorDetails: creatorDetails,
      });

      // The backend now returns the full history, replace the local history
      setMessages(response.data.history as Message[]);

    } catch (error) {
      console.error('Error sending message:', error);
      // Add an error message to the chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'Sorry, I encountered an error.', type: 'error', timestamp: new Date().toISOString() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!sessionId) return;
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/chat/history/${sessionId}`);
      setMessages([]); // Clear local messages on success
      // Optionally generate a new session ID or keep the old one
      // const newSessionId = uuidv4();
      // localStorage.setItem(`session_${creatorDetails.username}`, newSessionId);
      // setSessionId(newSessionId);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      // Optionally display an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  // Message rendering logic (keeping our previous improvements)
  const renderMessageContent = (message: Message) => {
    // Placeholder for detailed message rendering based on type
    // This is where we would enhance rendering for 'email_draft', 'contract_step', etc.
    // For now, we'll render simple text based on the basic type logic we had.

    const content = message.content;

    switch (message.type) {
      case 'greeting':
        return <div className="message-text greeting">{content}</div>;
      case 'capabilities':
        return <div className="message-text capabilities">{content}</div>;
      case 'email_draft':
        // Assuming content might be formatted as SUBJECT:\n\nBODY:\n...
        const subjectMatch = content.match(/^SUBJECT: (.*)\n\nBODY:\n/s);
        const subject = subjectMatch ? subjectMatch[1] : 'No Subject';
        const body = subjectMatch ? content.substring(subjectMatch[0].length) : content;
        return (
          <div className="message-text email-draft">
            <strong>Subject:</strong> {subject}
            <br/>
            <strong>Body:</strong>
            <div className="email-body-preview">{body}</div>
            {/* Add buttons for Download PDF, Copy to Clipboard later */}
          </div>
        );
      case 'negotiation':
        return (
          <div className="message-text negotiation">
            {/* Icon placeholder */}
            💰 {content}
          </div>
        );
       case 'outreach':
         return (
           <div className="message-text outreach">
             {/* Icon placeholder */}
             📧 {content}
           </div>
         );
      case 'contract_step':
         return (
           <div className="message-text contract-step">
             {/* Icon placeholder */}
             📄 {content}
           </div>
         );
      case 'completion':
        return <div className="message-text completion">✅ {content}</div>;
      case 'error':
        return <div className="message-text error">❌ {content}</div>;
      default:
        return <div className="message-text">{content}</div>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Header with Creator Name and Clear History Button */}
      <div className="flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Negotiation with {creatorDetails.username}</h2>
        <button
          onClick={handleClearHistory}
          className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
          disabled={isLoading}
        >
          Clear History
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg
                ${message.role === 'user'
                  ? 'bg-blue-500 text-white' // User message style
                  : message.type === 'error'
                    ? 'bg-red-500 text-white' // Error message style
                    : 'bg-gray-300 text-gray-900 dark:bg-gray-700 dark:text-gray-100' // Assistant message style
                }
              `}
            >
              {renderMessageContent(message)}
              {message.timestamp && (
                <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-600 dark:text-gray-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
              <div className="dot-pulse"></div>{/* Simple loading animation */}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="Type your message..."
            disabled={isLoading || !sessionId}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={isLoading || input.trim() === '' || !sessionId}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
} 
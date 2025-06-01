"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { ChatMessage } from "@/components/messages/chat-message";
import { SuggestionPanel } from "@/components/messages/suggestion-panel";
import { MessageSquare, Send, PlusCircle } from "lucide-react";

// Mock data
const MOCK_MESSAGES = [
  {
    id: "1",
    content: "Hi there! I'm interested in collaborating with you for our upcoming summer campaign.",
    sender: {
      id: "brand1",
      name: "Jane Smith",
      avatar: "https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=300",
      initials: "JS",
    },
    timestamp: "10:15 AM",
    isSelf: true,
  },
  {
    id: "2",
    content: "Hello! Thank you for reaching out. I'm excited to hear more about your summer campaign.",
    sender: {
      id: "creator1",
      name: "Alex Johnson",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
      initials: "AJ",
    },
    timestamp: "10:18 AM",
  },
  {
    id: "3",
    content: "Based on the campaign details, I would typically charge $1,500 for a package including 3 Instagram posts and 2 stories. Does that align with your budget?",
    sender: {
      id: "creator1",
      name: "Alex Johnson",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
      initials: "AJ",
    },
    timestamp: "10:22 AM",
  },
  {
    id: "4",
    content: "I've analyzed the campaign requirements and market rates. For creators with Alex's audience size and engagement rate in the fashion niche, the proposed rate of $1,500 for 3 posts and 2 stories is within the fair market range.",
    sender: {
      id: "ai",
      name: "AI Assistant",
      initials: "AI",
    },
    timestamp: "10:23 AM",
    isAI: true,
  },
  {
    id: "5",
    content: "That sounds reasonable! Our budget for this campaign is actually $2,000, so we have some flexibility. Would you be able to add a TikTok video to the package?",
    sender: {
      id: "brand1",
      name: "Jane Smith",
      avatar: "https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=300",
      initials: "JS",
    },
    timestamp: "10:27 AM",
    isSelf: true,
  },
];

const MOCK_SUGGESTIONS = [
  {
    id: "s1",
    title: "Fair Rate: $1,800",
    description: "For 3 IG posts, 2 stories, and 1 TikTok video with Alex's metrics",
    type: "rate" as const,
  },
  {
    id: "s2",
    title: "Additional Deliverable",
    description: "Request usage rights for brand website and social media",
    type: "deliverable" as const,
  },
  {
    id: "s3",
    title: "Timeline Proposal",
    description: "Content delivery by July 15, publishing by July 25",
    type: "timeline" as const,
  },
];

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [messageInput, setMessageInput] = useState("");
  const [suggestions] = useState(MOCK_SUGGESTIONS);
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: messageInput,
      sender: {
        id: "brand1",
        name: "Jane Smith",
        avatar: "https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=300",
        initials: "JS",
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: `msg-${Date.now() + 1}`,
        content: "I recommend accepting this proposal. Adding a TikTok video typically costs between $500-700 extra, so the total package at $2,000 would be a good deal for both parties.",
        sender: {
          id: "ai",
          name: "AI Assistant",
          initials: "AI",
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
      };
      
      setMessages(prev => [...prev, aiResponse]);
    }, 2000);
  };
  
  const handleSuggestionAccept = (suggestion: any) => {
    const content = `I'd like to propose: ${suggestion.title} - ${suggestion.description}`;
    
    const newMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: {
        id: "brand1",
        name: "Jane Smith",
        avatar: "https://images.pexels.com/photos/3586798/pexels-photo-3586798.jpeg?auto=compress&cs=tinysrgb&w=300",
        initials: "JS",
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    };
    
    setMessages([...messages, newMessage]);
  };
  
  return (
    <div className="container flex h-[calc(100vh-4rem-1px)] flex-col py-6">
      <PageHeader
        title="Negotiation Chat"
        description="Negotiate campaign details with Alex Johnson"
        icon={MessageSquare}
        actions={
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/campaigns/new")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Contract
          </Button>
        }
      />
      
      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="flex flex-1 flex-col rounded-lg border bg-card shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} {...message} />
              ))}
            </div>
          </div>
          
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type your message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="bg-[#00FFFF] text-black hover:bg-[#00DDDD]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="hidden w-72 md:block">
          <SuggestionPanel
            suggestions={suggestions}
            onSuggestionAccept={handleSuggestionAccept}
            className="sticky top-6"
          />
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { ArrowLeft, Users, TrendingUp, MapPin, Target, Star, Building2, Briefcase, User, DollarSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DocumentGenerator from '@/components/negotiation/document-generator';
interface Creator {
  platform: string;
  username: string;
  followers: number;
  description: string;
  thumbnail: string;
  engagement_rate: number;
  niche: string;
  location: string;
  quality_score: number;
  email?: string;
  image_url?: string;
  bio?: string;
}

export default function NegotiatePage() {
  const params = useParams();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [recruiterType, setRecruiterType] = useState<string>("");
  const [recruiterName, setRecruiterName] = useState<string>("");
  const [recruiterFullName, setRecruiterFullName] = useState<string>("");
  const [recruiterEmail, setRecruiterEmail] = useState<string>(""); // New state for recruiter email
  const [budget, setBudget] = useState<string>("");
  const [proposal, setProposal] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // New state variables
  const [campaignStart, setCampaignStart] = useState<string>("");
  const [campaignEnd, setCampaignEnd] = useState<string>("");
  const [deliverables, setDeliverables] = useState<string>("");
  const [contentRequirements, setContentRequirements] = useState<string>("");
  const [paymentTerms, setPaymentTerms] = useState<string>("full");
  const [exclusivity, setExclusivity] = useState<boolean>(false);
  const [revisions, setRevisions] = useState<string>("2");

  useEffect(() => {
    // Load creator data from mock data
    const loadCreator = async () => {
      try {
        const platform = params.platform as string;
        const username = params.username as string;
        
        // Load the appropriate mock data file from public directory
        const response = await fetch(`/mock_${platform}_influencers.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${platform} data`);
        }
        
        const data = await response.json();
        
        // Find the creator
        const creatorData = data[`${platform}_influencers`].find(
          (c: Creator) => c.username === username
        );
        
        if (creatorData) {
          setCreator(creatorData);
        }
      } catch (error) {
        console.error("Error loading creator:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCreator();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the form data
      const submitFormData = {
        recruiterType,
        recruiterFullName,  // Add the new field here
        recruiterName,
        recruiterEmail,
        budget: parseFloat(budget) || 0,
        proposal,
        campaignStart,
        campaignEnd,
        deliverables,
        contentRequirements,
        paymentTerms,
        exclusivity,
        revisions,
        creator_details: creator,
      };
      
      // Store the form data for the document generator
      setFormData(submitFormData);
      
      // Set form submitted to show the DocumentGenerator component
      setFormSubmitted(true);
    } catch (error) {
      console.error("Error preparing proposal data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container py-6 space-y-6">
          <div className="flex justify-center items-center h-[80vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF94]"></div>
          </div>
        </div>
      </div>
    );
  }

  // Update the "Creator Not Found" state
  if (!creator) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container py-6 space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight font-mono text-white">
              Creator Not Found
            </h1>
            <p className="text-[#00FF94] text-lg font-mono">
              The creator you're looking for doesn't exist.
            </p>
            <Link href="/search">
              <Button variant="outline" className="mt-4 font-mono border-[#00FF94] text-[#00FF94] hover:bg-[#00FF94] hover:text-black">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Update the hero section and background
  return (
    <div className="min-h-screen bg-black">
      {/* Hero section with subtle gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,148,0.07),transparent_70%)]"></div>
        <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-mono">
                <span className="text-[#00FF94]">Negotiate</span> with {creator?.username}
              </h1>
              <p className="text-white/70 max-w-2xl mx-auto">
                Create a proposal for {creator?.username} on {params.platform}. Fill in the details below to generate an email and contract.
              </p>
            </div>

            {/* Creator info card - improved contrast */}
            {creator && (
              <div className="mb-10">
                <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-lg">
                  <div className="grid md:grid-cols-[250px_1fr] gap-6">
                    <div className="relative aspect-square bg-cc-gray">
                      <Image
                        src={creator.image_url || "/placeholder.png"}
                        alt={creator.username}
                        fill
                        className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cc-black to-transparent p-3">
                        <div className="inline-flex items-center rounded-full bg-cc-black/50 backdrop-blur-sm px-3 py-1 border border-cc-gray-light/30">
                          <span className="text-cc-green mr-1 font-mono font-bold">@</span>
                          <span className="text-cc-white font-mono">{creator.username}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="bg-cc-green/10 border border-cc-green/20 rounded-full px-3 py-1">
                          <p className="text-cc-white text-sm font-mono">Platform: <span className="text-cc-green">{params.platform}</span></p>
                        </div>
                        <div className="bg-cc-green/10 border border-cc-green/20 rounded-full px-3 py-1">
                          <p className="text-cc-white text-sm font-mono">Followers: <span className="text-cc-green">{creator.followers.toLocaleString()}</span></p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h2 className="text-cc-white text-xl font-bold mb-2">About {creator.username}</h2>
                        <p className="text-cc-white/80">{creator.bio || "No bio available"}</p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Display Creator stats/metrics here */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form or document generator */}
            {!formSubmitted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-lg">
                  <div className="p-1">
                    <div className="bg-[#222] p-4 rounded-t-lg border-b border-[#333]">
                      <h2 className="text-xl font-bold font-mono text-[#00FF94]">Create Your Proposal</h2>
                    </div>
                    <div className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium font-mono text-white mb-2">
                              I am a
                            </label>
                            <Select value={recruiterType} onValueChange={setRecruiterType}>
                              <SelectTrigger className="w-full bg-[#222] border-[#444] text-white font-mono">
                                <SelectValue placeholder="Select your role" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#222] border-[#444] text-white">
                                <SelectItem value="brand" className="text-white font-mono hover:bg-[#333] focus:bg-[#333]">
                                  <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[#00FF94]" />
                                    Brand
                                  </div>
                                </SelectItem>
                                <SelectItem value="agency" className="text-white font-mono hover:bg-[#333] focus:bg-[#333]">
                                  <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-[#00FF94]" />
                                    Agency
                                  </div>
                                </SelectItem>
                                <SelectItem value="individual" className="text-white font-mono hover:bg-[#333] focus:bg-[#333]">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#00FF94]" />
                                    Individual
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                           {recruiterType && (
                             <>
                              <div>
                                <label className="block text-sm font-medium font-mono text-white mb-2">
                                  Your Full Name
                                </label>
                                <Input
                                  type="text"
                                  value={recruiterFullName}
                                  onChange={(e) => setRecruiterFullName(e.target.value)}
                                  placeholder="Enter your full name"
                                  className="bg-[#222] border-[#444] text-white font-mono placeholder:text-gray-500"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium font-mono text-white mb-2">
                                  {recruiterType === "brand" ? "Company Name" : 
                                   recruiterType === "agency" ? "Agency Name" : "Username"}
                                </label>
                                <Input
                                  type="text"
                                  value={recruiterName}
                                  onChange={(e) => setRecruiterName(e.target.value)}
                                  placeholder={`Enter your ${recruiterType === "brand" ? "company" : 
                                                         recruiterType === "agency" ? "agency" : "username"}`}
                                  className="bg-[#222] border-[#444] text-white font-mono placeholder:text-gray-500"
                                  required
                                />
                              </div>
                             </>
                           )}

                          <div>
                            <label className="block text-sm font-medium font-mono text-white mb-2">
                              Your Email
                            </label>
                            <Input
                              type="email"
                              value={recruiterEmail}
                              onChange={(e) => setRecruiterEmail(e.target.value)}
                              placeholder="Enter your email"
                              className="bg-[#2A2A2A] border-[#2A2A2A] text-white font-mono placeholder:text-gray-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-mono text-white mb-2">
                              Budget (USD)
                            </label>
                             <div className="relative">
                               <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00FF94]" />
                               <Input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                placeholder="Enter your budget"
                                className="pl-10 bg-[#2A2A2A] border-[#2A2A2A] text-white font-mono placeholder:text-gray-500"
                                required
                              />
                             </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium font-mono text-white mb-2">
                              Proposal
                            </label>
                            <Textarea
                              value={proposal}
                              onChange={(e) => setProposal(e.target.value)}
                              placeholder="Describe your campaign and requirements..."
                              className="min-h-[200px] bg-[#222] border-[#444] text-white font-mono placeholder:text-gray-500"
                              required
                            />
                          </div>

                          {/* New fields for campaign details */}
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium font-mono text-white mb-2">
                                  Campaign Start Date
                                </label>
                                <input
                                  type="date"
                                  value={campaignStart}
                                  onChange={(e) => setCampaignStart(e.target.value)}
                                  className="w-full bg-[#222] border-[#444] text-white font-mono rounded-md px-3 py-2"
                                  required
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium font-mono text-white mb-2">
                                  Campaign End Date
                                </label>
                                <input
                                  type="date"
                                  value={campaignEnd}
                                  onChange={(e) => setCampaignEnd(e.target.value)}
                                  className="w-full bg-[#222] border-[#444] text-white font-mono rounded-md px-3 py-2"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium font-mono text-white mb-2">
                                Deliverables (e.g., 2 Instagram posts, 1 YouTube video)
                              </label>
                              <Textarea
                                value={deliverables}
                                onChange={(e) => setDeliverables(e.target.value)}
                                placeholder="List specific content pieces required..."
                                className="min-h-[80px] bg-[#2A2A2A] border-[#444] text-white font-mono placeholder:text-gray-500"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium font-mono text-white mb-2">
                                Content Requirements
                              </label>
                              <Textarea
                                value={contentRequirements}
                                onChange={(e) => setContentRequirements(e.target.value)}
                                placeholder="Include hashtags, talking points, content guidelines..."
                                className="min-h-[80px] bg-[#2A2A2A] border-[#444] text-white font-mono placeholder:text-gray-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium font-mono text-white mb-2">
                                Payment Terms
                              </label>
                              <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                                <SelectTrigger className="bg-[#2A2A2A] border-[#444] text-white font-mono">
                                  <SelectValue placeholder="Select payment terms" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A1A] text-white border-[#444]">
                                  <SelectItem value="full">100% Upfront</SelectItem>
                                  <SelectItem value="split">50% Upfront, 50% On Completion</SelectItem>
                                  <SelectItem value="completion">100% On Completion</SelectItem>
                                  <SelectItem value="milestone">Milestone-based</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="exclusivity" 
                                checked={exclusivity}
                                onCheckedChange={(e) => setExclusivity(e === true)} 
                              />
                              <label htmlFor="exclusivity" className="text-sm font-medium font-mono text-white">
                                Exclusive agreement (creator cannot work with competing brands during campaign)
                              </label>
                            </div>

                            <div>
                              <label className="block text-sm font-medium font-mono text-white mb-2">
                                Number of Content Revisions Allowed
                              </label>
                              <Select value={revisions} onValueChange={setRevisions}>
                                <SelectTrigger className="bg-[#2A2A2A] border-[#444] text-white font-mono">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1A1A1A] text-white border-[#444]">
                                  <SelectItem value="0">No revisions</SelectItem>
                                  <SelectItem value="1">1 revision</SelectItem>
                                  <SelectItem value="2">2 revisions</SelectItem>
                                  <SelectItem value="3">3 revisions</SelectItem>
                                  <SelectItem value="unlimited">Unlimited revisions</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>

                        {/* Update the submit button for better visibility */}
                        <Button
                          type="submit"
                          disabled={isSubmitting || !recruiterType || !recruiterFullName || !recruiterName || !recruiterEmail || !budget || !proposal}
                          className="w-full bg-[#00FF94] text-black hover:bg-[#00FF94]/90 font-bold font-mono"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                              Sending Proposal...
                            </>
                          ) : (
                            "Send Proposal"
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <DocumentGenerator formData={formData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatNumber(num: number) {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  });
  return formatter.format(num);
}
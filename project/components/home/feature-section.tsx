import {
  BarChart4,
  CheckCircle2,
  MessageCircle,
  Search,
  FileText,
  CreditCard,
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="mb-4 rounded-full bg-[#1A1A1A] p-3 border border-[#2A2A2A]">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold font-mono text-white">{title}</h3>
      <p className="text-[#00FF94] font-mono">{description}</p>
    </div>
  );
}

export function FeatureSection() {
  return (
    <div className="container py-16 md:py-24 bg-[#0A0A0A]">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight font-mono text-white sm:text-4xl mb-4">
          All-in-One Creator Management
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-[#00FF94] font-mono">
          Everything you need to run successful influencer campaigns, powered by AI
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Feature
          icon={<Search className="h-8 w-8 text-[#00FF94]" />}
          title="Smart Discovery"
          description="Find the perfect creators with AI-powered search and matching algorithms."
        />
        <Feature
          icon={<MessageCircle className="h-8 w-8 text-[#00FF94]" />}
          title="AI Negotiations"
          description="Let our AI agent handle rate negotiations and deliverable suggestions."
        />
        <Feature
          icon={<FileText className="h-8 w-8 text-[#00FF94]" />}
          title="Auto Contracts"
          description="Generate, review, and sign professional contracts with one click."
        />
        <Feature
          icon={<CreditCard className="h-8 w-8 text-[#00FF94]" />}
          title="Payment Tracking"
          description="Manage invoices and payments seamlessly in one place."
        />
        <Feature
          icon={<BarChart4 className="h-8 w-8 text-[#00FF94]" />}
          title="Performance Reports"
          description="Track campaign metrics and ROI with beautiful visualizations."
        />
        <Feature
          icon={<CheckCircle2 className="h-8 w-8 text-[#00FF94]" />}
          title="Campaign Management"
          description="Oversee all your influencer campaigns from a single dashboard."
        />
      </div>
    </div>
  );
}
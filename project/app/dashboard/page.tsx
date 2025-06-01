"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { CampaignCard } from "@/components/dashboard/campaign-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import { CAMPAIGN_STATUSES } from "@/lib/constants";
import {
  LayoutDashboard,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Sparkles,
} from "lucide-react";

// Mock data
const MOCK_CAMPAIGNS = [
  {
    id: "1",
    title: "Summer Fashion Collection",
    status: CAMPAIGN_STATUSES.ACTIVE,
    progress: 65,
    dueDate: "July 30, 2023",
    budget: "$5,000",
    creatorCount: 3,
  },
  {
    id: "2",
    title: "Tech Gadget Launch",
    status: CAMPAIGN_STATUSES.NEGOTIATION,
    progress: 25,
    dueDate: "Aug 15, 2023",
    budget: "$7,500",
    creatorCount: 5,
  },
  {
    id: "3",
    title: "Fitness Challenge",
    status: CAMPAIGN_STATUSES.CONTRACTED,
    progress: 40,
    dueDate: "Aug 5, 2023",
    budget: "$3,200",
    creatorCount: 2,
  },
  {
    id: "4",
    title: "Travel Vlog Series",
    status: CAMPAIGN_STATUSES.DRAFT,
    progress: 10,
    dueDate: "Sept 1, 2023",
    budget: "$6,000",
    creatorCount: 3,
  },
  {
    id: "5",
    title: "Holiday Gift Guide",
    status: CAMPAIGN_STATUSES.COMPLETED,
    progress: 100,
    dueDate: "Dec 10, 2022",
    budget: "$8,500",
    creatorCount: 6,
  },
];

const MOCK_ACTIVITIES = [
  {
    id: "1",
    user: {
      name: "Sophia Chen",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300",
      initials: "SC",
    },
    action: "signed a contract for",
    target: "Summer Fashion Collection",
    date: "Today",
    time: "2:45 PM",
  },
  {
    id: "2",
    user: {
      name: "Marcus Williams",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300",
      initials: "MW",
    },
    action: "submitted content for",
    target: "Fitness Challenge",
    date: "Today",
    time: "11:30 AM",
  },
  {
    id: "3",
    user: {
      name: "Alex Johnson",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
      initials: "AJ",
    },
    action: "requested changes to",
    target: "Tech Gadget Launch",
    date: "Yesterday",
    time: "4:15 PM",
  },
  {
    id: "4",
    user: {
      name: "Priya Sharma",
      avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300",
      initials: "PS",
    },
    action: "proposed a rate for",
    target: "Travel Vlog Series",
    date: "Yesterday",
    time: "10:20 AM",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredCampaigns = activeTab === "all"
    ? MOCK_CAMPAIGNS
    : MOCK_CAMPAIGNS.filter((campaign) => campaign.status === activeTab);
  
  return (
    <div className="container py-6">
      <PageHeader
        title="Dashboard"
        description="Manage your influencer marketing campaigns"
        icon={LayoutDashboard}
        actions={
          <Link href="/dashboard/campaigns/new">
            <Button className="bg-[#00FFFF] text-black hover:bg-[#00DDDD]">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </Link>
        }
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Campaigns"
          value="3"
          icon={Sparkles}
          trend={{ value: "20%", positive: true }}
        />
        <StatCard
          title="Total Creators"
          value="12"
          icon={Users}
          trend={{ value: "5%", positive: true }}
        />
        <StatCard
          title="Total Reach"
          value="1.2M"
          icon={TrendingUp}
          trend={{ value: "12%", positive: true }}
        />
        <StatCard
          title="Budget Spent"
          value="$12,450"
          icon={DollarSign}
          trend={{ value: "8%", positive: false }}
        />
      </div>
      
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value={CAMPAIGN_STATUSES.ACTIVE}>Active</TabsTrigger>
                <TabsTrigger value={CAMPAIGN_STATUSES.NEGOTIATION}>Negotiation</TabsTrigger>
                <TabsTrigger value={CAMPAIGN_STATUSES.CONTRACTED}>Contracted</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value={activeTab} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {filteredCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} {...campaign} />
                ))}
              </div>
              
              {filteredCampaigns.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                  <div className="rounded-full bg-muted p-3">
                    <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No campaigns found</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    You don't have any {activeTab !== "all" ? activeTab : ""} campaigns yet.
                  </p>
                  <Link href="/dashboard/campaigns/new" className="mt-4">
                    <Button>Create Campaign</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <RecentActivities activities={MOCK_ACTIVITIES} />
        </div>
      </div>
    </div>
  );
}
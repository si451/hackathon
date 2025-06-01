"use client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { MetricCard } from "@/components/reports/metric-card";
import { PerformanceChart } from "@/components/reports/performance-chart";
import { 
  BarChart, 
  Download, 
  Eye, 
  MessageSquare, 
  MousePointerClick, 
  Percent, 
  ShoppingCart 
} from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="container py-6">
      <PageHeader
        title="Performance Reports"
        description="Track the performance of your influencer marketing campaigns"
        icon={BarChart}
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        }
      />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Views"
          value="1.2M"
          change={{ value: "12%", positive: true }}
          icon={Eye}
          description="vs. last month"
        />
        <MetricCard
          title="Engagement Rate"
          value="4.6%"
          change={{ value: "0.8%", positive: true }}
          icon={MessageSquare}
          description="vs. last month"
        />
        <MetricCard
          title="Click-through Rate"
          value="2.3%"
          change={{ value: "0.5%", positive: true }}
          icon={MousePointerClick}
          description="vs. last month"
        />
        <MetricCard
          title="Conversion Rate"
          value="1.8%"
          change={{ value: "0.2%", positive: false }}
          icon={ShoppingCart}
          description="vs. last month"
        />
      </div>
      
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <PerformanceChart
          title="Campaign Performance"
          description="Views, engagement, and clicks over time"
        />
        
        <PerformanceChart
          title="ROI Analysis"
          description="Return on investment metrics"
        />
      </div>
      
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PerformanceChart
            title="Platform Breakdown"
            description="Performance by social platform"
          />
        </div>
        
        <div className="lg:col-span-2">
          <PerformanceChart
            title="Creator Comparison"
            description="Performance metrics across creators"
          />
        </div>
      </div>
    </div>
  );
}
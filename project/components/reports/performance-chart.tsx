"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Bar, Line, CartesianGrid, Tooltip, Legend } from "recharts";

// Sample data
const weeklyData = [
  { name: "Mon", views: 4000, engagement: 240, clicks: 120 },
  { name: "Tue", views: 3000, engagement: 198, clicks: 98 },
  { name: "Wed", views: 2000, engagement: 120, clicks: 65 },
  { name: "Thu", views: 2780, engagement: 208, clicks: 90 },
  { name: "Fri", views: 1890, engagement: 198, clicks: 81 },
  { name: "Sat", views: 2390, engagement: 250, clicks: 110 },
  { name: "Sun", views: 3490, engagement: 310, clicks: 150 },
];

const monthlyData = [
  { name: "Jan", views: 4000, engagement: 240, clicks: 120 },
  { name: "Feb", views: 3000, engagement: 198, clicks: 98 },
  { name: "Mar", views: 2000, engagement: 120, clicks: 65 },
  { name: "Apr", views: 2780, engagement: 208, clicks: 90 },
  { name: "May", views: 1890, engagement: 198, clicks: 81 },
  { name: "Jun", views: 2390, engagement: 250, clicks: 110 },
  { name: "Jul", views: 3490, engagement: 310, clicks: 150 },
];

interface PerformanceChartProps {
  title: string;
  description?: string;
  className?: string;
}

export function PerformanceChart({ title, description, className }: PerformanceChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="weekly" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--chart-1))" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="engagement" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                <Line type="monotone" dataKey="clicks" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="monthly" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="hsl(var(--chart-1))" />
                <Bar dataKey="engagement" fill="hsl(var(--chart-2))" />
                <Bar dataKey="clicks" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
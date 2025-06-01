"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Instagram, Youtube, Twitter, Globe } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="container py-8">
      <div className="grid gap-8">
        {/* Profile Header */}
          <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h1 className="text-2xl font-bold">John Doe</h1>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Creator</Badge>
                    <Badge variant="outline">Fashion & Lifestyle</Badge>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Digital creator passionate about fashion, lifestyle, and sustainable living.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    <Youtube className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    <Globe className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <Button>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
                <CardDescription>Your profile information and bio</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fashion enthusiast and lifestyle content creator with a focus on sustainable living.
                  Creating engaging content that inspires and educates.
                </p>
            </CardContent>
          </Card>
        
          <Card>
            <CardHeader>
                <CardTitle>Stats</CardTitle>
                <CardDescription>Your social media statistics</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Instagram</p>
                    <p className="text-2xl font-bold">50K</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">YouTube</p>
                    <p className="text-2xl font-bold">25K</p>
                    <p className="text-xs text-muted-foreground">Subscribers</p>
                </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold">4.2%</p>
                    <p className="text-xs text-muted-foreground">Average Rate</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Campaigns</p>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Active Campaigns</CardTitle>
                <CardDescription>Your current and upcoming campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No active campaigns at the moment.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Your performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics dashboard coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel coming soon.</p>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
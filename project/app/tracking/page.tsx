"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

// Define a simple interface for a tracked negotiation
interface TrackedNegotiation {
  id: string;
  creatorUsername: string;
  platform: string;
  status: 'Sent' | 'Replied' | 'Accepted' | 'Rejected' | 'Deal Confirmed';
  lastActivity: string; // Simulate date/time
}

export default function TrackingPage() {
  const [trackedNegotiations, setTrackedNegotiations] = useState<TrackedNegotiation[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial mock data
  const initialMockData: TrackedNegotiation[] = [
    {
      id: 'neg_001',
      creatorUsername: 'TechMaster',
      platform: 'YouTube',
      status: 'Sent',
      lastActivity: '2024-05-31T10:00:00Z',
    },
    {
      id: 'neg_002',
      creatorUsername: 'FashionForward',
      platform: 'Instagram',
      status: 'Sent', // Start as sent
      lastActivity: '2024-05-31T10:15:00Z',
    },
    {
      id: 'neg_003',
      creatorUsername: 'GamingPro',
      platform: 'YouTube',
      status: 'Sent', // Start as sent
      lastActivity: '2024-05-31T10:30:00Z',
    },
     {
      id: 'neg_004',
      creatorUsername: 'FitnessGoals',
      platform: 'Instagram',
      status: 'Sent', // Start as sent
      lastActivity: '2024-05-31T10:45:00Z',
    },
     {
      id: 'neg_005',
      creatorUsername: 'TravelVlogger',
      platform: 'YouTube',
      status: 'Sent', // Start as sent
      lastActivity: '2024-05-31T11:00:00Z',
    },
      {
      id: 'neg_006',
      creatorUsername: 'CookingMaster',
      platform: 'YouTube',
      status: 'Sent', 
      lastActivity: '2024-05-31T11:10:00Z',
    },
      {
      id: 'neg_007',
      creatorUsername: 'PhotographyPro',
      platform: 'Instagram',
      status: 'Sent', 
      lastActivity: '2024-05-31T11:20:00Z',
    },
  ];


  useEffect(() => {
    // Load initial data
    setTrackedNegotiations(initialMockData);
    setLoading(false);

    // Simulate status progression
    const simulationTimer = setTimeout(() => {
      setTrackedNegotiations(currentNegotiations =>
        currentNegotiations.map(negotiation => {
          switch (negotiation.id) {
            case 'neg_001': // TechMaster: Sent -> Replied -> Accepted
              if (negotiation.status === 'Sent') return { ...negotiation, status: 'Replied', lastActivity: new Date().toISOString() };
              if (negotiation.status === 'Replied') return { ...negotiation, status: 'Accepted', lastActivity: new Date().toISOString() };
              return negotiation; // Stay in Accepted
            case 'neg_002': // FashionForward: Sent -> Rejected
              if (negotiation.status === 'Sent') return { ...negotiation, status: 'Rejected', lastActivity: new Date().toISOString() };
              return negotiation; // Stay in Rejected
            case 'neg_003': // GamingPro: Sent -> Replied -> Deal Confirmed
              if (negotiation.status === 'Sent') return { ...negotiation, status: 'Replied', lastActivity: new Date().toISOString() };
              if (negotiation.status === 'Replied') return { ...negotiation, status: 'Deal Confirmed', lastActivity: new Date().toISOString() };
              return negotiation; // Stay in Deal Confirmed
             case 'neg_004': // FitnessGoals: Sent -> Replied
              if (negotiation.status === 'Sent') return { ...negotiation, status: 'Replied', lastActivity: new Date().toISOString() };
              return negotiation; // Stay in Replied
            case 'neg_005': // TravelVlogger: Sent
              return negotiation; // Stays in Sent
             case 'neg_006': // CookingMaster: Sent -> Replied
              if (negotiation.status === 'Sent') return { ...negotiation, status: 'Replied', lastActivity: new Date().toISOString() };
              return negotiation; // Stay in Replied
            case 'neg_007': // PhotographyPro: Sent
              return negotiation; // Stays in Sent
            default:
              return negotiation;
          }
        })
      );
       // You can add more setTimeouts here for further progression stages
       const secondStageTimer = setTimeout(() => {
             setTrackedNegotiations(currentNegotiations =>
                currentNegotiations.map(negotiation => {
                   switch (negotiation.id) {
                       case 'neg_001': // TechMaster: Accepted -> Deal Confirmed
                           if (negotiation.status === 'Accepted') return { ...negotiation, status: 'Deal Confirmed', lastActivity: new Date().toISOString() };
                           return negotiation;
                       case 'neg_004': // FitnessGoals: Replied -> Accepted
                           if (negotiation.status === 'Replied') return { ...negotiation, status: 'Accepted', lastActivity: new Date().toISOString() };
                           return negotiation;
                        case 'neg_006': // CookingMaster: Replied -> Rejected
                           if (negotiation.status === 'Replied') return { ...negotiation, status: 'Rejected', lastActivity: new Date().toISOString() };
                           return negotiation;
                       default:
                           return negotiation;
                   }
                })
             );
        }, 5000); // Simulate second stage progression after 5 seconds
        
        // Clear the second stage timer on cleanup
        return () => clearTimeout(secondStageTimer);


    }, 3000); // Simulate first stage progression after 3 seconds

    // Clear the initial simulation timer on cleanup
    return () => clearTimeout(simulationTimer);
  }, []);

  const getStatusColor = (status: TrackedNegotiation['status']) => {
      switch (status) {
          case 'Sent':
              return 'text-blue-600';
          case 'Replied':
              return 'text-yellow-600'; // Or orange
          case 'Accepted':
          case 'Deal Confirmed':
              return 'text-green-600';
          case 'Rejected':
              return 'text-red-600';
          default:
              return 'text-muted-foreground';
      }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight font-mono">
          Negotiation Tracking
        </h1>
        <p className="text-muted-foreground text-lg font-mono">
          Monitor the status of your collaborations
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : ( trackedNegotiations.length === 0 ? (
         <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold font-mono">No Active Negotiations</h2>
            <p className="text-muted-foreground font-mono">Start a negotiation from the search page to see tracking here.</p>
             <Link href="/search">
                <Button variant="outline" className="mt-4">
                  Discover Creators
                </Button>
              </Link>
        </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trackedNegotiations.map((negotiation) => (
              <Card key={negotiation.id} className="p-4 space-y-2">
                <h3 className="text-xl font-bold font-mono">{negotiation.creatorUsername}</h3>
                <p className="text-muted-foreground text-sm font-mono">Platform: {negotiation.platform}</p>
                <p className={`font-mono text-sm ${getStatusColor(negotiation.status)}`}>Status: {negotiation.status}</p>
                <p className="text-xs text-muted-foreground font-mono">Last Activity: {new Date(negotiation.lastActivity).toLocaleString()}</p>
                 {/* Add a link to the specific negotiation page if needed */}
                 <Link href={`/negotiate/${negotiation.platform.toLowerCase()}/${negotiation.creatorUsername}`}>
                     <Button variant="link" className="p-0 font-mono">View Negotiation</Button>
                 </Link>
              </Card>
            ))}
          </div>
      )

      )}

    </div>
  );
} 
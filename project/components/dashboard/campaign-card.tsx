import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CAMPAIGN_STATUSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Calendar, Users } from "lucide-react";

export interface CampaignProps {
  id: string;
  title: string;
  status: string;
  progress: number;
  dueDate: string;
  budget: string;
  creatorCount: number;
}

export function CampaignCard({
  id,
  title,
  status,
  progress,
  dueDate,
  budget,
  creatorCount,
}: CampaignProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case CAMPAIGN_STATUSES.DRAFT:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case CAMPAIGN_STATUSES.NEGOTIATION:
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case CAMPAIGN_STATUSES.CONTRACTED:
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case CAMPAIGN_STATUSES.ACTIVE:
        return "bg-[#00FFFF]/10 text-[#00FFFF] border-[#00FFFF]/20";
      case CAMPAIGN_STATUSES.COMPLETED:
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case CAMPAIGN_STATUSES.CANCELLED:
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <Badge
              variant="outline"
              className={cn(
                "mt-1 rounded-full font-normal capitalize px-2 py-0",
                getStatusColor(status)
              )}
            >
              {status}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{dueDate}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 mt-1"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {creatorCount} creator{creatorCount !== 1 && "s"}
              </span>
            </div>
            <div className="text-sm font-medium">{budget}</div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between bg-muted/50 px-5 py-3">
        <Link href={`/dashboard/campaigns/${id}`}>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </Link>
        
        {status === CAMPAIGN_STATUSES.ACTIVE && (
          <Link href={`/dashboard/campaigns/${id}/report`}>
            <Button variant="outline" size="sm">
              View Report
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
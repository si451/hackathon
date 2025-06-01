import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Activity = {
  id: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  action: string;
  target: string;
  date: string;
  time: string;
};

interface RecentActivitiesProps {
  activities: Activity[];
  className?: string;
}

export function RecentActivities({
  activities,
  className,
}: RecentActivitiesProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest campaign activities</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 border-t px-4 py-3 hover:bg-muted/50"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  <span className="font-semibold">{activity.user.name}</span>{" "}
                  {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {activity.date} at {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ActivityItem {
  id: string;
  action: string;
  subject: string;
  timestamp: string;
  user?: {
    name: string;
    email: string;
  };
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  className?: string;
}

const ActivityFeed = ({ activities, className }: ActivityFeedProps) => {
  const isDisabled = true;


  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-auto">
        <div className="space-y-4">
          {isDisabled ? (
            <p className="text-sm text-muted-foreground text-center">Activity Feature Is Unavaliable</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="mr-4 mt-1 h-2 w-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user ? activity.user.name : "System"}</span>{" "}
                    {activity.action}{" "}
                    <span className="font-medium">{activity.subject}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;

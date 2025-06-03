
import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

const SummaryCard = ({ title, value, icon, change, className }: SummaryCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex p-6">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="mt-2 text-2xl font-bold">{value}</h3>
          
          {change && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={cn(
                  "inline-flex items-center",
                  change.positive ? "text-green-600" : "text-red-600"
                )}
              >
                {change.positive ? "↑" : "↓"} {Math.abs(change.value)}%
              </span>
              <span className="ml-2 text-muted-foreground">from last month</span>
            </div>
          )}
        </div>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default SummaryCard;

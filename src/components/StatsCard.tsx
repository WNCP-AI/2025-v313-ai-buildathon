import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
}

const StatsCard = ({ title, value, icon: Icon, loading }: StatsCardProps) => {
  return (
    <Card className="bg-white border border-border shadow-card hover:shadow-hover transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {title}
            </p>
            {loading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold text-accent leading-none">
                {value}
              </p>
            )}
          </div>
          <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center ml-4 flex-shrink-0">
            <Icon className="h-6 w-6 text-accent" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StandardCard, CardContent } from "@/components/shared/StandardCard";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "search" | "error";
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  variant = "default"
}: EmptyStateProps) => {
  const getIconColor = () => {
    switch (variant) {
      case "search":
        return "text-muted-foreground";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <StandardCard variant="default">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <div className="mx-auto w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <Icon className={`h-12 w-12 ${getIconColor()}`} />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6">{description}</p>
          {actionLabel && onAction && (
            <Button 
              onClick={onAction}
              variant="outline"
              className="transition-all duration-200 hover:scale-105"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </StandardCard>
  );
};
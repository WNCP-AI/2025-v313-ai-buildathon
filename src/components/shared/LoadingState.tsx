import { StandardCard, CardContent, CardHeader } from "@/components/shared/StandardCard";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingGridProps {
  count?: number;
  variant?: "card" | "table" | "list";
  className?: string;
}

export const LoadingGrid = ({ count = 6, variant = "card", className }: LoadingGridProps) => {
  if (variant === "table") {
    return (
      <div className={className}>
        <StandardCard>
          <CardContent className="p-0">
            <div className="space-y-3 p-6">
              {[...Array(count)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </StandardCard>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={className}>
        <div className="space-y-4">
          {[...Array(count)].map((_, i) => (
            <StandardCard key={i}>
              <CardHeader>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </StandardCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <StandardCard key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </StandardCard>
      ))}
    </div>
  );
};

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const LoadingSpinner = ({ size = "md", text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`animate-spin rounded-full border-2 border-muted border-t-primary ${sizeClasses[size]} mb-4`} />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  );
};
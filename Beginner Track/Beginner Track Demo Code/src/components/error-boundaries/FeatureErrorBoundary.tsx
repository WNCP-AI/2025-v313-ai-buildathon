import { ErrorBoundary } from "react-error-boundary";
import { ErrorLogger } from "@/services/ErrorLogger";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface FeatureErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  featureName?: string;
  compact?: boolean;
}

const FeatureErrorFallback = ({ 
  error, 
  resetErrorBoundary, 
  featureName,
  compact = false 
}: FeatureErrorFallbackProps) => {
  if (compact) {
    return (
      <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive">
              {featureName ? `${featureName} error` : "Loading error"}
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={resetErrorBoundary}
            className="h-6 px-2"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Alert variant="destructive" className="my-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <div className="font-medium">
            {featureName ? `${featureName} encountered an error` : "Feature error"}
          </div>
          <div className="text-sm mt-1">
            This section couldn't load properly. Try refreshing or continue using other parts of the app.
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={resetErrorBoundary}
          className="ml-4"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </AlertDescription>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-2">
          <summary className="text-xs cursor-pointer">Error details</summary>
          <pre className="mt-1 text-xs whitespace-pre-wrap">{error.message}</pre>
        </details>
      )}
    </Alert>
  );
};

interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
  featureName?: string;
  compact?: boolean;
  fallback?: React.ComponentType<FeatureErrorFallbackProps>;
}

const FeatureErrorBoundary = ({ 
  children, 
  featureName, 
  compact,
  fallback: CustomFallback 
}: FeatureErrorBoundaryProps) => {
  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    ErrorLogger.logError(error, {
      level: 'medium',
      context: `FeatureErrorBoundary${featureName ? ` - ${featureName}` : ''}`,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      featureName,
    });
  };

  const FallbackComponent = CustomFallback || FeatureErrorFallback;

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <FallbackComponent {...props} featureName={featureName} compact={compact} />
      )}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default FeatureErrorBoundary;
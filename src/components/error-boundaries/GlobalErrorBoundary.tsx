import { ErrorBoundary } from "react-error-boundary";
import { ErrorLogger } from "@/services/ErrorLogger";
import { Button } from "@/components/ui/button";
import { StandardCard } from "@/components/shared/StandardCard";

interface GlobalErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const GlobalErrorFallback = ({ error, resetErrorBoundary }: GlobalErrorFallbackProps) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <StandardCard className="max-w-md mx-auto text-center">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-destructive mb-4">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-6">
          We're sorry, but something unexpected happened. Our team has been notified.
        </p>
        <div className="space-y-3">
          <Button 
            onClick={resetErrorBoundary}
            className="w-full"
          >
            Try again
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = "/"}
            className="w-full"
          >
            Go to homepage
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="text-sm text-muted-foreground cursor-pointer">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs text-destructive whitespace-pre-wrap bg-muted p-2 rounded">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </StandardCard>
  </div>
);

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

const GlobalErrorBoundary = ({ children }: GlobalErrorBoundaryProps) => {
  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    ErrorLogger.logError(error, {
      level: 'critical',
      context: 'GlobalErrorBoundary',
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onError={handleError}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
};

export default GlobalErrorBoundary;
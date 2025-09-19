import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { ErrorLogger } from "@/services/ErrorLogger";
import { Button } from "@/components/ui/button";
import { StandardCard } from "@/components/shared/StandardCard";
import AppLayout from "@/components/layout/AppLayout";

interface PageErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  pageName?: string;
}

const PageErrorFallback = ({ error, resetErrorBoundary, pageName }: PageErrorFallbackProps) => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <StandardCard className="max-w-lg mx-auto text-center">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-destructive mb-4">
              {pageName ? `Error loading ${pageName}` : "Page error"}
            </h2>
            <p className="text-muted-foreground mb-6">
              This page encountered an error. You can try refreshing or go back to continue using the app.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={resetErrorBoundary}
                className="w-full"
              >
                Refresh page
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="w-full"
              >
                Go back
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="w-full"
              >
                Return home
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-muted-foreground cursor-pointer">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-destructive whitespace-pre-wrap bg-muted p-2 rounded">
                  {error.message}
                </pre>
              </details>
            )}
          </div>
        </StandardCard>
      </div>
    </AppLayout>
  );
};

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  pageName?: string;
}

const PageErrorBoundary = ({ children, pageName }: PageErrorBoundaryProps) => {
  const handleError = (error: Error, errorInfo: { componentStack: string }) => {
    ErrorLogger.logError(error, {
      level: 'high',
      context: `PageErrorBoundary${pageName ? ` - ${pageName}` : ''}`,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      pageName,
    });
  };

  return (
    <ErrorBoundary
      FallbackComponent={(props) => <PageErrorFallback {...props} pageName={pageName} />}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;
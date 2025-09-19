const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

export default LoadingSpinner;
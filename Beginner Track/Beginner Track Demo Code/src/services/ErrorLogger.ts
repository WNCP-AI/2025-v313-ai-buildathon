interface ErrorContext {
  level: 'critical' | 'high' | 'medium' | 'low';
  context: string;
  componentStack?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  pageName?: string;
  featureName?: string;
  additionalData?: Record<string, any>;
}

interface ErrorReport {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  context: ErrorContext;
}

class ErrorLoggerService {
  private errors: ErrorReport[] = [];

  logError(error: Error, context: ErrorContext): void {
    const errorReport: ErrorReport = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
    };

    this.errors.push(errorReport);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🔴 Error [${context.level.toUpperCase()}] - ${context.context}`);
      console.error('Error:', error);
      console.log('Context:', context);
      console.log('Stack:', error.stack);
      console.groupEnd();
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(errorReport).catch(console.error);
    }

    // Store in localStorage for debugging (limit to last 50 errors)
    try {
      const storedErrors = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      const updatedErrors = [errorReport, ...storedErrors].slice(0, 50);
      localStorage.setItem('errorLogs', JSON.stringify(updatedErrors));
    } catch (e) {
      console.warn('Failed to store error in localStorage:', e);
    }
  }

  private async sendToMonitoringService(errorReport: ErrorReport): Promise<void> {
    try {
      // In a real app, you'd send to services like Sentry, LogRocket, etc.
      // For now, we'll just log critical errors to the server
      if (errorReport.context.level === 'critical') {
        await fetch('/api/errors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(errorReport),
        });
      }
    } catch (e) {
      console.warn('Failed to send error to monitoring service:', e);
    }
  }

  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  getStoredErrors(): ErrorReport[] {
    try {
      return JSON.parse(localStorage.getItem('errorLogs') || '[]');
    } catch {
      return [];
    }
  }

  clearErrors(): void {
    this.errors = [];
    localStorage.removeItem('errorLogs');
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Utility method for manual error logging
  logCustomError(
    message: string, 
    context: Omit<ErrorContext, 'level'> & { level?: ErrorContext['level'] }
  ): void {
    const error = new Error(message);
    this.logError(error, { level: 'medium', ...context });
  }
}

export const ErrorLogger = new ErrorLoggerService();
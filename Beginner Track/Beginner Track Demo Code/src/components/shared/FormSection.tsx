import { LucideIcon } from "lucide-react";
import { StandardCard, CardContent, CardHeader, CardTitle } from "@/components/shared/StandardCard";

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = ({
  title,
  description,
  icon: Icon,
  children,
  className
}: FormSectionProps) => {
  return (
    <StandardCard className={className} variant="default">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {Icon && <Icon className="h-5 w-5 text-accent" />}
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </StandardCard>
  );
};

interface FormFieldWrapperProps {
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export const FormFieldWrapper = ({
  label,
  description,
  required = false,
  error,
  children
}: FormFieldWrapperProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
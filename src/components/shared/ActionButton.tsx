import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

const actionButtonVariants = cva(
  "transition-all duration-200 flex items-center gap-2",
  {
    variants: {
      action: {
        edit: "text-primary hover:text-primary/80 hover:bg-primary/10",
        delete: "text-destructive hover:text-destructive/80 hover:bg-destructive/10",
        view: "text-accent hover:text-accent/80 hover:bg-accent/10",
        activate: "text-success hover:text-success/80 hover:bg-success/10",
        deactivate: "text-warning hover:text-warning/80 hover:bg-warning/10"
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base"
      }
    },
    defaultVariants: {
      action: "edit",
      size: "default"
    }
  }
);

interface ActionButtonProps extends VariantProps<typeof actionButtonVariants> {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  requiresConfirmation?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
  loading?: boolean;
  disabled?: boolean;
  variant?: "ghost" | "outline" | "default";
}

export const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  requiresConfirmation = false,
  confirmTitle,
  confirmDescription,
  loading = false,
  disabled = false,
  variant = "ghost",
  action,
  size,
  ...props
}: ActionButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleConfirmedAction = () => {
    onClick();
    setOpen(false);
  };

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      className={actionButtonVariants({ action, size })}
      {...props}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );

  if (requiresConfirmation) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          {buttonContent}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmTitle || `Confirm ${label}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDescription || `Are you sure you want to ${label.toLowerCase()}? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmedAction}
              className={action === "delete" ? "bg-destructive hover:bg-destructive/90" : ""}
            >
              {label}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <div onClick={onClick}>
      {buttonContent}
    </div>
  );
};
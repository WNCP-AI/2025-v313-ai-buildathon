import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card border-border shadow-card hover:shadow-hover",
        interactive: "bg-card border-border shadow-card hover:shadow-md hover:scale-[1.02] cursor-pointer",
        stats: "bg-gradient-to-br from-card to-card/95 border-border shadow-card hover:shadow-hover",
        admin: "bg-card border-border shadow-sm hover:shadow-card",
        featured: "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-card hover:shadow-hover"
      },
      size: {
        default: "",
        compact: "p-4",
        large: "p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

interface StandardCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children: React.ReactNode;
}

export const StandardCard = ({ 
  className, 
  variant, 
  size, 
  children, 
  ...props 
}: StandardCardProps) => {
  return (
    <Card 
      className={cn(cardVariants({ variant, size }), className)} 
      {...props}
    >
      {children}
    </Card>
  );
};

export { CardContent, CardHeader, CardTitle };
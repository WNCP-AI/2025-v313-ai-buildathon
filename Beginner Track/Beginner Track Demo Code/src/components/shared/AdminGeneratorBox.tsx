import { LucideIcon } from "lucide-react";
import { StandardCard, CardContent, CardHeader, CardTitle } from "@/components/shared/StandardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2 } from "lucide-react";

interface AdminGeneratorBoxProps {
  title: string;
  description: string;
  icon: LucideIcon;
  // Model selection
  model: string;
  onModelChange: (value: string) => void;
  modelOptions: Array<{ value: string; label: string }>;
  // Count
  count: number;
  onCountChange: (count: number) => void;
  maxCount?: number;
  // Guidance
  guidance: string;
  onGuidanceChange: (guidance: string) => void;
  guidancePlaceholder: string;
  // Generation
  onGenerate: () => void;
  loading: boolean;
  // Optional additional fields
  additionalFields?: React.ReactNode;
}

export const AdminGeneratorBox = ({
  title,
  description,
  icon: Icon,
  model,
  onModelChange,
  modelOptions,
  count,
  onCountChange,
  maxCount = 50,
  guidance,
  onGuidanceChange,
  guidancePlaceholder,
  onGenerate,
  loading,
  additionalFields
}: AdminGeneratorBoxProps) => {
  return (
    <StandardCard className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-accent" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-4 lg:p-6">
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        <div className="flex flex-col flex-1 space-y-3">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                AI Model
              </label>
              <Select value={model} onValueChange={onModelChange} disabled={modelOptions.length === 0 || modelOptions[0]?.value === "loading"}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      disabled={option.value === "loading"}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {additionalFields}
            
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Content Creation Guidance (optional)
              </label>
              <Input
                type="text"
                value={guidance}
                onChange={(e) => onGuidanceChange(e.target.value)}
                placeholder={guidancePlaceholder}
                className="h-9 w-full placeholder:text-muted-foreground text-sm"
              />
            </div>
          </div>
          <div className="mt-auto pt-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground block mb-2">
                  Count
                </label>
                <Input
                  type="number"
                  value={count}
                  onChange={(e) => onCountChange(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={maxCount}
                  className="h-9 w-full text-center"
                />
              </div>
              <Button 
                onClick={onGenerate}
                disabled={loading}
                className="h-9 px-4 flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[120px]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </StandardCard>
  );
};
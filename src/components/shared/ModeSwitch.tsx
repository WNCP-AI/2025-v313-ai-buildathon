import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { useMode } from "@/contexts/ModeContext";

const ModeSwitch = () => {
  const { currentMode, switchMode } = useMode();

  return (
    <Card className="shadow-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">View Mode</h3>
            <p className="text-sm text-muted-foreground">
              Switch between consumer and operator views
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`text-sm ${currentMode === 'consumer' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
              Consumer
            </span>
            <Switch
              checked={currentMode === "operator"}
              onCheckedChange={(checked) => switchMode(checked ? "operator" : "consumer")}
            />
            <span className={`text-sm ${currentMode === 'operator' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
              Operator
            </span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-secondary rounded-lg">
          <p className="text-sm text-secondary-foreground">
            {currentMode === "consumer" 
              ? "You're viewing as a service consumer. Switch to operator mode to manage services and bookings."
              : "You're viewing as a service operator. You can manage your listings and view booking requests."
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModeSwitch;
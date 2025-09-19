import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/SimpleAuthContext";
import AppLayout from "@/components/layout/AppLayout";
import ModeSwitch from "@/components/shared/ModeSwitch";

const SimpleProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <ModeSwitch />

        <Card className="shadow-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                <p className="text-foreground capitalize">{user.user_metadata?.role || 'Consumer'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="text-foreground">{memberSince}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SimpleProfile;
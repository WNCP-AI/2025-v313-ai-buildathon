import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Settings } from "lucide-react";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  role: string;
  is_ai_generated?: boolean;
}

const AdminEditUser = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Check if user has admin access
  const isAdmin = user?.email?.endsWith('@wncp.ai') || false;

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    if (userId) {
      fetchProfile();
    }
  }, [userId, isAdmin]);

  const fetchProfile = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { 
          action: 'get-profile',
          userId: userId
        }
      });

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Could not load user profile",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke('admin-data', {
        body: { 
          action: 'update-profile',
          userId: userId,
          profileData: {
            full_name: profile.full_name,
            phone: profile.phone,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            role: profile.role as "operator" | "consumer",
          }
        }
      });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update user profile",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "User profile updated successfully",
      });
      
      navigate('/admin');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              This area is restricted to authorized administrators only.
            </p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading user profile...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The user profile you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/admin')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin Panel
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/admin')} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Edit User Profile</h1>
              <p className="text-muted-foreground">
                Modify user information and settings
              </p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Edit Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Enter user bio"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  value={profile.avatar_url || ''}
                  onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                  placeholder="Enter avatar image URL"
                />
              </div>
            </CardContent>
          </Card>

          {/* Role Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Role Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="role">User Role</Label>
                <Select value={profile.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumer">Consumer</SelectItem>
                    <SelectItem value="operator">Service Provider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {profile.is_ai_generated && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    This profile was generated by AI
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminEditUser;
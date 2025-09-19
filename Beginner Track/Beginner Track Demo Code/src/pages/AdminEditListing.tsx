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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Settings } from "lucide-react";

interface ServiceListing {
  id: string;
  operator_id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  service_area_text?: string;
  image_url?: string;
  is_active: boolean;
}

const AdminEditListing = () => {
  const { listingId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [listing, setListing] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Check if user has admin access
  const isAdmin = user?.email?.endsWith('@wncp.ai') || false;

  const categories = [
    { value: 'food_delivery', label: 'Food Delivery' },
    { value: 'courier_parcel', label: 'Courier/Parcel' },
    { value: 'aerial_imaging', label: 'Aerial Imaging' },
    { value: 'site_mapping', label: 'Site Mapping' },
  ];

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    if (listingId) {
      fetchListing();
    }
  }, [listingId, isAdmin]);

  const fetchListing = async () => {
    if (!listingId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { 
          action: 'get-listing',
          listingId: listingId
        }
      });

      if (error) {
        console.error('Error fetching listing:', error);
        toast({
          title: "Error",
          description: "Could not load service listing",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setListing(data);
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
    if (!listing) return;
    
    setSaving(true);
    try {
      const { error } = await supabase.functions.invoke('admin-data', {
        body: { 
          action: 'update-listing',
          listingId: listingId,
          listingData: {
            title: listing.title,
            description: listing.description,
            category: listing.category as "food_delivery" | "courier_parcel" | "aerial_imaging" | "site_mapping",
            price: listing.price,
            service_area_text: listing.service_area_text,
            image_url: listing.image_url,
            is_active: listing.is_active,
          }
        }
      });

      if (error) {
        console.error('Error updating listing:', error);
        toast({
          title: "Error",
          description: "Failed to update service listing",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success!",
        description: "Service listing updated successfully",
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

  const handleInputChange = (field: keyof ServiceListing, value: string | number | boolean) => {
    if (!listing) return;
    setListing({ ...listing, [field]: value });
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
            <p className="text-muted-foreground">Loading service listing...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!listing) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">Listing Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The service listing you're looking for doesn't exist.
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
              <h1 className="text-2xl font-bold text-foreground">Edit Service Listing</h1>
              <p className="text-muted-foreground">
                Modify service listing details and settings
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
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  value={listing.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter service title"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={listing.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter service description"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={listing.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={listing.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="Enter price"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="service_area_text">Service Area</Label>
                <Input
                  id="service_area_text"
                  value={listing.service_area_text || ''}
                  onChange={(e) => handleInputChange('service_area_text', e.target.value)}
                  placeholder="Enter service area"
                />
              </div>
              
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={listing.image_url || ''}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Listing Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={listing.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
                <Label htmlFor="is_active">
                  {listing.is_active ? 'Active (Visible to users)' : 'Inactive (Hidden from users)'}
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AdminEditListing;
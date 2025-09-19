import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, MapPin, Phone, Calendar, Package, DollarSign, Camera } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

interface ProfileData {
  full_name: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

interface ServiceListing {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  service_area_text?: string;
  image_url?: string;
  is_active: boolean;
}

const ViewProfile = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchProfile();
      fetchOperatorListings();
    }
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Check if user is admin and try admin route first
      const isAdmin = user?.email?.endsWith('@wncp.ai') || false;
      
      if (isAdmin) {
        // Try admin route first for more reliable access
        const { data: adminData, error: adminError } = await supabase.functions.invoke('admin-data', {
          body: { 
            action: 'get-profile',
            userId: userId
          }
        });

        if (!adminError && adminData) {
          setProfile(adminData);
          setLoading(false);
          return;
        }
      }

      // Fallback to regular client route (for non-admin or if admin route fails)
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone, bio, avatar_url, role, created_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Could not load profile information",
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

  const fetchOperatorListings = async () => {
    if (!userId) return;
    
    setListingsLoading(true);
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, description, category, price, service_area_text, image_url, is_active')
        .eq('operator_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error);
        return;
      }

      if (data) {
        setListings(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setListingsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">
            The profile you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Section */}
        <Card className="shadow-card">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
                <DialogTrigger asChild>
                  <Avatar className="h-24 w-24 border-4 border-border cursor-pointer hover:opacity-80 transition-opacity">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback className="text-2xl font-bold">
                      {getInitials(profile.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-full">
                  <div className="relative">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.full_name}
                        className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
                        <User className="h-24 w-24 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Profile Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground">
                    {profile.full_name}
                  </h1>
                  <Badge 
                    variant="secondary" 
                    className="w-fit bg-accent/10 text-accent border-accent/20"
                  >
                    {profile.role === 'operator' ? 'Service Provider' : 'Consumer'}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {formatMemberSince(profile.created_at)}</span>
                  </div>
                  {/* Phone number removed from public profile view */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio Section */}
        {profile.bio && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Service Listings Section (if operator) */}
        {profile.role === 'operator' && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Available Services
                {listings.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {listings.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {listingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : listings.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {listings.map((listing) => (
                    <div 
                      key={listing.id}
                      className="group border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-accent/50 bg-card"
                      onClick={() => navigate(`/listing/${listing.id}`)}
                    >
                      {/* Image */}
                      <div className="mb-4">
                        {listing.image_url ? (
                          <img 
                            src={listing.image_url} 
                            alt={listing.title}
                            className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                            {listing.title}
                          </h3>
                        </div>
                        
                        <Badge 
                          variant="secondary" 
                          className="text-xs bg-accent/10 text-accent border-accent/20"
                        >
                          {listing.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-accent font-bold text-xl">
                            <DollarSign className="h-5 w-5" />
                            {listing.price}
                          </div>
                          
                          {listing.service_area_text && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span className="line-clamp-1">{listing.service_area_text}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    This operator hasn't listed any services yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}


      </div>
    </AppLayout>
  );
};

export default ViewProfile;
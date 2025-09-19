import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Star, Clock, ArrowLeft, User, Calendar, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type Listing = Database["public"]["Tables"]["listings"]["Row"] & {
  profiles?: {
    full_name: string;
    bio?: string;
    avatar_url?: string;
  };
};

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    preferredDate: "",
    preferredTime: "",
    requirements: ""
  });

  const categoryLabels = {
    food_delivery: "Food Delivery",
    courier_parcel: "Courier & Parcel", 
    aerial_imaging: "Aerial Imaging",
    site_mapping: "Site Mapping",
  };

  const fetchListing = useCallback(async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          profiles:operator_id (full_name, bio, avatar_url)
        `)
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching listing:", error);
        toast({
          title: "Error",
          description: "Failed to load listing details.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        toast({
          title: "Not Found",
          description: "This listing is no longer available.",
          variant: "destructive",
        });
        navigate("/browse");
        return;
      }

      setListing(data);
    } catch (error) {
      console.error("Error in fetchListing:", error);
    } finally {
      setLoading(false);
    }
  }, [id, toast, navigate]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const handleBooking = async () => {
    if (!user || !listing) return;

    try {
      // Create the booking request with completed status (skip pending)
      const { data: booking, error: bookingError } = await supabase
        .from("booking_requests")
        .insert({
          consumer_id: user.id,
          listing_id: listing.id,
          preferred_date: bookingForm.preferredDate || null,
          preferred_time: bookingForm.preferredTime || null,
          requirements: bookingForm.requirements || null,
          status: 'completed' // Set directly to completed
        })
        .select()
        .single();

      if (bookingError) {
        console.error("Error creating booking:", bookingError);
        toast({
          title: "Error",
          description: "Failed to submit booking request.",
          variant: "destructive",
        });
        return;
      }

      // Get consumer's name from user metadata or profile
      const consumerName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Customer";
      
      // Send emails to both operator and consumer
      try {
        // Send email to operator (existing functionality)
        await supabase.functions.invoke('send-booking-notification', {
          body: {
            operatorId: listing.operator_id,
            operatorName: listing.profiles?.full_name || "Operator",
            consumerName: consumerName,
            consumerEmail: user.email || "",
            serviceName: listing.title,
            requirements: bookingForm.requirements || "",
            preferredDate: bookingForm.preferredDate,
            preferredTime: bookingForm.preferredTime,
            bookingId: booking.id
          }
        });

        // Send confirmation email to consumer
        await supabase.functions.invoke('send-status-notification', {
          body: {
            consumerId: user.id,
            bookingId: booking.id,
            serviceName: listing.title,
            newStatus: 'confirmed',
            operatorName: listing.profiles?.full_name || "Operator",
            preferredDate: bookingForm.preferredDate,
            preferredTime: bookingForm.preferredTime
          }
        });
      } catch (emailError) {
        // Don't fail the booking if email fails
        console.warn("Email notification failed:", emailError);
      }

      toast({
        title: "Booking Confirmed!",
        description: "Your service has been booked and confirmation emails have been sent.",
      });

      setShowBookingModal(false);
      setBookingForm({ preferredDate: "", preferredTime: "", requirements: "" });
      
      // Navigate to orders page to show the completed booking
      navigate("/orders");
    } catch (error) {
      console.error("Error in handleBooking:", error);
      toast({
        title: "Error", 
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getOperatorInitials = (name: string) => {
    if (name) {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'OP';
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <Card>
              <CardHeader>
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-12 bg-muted rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!listing) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Listing Not Found</h2>
          <Button onClick={() => navigate("/browse")}>
            Back to Browse
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/browse")}
          className="mb-6 pl-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Browse
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{listing.title}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{listing.profiles?.full_name || "Professional Operator"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>4.8 (23 reviews)</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {categoryLabels[listing.category as keyof typeof categoryLabels]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Service Image */}
                  {listing.image_url && (
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Description */}
                  {listing.description && (
                    <div>
                      <h3 className="font-semibold mb-2">Service Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {listing.description}
                      </p>
                    </div>
                  )}

                  {/* Service Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                      <MapPin className="h-5 w-5 text-accent" />
                      <div>
                        <div className="font-medium">Service Area</div>
                        <div className="text-sm text-muted-foreground">
                          {listing.service_area_text || "Available in your area"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
                      <Clock className="h-5 w-5 text-accent" />
                      <div>
                        <div className="font-medium">Availability</div>
                        <div className="text-sm text-muted-foreground">
                          Available now
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operator Bio */}
                  {listing.profiles?.bio && (
                    <div>
                      <h3 className="font-semibold mb-2">About the Operator</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {listing.profiles.bio}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Operator Profile Card */}
            <Card 
              className="cursor-pointer hover:shadow-lg transition-shadow border-accent/20"
              onClick={() => navigate(`/profile/${listing.operator_id}`)}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Service Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-accent/20">
                    <AvatarImage 
                      src={listing.profiles?.avatar_url} 
                      alt={listing.profiles?.full_name} 
                    />
                    <AvatarFallback className="bg-accent/10 text-accent font-semibold text-lg">
                      {getOperatorInitials(listing.profiles?.full_name || "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {listing.profiles?.full_name || "Professional Operator"}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-muted-foreground">4.8 (23 reviews)</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Click to view full profile
                    </p>
                  </div>
                </div>
                {listing.profiles?.bio && (
                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                    {listing.profiles.bio}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card className="sticky top-6">
              <CardHeader>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-1">
                    ${Number(listing.price).toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Starting price</div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                      return;
                    }
                    setShowBookingModal(true);
                  }}
                >
                  Book This Service
                </Button>
                <div className="mt-4 pt-4 border-t space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Quick response time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Highly rated operator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Direct communication</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking Modal */}
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Service</DialogTitle>
              <DialogDescription>
                Book "{listing.title}" now. Both you and the operator will receive confirmation emails immediately.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferred-date">Preferred Date</Label>
                  <Input
                    id="preferred-date"
                    type="date"
                    value={bookingForm.preferredDate}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, preferredDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="preferred-time">Preferred Time</Label>
                  <Input
                    id="preferred-time"
                    type="time"
                    value={bookingForm.preferredTime}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="requirements">Special Requirements</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any specific requirements or details for your service..."
                  value={bookingForm.requirements}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, requirements: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBookingModal(false)}>
                Cancel
              </Button>
               <Button onClick={handleBooking}>
                 Book Service
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default ListingDetail;
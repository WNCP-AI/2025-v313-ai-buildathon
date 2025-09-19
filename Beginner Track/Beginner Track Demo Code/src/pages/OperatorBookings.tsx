import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StandardCard, CardContent, CardHeader, CardTitle } from "@/components/shared/StandardCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Mail, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";


interface BookingRequest {
  id: string;
  consumer_id: string;
  listing_id: string;
  preferred_date: string | null;
  preferred_time: string | null;
  requirements: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  listings: {
    title: string;
    category: string;
    price: number;
  };
  profiles: {
    full_name: string;
  } | null;
}

const OperatorBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingBookings, setUpdatingBookings] = useState<Set<string>>(new Set()); // Keep for potential future use

  const categoryLabels = {
    food_delivery: "Food Delivery",
    courier_parcel: "Courier & Parcel",
    aerial_imaging: "Aerial Imaging",
    site_mapping: "Site Mapping",
  };

  const fetchBookings = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from("booking_requests")
        .select(`
          id,
          consumer_id,
          listing_id,
          preferred_date,
          preferred_time,
          requirements,
          status,
          created_at,
          listings!inner (
            title,
            category,
            price
          ),
          profiles!consumer_id (
            full_name
          )
        `)
        .eq("listings.operator_id", user.id)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter as 'pending' | 'confirmed' | 'cancelled' | 'completed');
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching bookings:", error);
        toast({
          title: "Error",
          description: "Failed to load booking requests.",
          variant: "destructive",
        });
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error("Error in fetchBookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user, statusFilter]);

  // Removed handleStatusUpdate since bookings are automatically completed

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return "Not specified";
    return timeString;
  };

  if (loading) {
    return (
      <AppLayout>
        <LoadingSpinner />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Service Bookings</h1>
          <p className="text-muted-foreground">
            View completed bookings from your customers.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Filter by status:</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No bookings found"
            description={
              statusFilter === "all" 
                ? "You haven't received any bookings yet."
                : `No ${statusFilter} bookings found.`
            }
          />
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <StandardCard key={booking.id} variant="interactive">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 flex items-center gap-2">
                        {booking.listings.title}
                        <Badge 
                          variant="outline" 
                          className={`ml-2 ${getStatusColor(booking.status)}`}
                        >
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="capitalize">
                          {categoryLabels[booking.listings.category as keyof typeof categoryLabels]}
                        </span>
                        <span>${Number(booking.listings.price).toFixed(2)}</span>
                        <span>
                          Requested {new Date(booking.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <User className="h-4 w-4 text-accent" />
                        Customer Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">
                            {booking.profiles?.full_name || "Customer"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent" />
                        Booking Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Preferred Date:</span>
                          <span className="font-medium">{formatDate(booking.preferred_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Preferred Time:</span>
                          <span className="font-medium">{formatTime(booking.preferred_time)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  {booking.requirements && (
                    <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                      <h4 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-accent" />
                        Special Requirements
                      </h4>
                      <p className="text-sm text-muted-foreground">{booking.requirements}</p>
                    </div>
                  )}

                  {/* No actions needed since bookings are automatically completed */}
                </CardContent>
              </StandardCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default OperatorBookings;
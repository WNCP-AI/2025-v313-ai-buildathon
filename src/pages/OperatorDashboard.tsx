import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import StatsCard from "@/components/StatsCard";
import { 
  List, 
  Calendar, 
  Clock, 
  Star 
} from "lucide-react";

interface DashboardStats {
  activeListings: number;
  pendingBookings: number;
  weeklyRequests: number;
  averageRating: string;
}

const OperatorDashboard = () => {
  const { user, getUserRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    activeListings: 0,
    pendingBookings: 0,
    weeklyRequests: 0,
    averageRating: "4.8"
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    if (!user) return;

    try {
      // Fetch active listings count
      const { count: activeListingsCount } = await supabase
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("operator_id", user.id)
        .eq("is_active", true);

      // Fetch pending bookings count
      const { count: pendingBookingsCount } = await supabase
        .from("booking_requests")
        .select("listing_id, listings!inner(operator_id)", { count: "exact", head: true })
        .eq("listings.operator_id", user.id)
        .eq("status", "pending");

      // Fetch this week's requests count
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: weeklyRequestsCount } = await supabase
        .from("booking_requests")
        .select("listing_id, listings!inner(operator_id)", { count: "exact", head: true })
        .eq("listings.operator_id", user.id)
        .gte("created_at", oneWeekAgo.toISOString());

      setStats({
        activeListings: activeListingsCount || 0,
        pendingBookings: pendingBookingsCount || 0,
        weeklyRequests: weeklyRequestsCount || 0,
        averageRating: "4.8" // Placeholder for now
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  // Redirect non-operators to browse page instead of showing blank screen
  useEffect(() => {
    if (user && getUserRole() !== "operator") {
      navigate("/browse");
    }
  }, [user, getUserRole, navigate]);

  if (!user) {
    return null;
  }

  if (getUserRole() !== "operator") {
    return null; // Will redirect via useEffect above
  }

  return (
    <AppLayout>
      {/* Welcome Message */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
        </h2>
        <p className="text-muted-foreground">
          Here's your performance overview for today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Listings"
          value={stats.activeListings}
          icon={List}
          loading={loading}
        />
        <StatsCard
          title="Pending Bookings"
          value={stats.pendingBookings}
          icon={Calendar}
          loading={loading}
        />
        <StatsCard
          title="This Week's Requests"
          value={stats.weeklyRequests}
          icon={Clock}
          loading={loading}
        />
        <StatsCard
          title="Average Rating"
          value={stats.averageRating}
          icon={Star}
          loading={false}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              className="w-full flex items-center justify-start px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors" 
              onClick={() => navigate("/operator-dashboard/new-listing")}
            >
              <List className="h-4 w-4 mr-2" />
              Add New Service
            </button>
            <button 
              className="w-full flex items-center justify-start px-4 py-2 border border-border hover:bg-muted/50 rounded-lg transition-colors"
              onClick={() => navigate("/operator-dashboard/listings")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Manage Listings
            </button>
            <button 
              className="w-full flex items-center justify-start px-4 py-2 border border-border hover:bg-muted/50 rounded-lg transition-colors"
              onClick={() => navigate("/operator-dashboard/bookings")}
            >
              <Clock className="h-4 w-4 mr-2" />
              View Bookings
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-4 bg-muted animate-pulse rounded"></div>
              </div>
            ) : stats.pendingBookings > 0 ? (
              <p className="text-sm text-muted-foreground">
                You have {stats.pendingBookings} pending booking{stats.pendingBookings !== 1 ? 's' : ''} to review
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                No new activity to show
              </p>
            )}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-3">Tips</h3>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              • Keep your listings updated with accurate pricing
            </p>
            <p className="text-sm text-muted-foreground">
              • Respond to booking requests quickly
            </p>
            <p className="text-sm text-muted-foreground">
              • Add detailed descriptions to attract more clients
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default OperatorDashboard;
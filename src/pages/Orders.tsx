import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StandardCard, CardContent, CardHeader, CardTitle } from "@/components/shared/StandardCard";
import { EmptyState, LoadingGrid } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Calendar, User, DollarSign, Package, Search, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

interface OrderWithDetails {
  id: string;
  consumer_id: string;
  listing_id: string;
  preferred_date: string | null;
  preferred_time: string | null;
  requirements: string | null;
  status: string;
  created_at: string;
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    operator_id: string;
  };
  operator_profile: {
    full_name: string;
    phone: string;
  };
}

const Orders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
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
          listings:listing_id (
            id,
            title,
            description,
            price,
            category,
            image_url,
            operator_id,
            profiles:operator_id (
              full_name,
              phone
            )
          )
        `)
        .eq("consumer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch orders.",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our interface
      const transformedOrders: OrderWithDetails[] = data?.map((order: any) => ({
        ...order,
        listing: order.listings,
        operator_profile: order.listings?.profiles || { full_name: "Unknown", phone: "" }
      })) || [];

      setOrders(transformedOrders);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isOrderPast = (order: OrderWithDetails) => {
    // All completed orders should be in past purchases
    if (order.status === 'completed') {
      return true;
    }
    
    // Also check if date/time has passed for other statuses
    if (!order.preferred_date || !order.preferred_time) {
      return false;
    }
    
    const orderDateTime = new Date(`${order.preferred_date}T${order.preferred_time}`);
    return orderDateTime < new Date();
  };

  const getActiveOrders = () => orders.filter(order => !isOrderPast(order));
  const getPastOrders = () => orders.filter(order => isOrderPast(order));

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "completed":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatOrderDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMM dd, yyyy");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const OrderCard = ({ order }: { order: OrderWithDetails }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <StandardCard variant="interactive" className="w-full">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{order.listing?.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatOrderDate(order.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {order.operator_profile?.full_name}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatPrice(order.listing?.price || 0)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                  <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="border-t pt-4">
                {/* Embedded service listing */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                  <div className="flex items-start gap-4">
                    {order.listing?.image_url && (
                      <div className="w-24 h-24 rounded-lg bg-background overflow-hidden flex-shrink-0">
                        <img 
                          src={order.listing.image_url} 
                          alt={order.listing.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-base">{order.listing?.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.listing?.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline">
                          {order.listing?.category?.replace('_', ' ')}
                        </Badge>
                        <span className="font-semibold text-primary">
                          {formatPrice(order.listing?.price || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order details */}
                  <div className="border-t pt-4 space-y-3">
                    <h5 className="font-medium">Order Details</h5>
                    
                    {order.preferred_date && (
                      <div className="text-sm">
                        <span className="font-medium">Preferred Date: </span>
                        {format(new Date(order.preferred_date), "MMMM dd, yyyy")}
                      </div>
                    )}
                    
                    {order.preferred_time && (
                      <div className="text-sm">
                        <span className="font-medium">Preferred Time: </span>
                        {order.preferred_time}
                      </div>
                    )}
                    
                    {order.requirements && (
                      <div className="text-sm">
                        <span className="font-medium">Requirements: </span>
                        <p className="mt-1 text-muted-foreground">{order.requirements}</p>
                      </div>
                    )}

                    <div className="text-sm">
                      <span className="font-medium">Order Placed: </span>
                      {format(new Date(order.created_at), "MMMM dd, yyyy 'at' h:mm a")}
                    </div>

                    {/* Operator contact info */}
                    <div className="flex items-center gap-3 pt-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {order.operator_profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'OP'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <div className="font-medium">{order.operator_profile?.full_name}</div>
                        {order.operator_profile?.phone && (
                          <div className="text-muted-foreground">{order.operator_profile.phone}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </StandardCard>
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <LoadingGrid />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm">
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="past">Past Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {getActiveOrders().length === 0 ? (
              <EmptyState
                icon={Search}
                title="No Active Orders"
                description="You don't have any active orders at the moment."
                actionLabel="Browse Services"
                onAction={() => navigate("/browse")}
              />
            ) : (
              <div className="space-y-4">
                {getActiveOrders().map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {getPastOrders().length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No Past Orders"
                description="You haven't completed any orders yet."
                actionLabel="Browse Services"
                onAction={() => navigate("/browse")}
              />
            ) : (
              <div className="space-y-4">
                {getPastOrders().map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Orders;
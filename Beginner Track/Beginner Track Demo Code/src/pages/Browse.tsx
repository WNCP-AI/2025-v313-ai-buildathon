import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StandardCard, CardContent, CardHeader, CardTitle } from "@/components/shared/StandardCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingGrid } from "@/components/shared/LoadingState";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Clock } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type ServiceCategory = Database["public"]["Enums"]["service_category"];

type Listing = Database["public"]["Tables"]["listings"]["Row"] & {
  profiles?: {
    full_name: string;
  };
};

const Browse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get("category") || "all");

  const categoryLabels = {
    food_delivery: "Food Delivery",
    courier_parcel: "Courier & Parcel",
    aerial_imaging: "Aerial Imaging",
    site_mapping: "Site Mapping",
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Enhanced search function with fuzzy matching
  const enhancedSearch = useCallback((listing: Listing, searchQuery: string) => {
    if (!searchQuery) return true;

    // Normalize search query - remove special chars, convert to lowercase
    const normalizeText = (text: string) => 
      text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();

    const normalizedQuery = normalizeText(searchQuery);
    const searchTerms = normalizedQuery.split(' ').filter(term => term.length > 0);

    // Fields to search in
    const searchFields = [
      listing.title,
      listing.description || '',
      listing.profiles?.full_name || '',
      listing.service_area_text || '',
      categoryLabels[listing.category as keyof typeof categoryLabels] || '',
    ];

    // Normalize all search fields
    const normalizedFields = searchFields.map(field => normalizeText(field));
    const combinedText = normalizedFields.join(' ');

    // Check if any search term matches (partial matching)
    return searchTerms.some(term => 
      normalizedFields.some(field => field.includes(term)) ||
      combinedText.includes(term)
    );
  }, [categoryLabels]);

  const fetchListings = useCallback(async () => {
    try {
      let query = supabase
        .from("listings")
        .select(`
          *,
          profiles:operator_id (full_name)
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq("category", selectedCategory as ServiceCategory);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching listings:", error);
        return;
      }

      let filteredData = data || [];
      
      // Apply enhanced search filter
      if (debouncedSearchTerm) {
        filteredData = filteredData.filter(listing => 
          enhancedSearch(listing, debouncedSearchTerm)
        );
      }

      setListings(filteredData);
    } catch (error) {
      console.error("Error in fetchListings:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearchTerm, enhancedSearch]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Update URL when search or category changes (using debounced search)
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    setSearchParams(params, { replace: true });
  }, [debouncedSearchTerm, selectedCategory, setSearchParams]);

  const handleViewListing = (listingId: string) => {
    navigate(`/listing/${listingId}`);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Browse Services</h1>
          <p className="text-muted-foreground">
            Find and book drone services from qualified operators in your area.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services, operators, areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="food_delivery">Food Delivery</SelectItem>
              <SelectItem value="courier_parcel">Courier & Parcel</SelectItem>
              <SelectItem value="aerial_imaging">Aerial Imaging</SelectItem>
              <SelectItem value="site_mapping">Site Mapping</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Service Listings */}
        {loading ? (
          <LoadingGrid count={6} variant="card" />
        ) : listings.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No services found"
            description={
              debouncedSearchTerm || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria."
                : "No services are currently available. Check back later!"
            }
            actionLabel={(debouncedSearchTerm || selectedCategory !== "all") ? "Clear Filters" : undefined}
            onAction={(debouncedSearchTerm || selectedCategory !== "all") ? () => {
              setSearchTerm("");
              setDebouncedSearchTerm("");
              setSelectedCategory("all");
            } : undefined}
            variant="search"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <StandardCard key={listing.id} variant="interactive" className="overflow-hidden">
                {/* Image */}
                {listing.image_url && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{listing.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{listing.profiles?.full_name || "Professional Operator"}</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {categoryLabels[listing.category as keyof typeof categoryLabels]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listing.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {listing.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{listing.service_area_text || "Service area available"}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">
                          ${Number(listing.price).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">Starting price</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Available now</span>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => handleViewListing(listing.id)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </StandardCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Browse;
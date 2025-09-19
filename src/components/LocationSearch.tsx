import { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Location {
  display_name: string;
  lat: string;
  lon: string;
  name: string;
}

interface LocationSearchProps {
  onLocationSelect?: (location: string) => void;
}

const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Detroit, MI");
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
            searchQuery
          )}&countrycodes=us&addressdetails=1&featuretype=city`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setSuggestions([]);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          const data = await response.json();
          
          const city = data.address?.city || data.address?.town || data.address?.village;
          const state = data.address?.state;
          const locationName = city && state ? `${city}, ${state}` : data.display_name;
          
          setSelectedLocation(locationName);
          onLocationSelect?.(locationName);
        } catch (error) {
          console.error("Error reverse geocoding:", error);
        }
        setIsDetecting(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsDetecting(false);
      }
    );
  };

  const handleLocationSelect = (location: Location) => {
    const address = location.display_name.split(",");
    const cityState = `${address[0]}, ${address[1]?.trim() || ""}`.trim();
    setSelectedLocation(cityState);
    onLocationSelect?.(cityState);
    setIsOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const formatLocationName = (location: Location) => {
    const parts = location.display_name.split(",");
    return `${parts[0]}, ${parts[1]?.trim() || ""}`.trim();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={cn(
          "flex items-center justify-between pl-12 pr-4 h-11 rounded-md border border-input bg-background cursor-pointer transition-colors",
          isOpen && "ring-2 ring-accent/20 border-accent"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <span className="text-base truncate pr-2">{selectedLocation}</span>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-accent/20"
            onClick={(e) => {
              e.stopPropagation();
              detectCurrentLocation();
            }}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Navigation className="h-3 w-3" />
            )}
          </Button>
          <ChevronDown
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-border">
            <Input
              ref={inputRef}
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9"
              autoFocus
            />
          </div>
          
          <div className="max-h-48 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Searching...</span>
              </div>
            )}
            
            {!isLoading && suggestions.length > 0 && (
              <div className="py-1">
                {suggestions.map((location, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-4 py-2 hover:bg-accent/10 transition-colors text-sm"
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 text-muted-foreground mr-2 flex-shrink-0" />
                      <span className="truncate">{formatLocationName(location)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {!isLoading && searchQuery.length >= 3 && suggestions.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No cities found
              </div>
            )}
            
            {!searchQuery && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Type to search cities
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
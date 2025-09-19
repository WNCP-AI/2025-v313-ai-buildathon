import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LocationSearch from "./LocationSearch";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    navigate(`/browse?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative bg-background py-20 px-5 lg:px-6">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
          Find trusted drone operators
          <br />
          <span className="text-accent">for any service</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Connect with certified drone professionals for food delivery, courier services, aerial photography, and more.
        </p>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-card p-4 border border-divider">
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="What service do you need?"
                className="pl-12 h-11 text-base border-border focus:ring-2 focus:ring-accent/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            
            <LocationSearch />
            
            <Button 
              variant="cta" 
              size="lg" 
              className="h-11 text-base font-medium"
              onClick={handleSearch}
            >
              Search Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
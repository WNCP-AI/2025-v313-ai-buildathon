import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import operatorImg from "@/assets/operator-1.jpg";

interface OperatorProfile {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
}

interface FeaturedOperator {
  name: string;
  rating: number;
  specialty: string;
  achievement: string;
  image: string;
}

const dummyOperators: FeaturedOperator[] = [
  {
    name: "Mike R.",
    rating: 4.9,
    specialty: "Food & Courier",
    achievement: "500+ deliveries",
    image: operatorImg,
  },
  {
    name: "Sarah K.",
    rating: 5.0,
    specialty: "Aerial Specialist",
    achievement: "FAA Certified",
    image: operatorImg,
  },
  {
    name: "Tom L.",
    rating: 4.8,
    specialty: "All Services",
    achievement: "Available 24/7",
    image: operatorImg,
  },
  {
    name: "Amy C.",
    rating: 4.9,
    specialty: "Express Courier",
    achievement: "Same-day ready",
    image: operatorImg,
  },
];

const specialties = ["Aerial Imaging", "Food Delivery", "Courier Service", "Site Mapping", "All Services"];
const achievements = ["FAA Certified", "500+ deliveries", "Available 24/7", "Same-day ready", "Licensed Pilot", "Insured & Bonded"];

const FeaturedOperators = () => {
  const [operators, setOperators] = useState<FeaturedOperator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        // Fetch real operators from the database
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url, bio')
          .eq('role', 'operator')
          .limit(8); // Get more than 4 so we can randomly select

        if (error) throw error;

        if (profiles && profiles.length > 0) {
          // Shuffle and take up to 4 operators
          const shuffled = [...profiles].sort(() => Math.random() - 0.5);
          const selectedProfiles = shuffled.slice(0, 4);

          // Transform real operators to featured operator format
          const realOperators: FeaturedOperator[] = selectedProfiles.map((profile) => ({
            name: profile.full_name || "Anonymous Operator",
            rating: Number((4.5 + Math.random() * 0.5).toFixed(1)), // Random rating between 4.5-5.0
            specialty: specialties[Math.floor(Math.random() * specialties.length)],
            achievement: achievements[Math.floor(Math.random() * achievements.length)],
            image: profile.avatar_url || operatorImg,
          }));

          setOperators(realOperators);
        } else {
          // No real operators found, use dummy data
          setOperators(dummyOperators);
        }
      } catch (error) {
        console.error('Error fetching operators:', error);
        // Fallback to dummy data on error
        setOperators(dummyOperators);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  if (loading) {
    return (
      <section id="providers" className="py-20 px-5 lg:px-6">
        <div className="container mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground">Featured Drone Operators</h2>
        </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border border-divider">
                <CardContent className="p-4 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded mb-1 animate-pulse"></div>
                  <div className="h-3 bg-muted rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="providers" className="py-20 px-5 lg:px-6">
      <div className="container mx-auto">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground">Featured Drone Operators</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {operators.map((operator, index) => (
            <Card key={index} className="group hover:shadow-hover transition-all duration-200 hover:scale-[1.02] border border-divider">
              <CardContent className="p-4 text-center">
                <div className="relative mb-4">
                  <img
                    src={operator.image}
                    alt={operator.name}
                    className="w-16 h-16 rounded-full mx-auto object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-1">
                    <div className="w-2 h-2 bg-background rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground text-sm">{operator.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="text-xs font-medium">{operator.rating}</span>
                  </div>
                </div>
                
                <p className="text-accent font-medium mb-1 text-sm">{operator.specialty}</p>
                <p className="text-xs text-muted-foreground">{operator.achievement}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedOperators;
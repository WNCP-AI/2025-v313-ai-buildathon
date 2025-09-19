import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import foodDeliveryImg from "@/assets/food-delivery.jpg";
import courierServiceImg from "@/assets/courier-service.jpg";
import aerialImagingImg from "@/assets/aerial-imaging.jpg";

const categories = [
  {
    icon: "🍔",
    title: "Food Delivery",
    description: "Fast & reliable",
    price: "From $4.99",
    image: foodDeliveryImg,
    category: "food_delivery",
  },
  {
    icon: "📦",
    title: "Courier Service",
    description: "Same-day delivery",
    price: "From $7.99",
    image: courierServiceImg,
    category: "courier_parcel",
  },
  {
    icon: "📸",
    title: "Aerial Imaging",
    description: "Professional shots",
    price: "From $149/hr",
    image: aerialImagingImg,
    category: "aerial_imaging",
  },
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/browse?category=${category}`);
  };

  const handleViewAll = () => {
    navigate("/browse");
  };

  return (
    <section id="services" className="py-20 px-5 lg:px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-foreground">Popular Categories</h2>
          <Button variant="link" className="text-accent" onClick={handleViewAll}>
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="group hover:shadow-hover transition-all duration-200 hover:scale-[1.02] border border-divider">
              <CardContent className="p-0">
                <div className="aspect-video rounded-t-lg overflow-hidden bg-muted">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-xl font-semibold text-foreground">{category.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-2 text-sm">{category.description}</p>
                  <p className="text-base font-semibold text-accent mb-4">{category.price}</p>
                  
                  <Button 
                    variant="browse" 
                    className="w-full"
                    onClick={() => handleCategoryClick(category.category)}
                  >
                    Browse <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
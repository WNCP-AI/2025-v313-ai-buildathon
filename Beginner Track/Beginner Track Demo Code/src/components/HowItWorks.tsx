import { Search, Users, CreditCard, MapPin } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "1",
    title: "Search",
    description: "Find services in your area",
  },
  {
    icon: Users,
    number: "2", 
    title: "Compare",
    description: "View providers and prices",
  },
  {
    icon: CreditCard,
    number: "3",
    title: "Book",
    description: "Secure payment and scheduling",
  },
  {
    icon: MapPin,
    number: "4",
    title: "Track",
    description: "Real-time updates",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 px-5 lg:px-6 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started with SkyMarket is simple. Follow these easy steps to connect with professional drone operators.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-divider transform -translate-y-1/2 z-0" />
                )}
                
                {/* Icon circle */}
                <div className="relative z-10 w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center shadow-card group-hover:scale-105 transition-transform duration-200">
                  <step.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                
                {/* Step number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-background rounded-full flex items-center justify-center shadow-card border border-divider z-20">
                  <span className="text-xs font-medium text-accent">{step.number}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
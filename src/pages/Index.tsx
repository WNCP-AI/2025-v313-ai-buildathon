import SharedHeader from "@/components/SharedHeader";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import HowItWorks from "@/components/HowItWorks";
import FeaturedOperators from "@/components/FeaturedOperators";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />
      <Hero />
      <Categories />
      <HowItWorks />
      <FeaturedOperators />
    </div>
  );
};

export default Index;

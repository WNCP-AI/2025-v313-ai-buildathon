import { useAuth } from "@/contexts/SimpleAuthContext";
import SharedHeader from "@/components/SharedHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Universal layout for all users
  return (
    <div className="min-h-screen bg-background">
      <SharedHeader />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
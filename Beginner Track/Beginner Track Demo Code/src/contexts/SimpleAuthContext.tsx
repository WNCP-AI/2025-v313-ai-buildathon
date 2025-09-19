import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getUserRole: () => "consumer" | "operator" | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserRole = (): "consumer" | "operator" | null => {
    if (!user?.user_metadata) return null;
    return user.user_metadata.role || "consumer";
  };

  const signOut = async () => {
    // Clear remember me preference when signing out
    localStorage.removeItem('supabase_remember_me');
    await supabase.auth.signOut();
  };

  useEffect(() => {
    // Set up auth state listener (no loading toggles here to avoid flicker)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Initialize from existing session once, then clear loading
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
      })
      .finally(() => setLoading(false));

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signOut,
      getUserRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
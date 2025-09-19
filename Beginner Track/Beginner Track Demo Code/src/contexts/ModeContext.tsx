import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type ViewMode = "consumer" | "operator";

interface ModeContextType {
  currentMode: ViewMode;
  switchMode: (mode: ViewMode) => void;
  isTransitioning: boolean;
  targetMode: ViewMode | null;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
};

export const ModeProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentMode, setCurrentMode] = useState<ViewMode>(() => {
    // Load saved mode from localStorage or default to consumer
    const saved = localStorage.getItem("sky-market-view-mode");
    return (saved as ViewMode) || "consumer";
  });
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetMode, setTargetMode] = useState<ViewMode | null>(null);

  const switchMode = (mode: ViewMode) => {
    if (mode === currentMode || isTransitioning) return;
    
    setIsTransitioning(true);
    setTargetMode(mode);
    
    // Show transition for 1 second
    setTimeout(() => {
      setCurrentMode(mode);
      localStorage.setItem("sky-market-view-mode", mode);
      
      // Navigate based on mode and current location
      if (mode === "consumer") {
        if (location.pathname.includes("/operator-dashboard")) {
          navigate("/browse");
        }
      } else {
        if (location.pathname === "/browse" || location.pathname === "/") {
          navigate("/operator-dashboard");
        }
      }
      
      setIsTransitioning(false);
      setTargetMode(null);
    }, 1000);
  };

  useEffect(() => {
    // Save mode changes to localStorage
    localStorage.setItem("sky-market-view-mode", currentMode);
  }, [currentMode]);

  return (
    <ModeContext.Provider value={{ currentMode, switchMode, isTransitioning, targetMode }}>
      {children}
    </ModeContext.Provider>
  );
};
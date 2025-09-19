import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { User, Plane } from "lucide-react";

interface AirbnbToggleProps {
  isOperatorMode: boolean;
  onToggle: (isOperator: boolean) => void;
  className?: string;
}

const AirbnbToggle = React.forwardRef<HTMLDivElement, AirbnbToggleProps>(
  ({ isOperatorMode, onToggle, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center rounded-full p-1 cursor-pointer transition-all duration-300",
          isOperatorMode 
            ? "bg-gradient-to-r from-blue-500/20 to-sky-500/20 hover:from-blue-500/30 hover:to-sky-500/30" 
            : "bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30",
          className
        )}
        onClick={() => onToggle(!isOperatorMode)}
      >
        {/* Background sliding indicator */}
        <motion.div
          className={cn(
            "absolute top-1 bottom-1 rounded-full shadow-lg border",
            isOperatorMode 
              ? "bg-gradient-to-r from-blue-500 to-sky-500 border-blue-400/50" 
              : "bg-gradient-to-r from-green-500 to-emerald-500 border-green-400/50"
          )}
          animate={{
            left: "4px",
            right: "4px",
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
        />
        
        {/* Content */}
        <motion.div
          className="relative z-10 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white"
          animate={{
            scale: 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <motion.div
            key={isOperatorMode ? "operator" : "consumer"}
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOperatorMode ? (
              <Plane className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </motion.div>
          <motion.span
            key={isOperatorMode ? "operator-text" : "consumer-text"}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOperatorMode ? "Operator" : "Consumer"}
          </motion.span>
        </motion.div>
      </div>
    );
  }
);

AirbnbToggle.displayName = "AirbnbToggle";

export { AirbnbToggle };
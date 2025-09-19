import { motion } from "motion/react";
import { Plane } from "lucide-react";

interface ModeTransitionProps {
  targetMode: "consumer" | "operator";
}

const ModeTransition = ({ targetMode }: ModeTransitionProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-6">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Plane className="h-12 w-12 text-accent" />
        </motion.div>
        
        <div className="text-center space-y-2">
          <motion.h2
            className="text-xl font-semibold text-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Switching to {targetMode} mode...
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {targetMode === "consumer" 
              ? "Getting ready to browse services" 
              : "Preparing your operator dashboard"
            }
          </motion.p>
        </div>

        <motion.div
          className="w-48 h-1 bg-muted rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModeTransition;
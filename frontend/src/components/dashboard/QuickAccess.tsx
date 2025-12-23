import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface QuickAccessProps {
  isConnected: boolean;
}

const QuickAccess = ({ isConnected }: QuickAccessProps) => {

  if (!isConnected) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex justify-center"
    >
      <Button
        onClick={() => {/* Already on dashboard */}}
        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        disabled
      >
        <BarChart3 className="w-5 h-5 mr-2" />
        Data Analysis
        <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">Current Page</span>
      </Button>
    </motion.div>
  );
};

export default QuickAccess;

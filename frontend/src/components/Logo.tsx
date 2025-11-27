import { Lock } from "lucide-react";

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary shadow-lg">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div className="absolute inset-0 bg-pink-300/20 blur-xl rounded-full" />
      </div>
      <span className="text-2xl font-bold text-gray-900">
        HealLock
      </span>
    </div>
  );
};

export default Logo;


import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Plus, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Confetti from 'react-confetti';
import { useState, useEffect } from "react";

interface TodayOverviewProps {
  entryCount?: number;
  averageMood?: number;
  streakDays?: number;
  isConnected: boolean;
}

const TodayOverview = ({ entryCount = 0, averageMood = 0, streakDays = 0, isConnected }: TodayOverviewProps) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  useEffect(() => {
    if (streakDays >= 7 && entryCount > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [streakDays, entryCount]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getMotivationalMessage = () => {
    if (streakDays >= 7) return "🎉 You've recorded for 7 days in a row!";
    if (streakDays >= 3) return "🌟 Recording streak in progress!";
    if (entryCount > 0) return "💪 Great job! Keep it up!";
    return "🌱 Let's protect mental health together";
  };

  const quickActions = [
    {
      label: "Log Today",
      icon: Plus,
      color: "bg-green-500 hover:bg-green-600",
      action: () => navigate('/log')
    },
    {
      label: "View Records",
      icon: Eye,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => navigate('/view')
    }
  ];

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-pink-200 bg-gradient-card backdrop-blur-xl shadow-xl shadow-pink-100/50 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full">
                <span className="text-white text-lg">👋</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                {getGreeting()}! Welcome to HealLock
              </h3>
              <p className="text-gray-600">
                Please connect your wallet to view health data overview
              </p>
              <div className="flex justify-center gap-3 mt-4">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    onClick={action.action}
                    disabled={!isConnected}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                  >
                    <action.icon className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          colors={['#ec4899', '#8b5cf6', '#06b6d4', '#10b981']}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-pink-200 bg-gradient-card backdrop-blur-xl shadow-xl shadow-pink-100/50 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* 左侧：欢迎信息和核心指标 */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-primary rounded-full">
                    <span className="text-white text-sm">🎯</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {getGreeting()}！{getMotivationalMessage()}
                  </h3>
                </div>

                {/* 核心指标 */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{entryCount}</div>
                    <div className="text-xs text-blue-700 font-medium">Total Records</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{averageMood.toFixed(1)}</div>
                    <div className="text-xs text-green-700 font-medium">Avg Mood</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{streakDays}</div>
                    <div className="text-xs text-purple-700 font-medium">Streak Days</div>
                  </div>
                </div>

                {/* 健康状态指示器 */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    averageMood >= 80 ? 'bg-green-500' :
                    averageMood >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {averageMood >= 80 ? 'Health status good' :
                     averageMood >= 60 ? 'Health status fair' : 'Needs more attention'}
                  </span>
                </div>
              </div>

              {/* 右侧：快速操作 */}
              <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      onClick={action.action}
                      className={`w-full px-6 py-3 font-medium transition-all duration-200 ${action.color} text-white shadow-lg hover:shadow-xl hover:scale-105`}
                    >
                      <action.icon className="w-5 h-5 mr-2" />
                      {action.label}
                    </Button>
                  </motion.div>
                ))}

                {/* 成就徽章 */}
                {streakDays >= 7 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="flex items-center justify-center p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg"
                  >
                    <Trophy className="w-5 h-5 text-white mr-2" />
                    <span className="text-white font-bold text-sm">7-Day Achievement!</span>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default TodayOverview;

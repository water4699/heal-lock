import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import TodayOverview from "@/components/dashboard/TodayOverview";
import MoodTrendChart from "@/components/dashboard/MoodTrendChart";
import QuickAccess from "@/components/dashboard/QuickAccess";
import { useMentalHealthDiary } from "@/hooks/useMentalHealthDiary";

const Dashboard = () => {
  const { isConnected, address } = useAccount();
  const { entryCount } = useMentalHealthDiary();

  // Calculate real statistics from user data
  const stats = useMemo(() => {
    if (!address || !isConnected) {
      return {
        entryCount: 0,
        averageMood: 0,
        streakDays: 0
      };
    }

    try {
      // Get all user entries from localStorage
      const entries: Array<{mentalState: number, stress: number, timestamp: number}> = [];
      let streakCount = 0;
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      // Check streak (consecutive days with entries)
      for (let i = 0; i < 30; i++) { // Check last 30 days for streak
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);

        const dateKey = Math.floor(checkDate.getTime() / (1000 * 60 * 60 * 24));
        const storageKey = `mental_health_entry_${address}_${dateKey}`;

        const entryData = localStorage.getItem(storageKey);
        if (entryData) {
          const parsed = JSON.parse(entryData);
          entries.push({
            mentalState: parsed.mentalState || 0,
            stress: parsed.stress || 0,
            timestamp: parsed.timestamp || checkDate.getTime()
          });

          if (i === 0) streakCount++; // Today has entry
          else if (i === streakCount) streakCount++; // Consecutive day
        } else if (i === streakCount) {
          break; // Streak broken
        }
      }

      // Calculate average mood from all entries
      const avgMood = entries.length > 0
        ? entries.reduce((sum, entry) => sum + entry.mentalState, 0) / entries.length
        : 0;

      return {
        entryCount: entries.length,
        averageMood: Math.round(avgMood * 10) / 10,
        streakDays: streakCount
      };
    } catch (error) {
      console.error('Error calculating stats:', error);
      return {
        entryCount: entryCount || 0,
        averageMood: 0,
        streakDays: 0
      };
    }
  }, [address, isConnected, entryCount]);

  // Background particle effects
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    // Generate background particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-pink-100/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div
          className="absolute top-60 -left-40 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-40 right-1/4 w-96 h-96 bg-pink-50/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.2, 0.15]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        ></motion.div>

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 bg-pink-300/40 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 3 + particle.delay,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-24 md:pb-16 relative z-10 mobile-bottom-spacing">
        <div className="container mx-auto px-4 space-y-6">
          {/* Compact Hero Section */}
          <motion.section
            className="text-center space-y-4 max-w-3xl mx-auto py-4 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-block p-3 bg-gradient-primary rounded-xl shadow-lg">
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                HealLock
              </h1>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 relative z-20">
              Your Health Data Center
            </h2>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              View mental health data overview and trend analysis
            </p>
          </motion.section>

          {/* Today Overview - Comprehensive Card */}
          <TodayOverview
            entryCount={isConnected ? stats.entryCount : 0}
            averageMood={isConnected ? stats.averageMood : 0}
            streakDays={isConnected ? stats.streakDays : 0}
            isConnected={isConnected}
          />

          {/* Mood Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <MoodTrendChart isConnected={isConnected} />
          </motion.div>

          {/* Quick Access to Analytics */}
          <QuickAccess isConnected={isConnected} />

          {/* Enhanced Stats Summary */}
          {isConnected && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-blue-50 rounded-2xl p-6 border border-pink-100 shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="p-1 bg-gradient-primary rounded-lg">
                    <span className="text-white text-sm">💡</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Data Insights</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  You have recorded for <span className="font-bold text-purple-600">{stats.streakDays} days</span>,
                  with an average mood score of <span className="font-bold text-pink-600">{stats.averageMood.toFixed(1)}</span>.
                  {stats.streakDays >= 7 && " 🎉 You are a recording champion!"}
                  {stats.averageMood >= 80 && " 🌟 Your mental health is excellent!"}
                  {(stats.streakDays < 7 && stats.averageMood < 80) && " Keep recording, your health data will become more valuable!"}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

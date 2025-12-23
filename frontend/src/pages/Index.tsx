import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Logo from "@/components/Logo";
import WalletConnect from "@/components/WalletConnect";
import DiaryLogger from "@/components/DiaryLogger";
import DiaryViewer from "@/components/DiaryViewer";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import QuickActions from "@/components/dashboard/QuickActions";
import HealthOverview from "@/components/dashboard/HealthOverview";
import MoodTrendChart from "@/components/dashboard/MoodTrendChart";

const Index = () => {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'log' | 'view'>('log');
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0.95, 0.98]);

  // 模拟数据 - 在实际应用中会从合约和localStorage获取
  const mockStats = {
    entryCount: 7,
    averageMood: 79.7,
    streakDays: 7
  };

  // 添加一些粒子效果的数据
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    // 生成背景粒子
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Enhanced decorative background elements with animations */}
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
        <motion.div
          className="absolute top-1/4 left-1/3 w-64 h-64 bg-blue-100/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        ></motion.div>

        {/* Floating particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-pink-300/30 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 0.6, 0]
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

      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-pink-100/50 shadow-sm"
        style={{ opacity: headerOpacity }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <WalletConnect />
          </div>
        </div>
      </motion.header>

      <main className="pt-20 pb-16 relative z-10">
        {/* 第一屏：核心价值与快速操作 */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center space-y-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Logo and Title */}
              <div className="inline-block p-4 sm:p-6 bg-gradient-primary rounded-3xl mb-6 shadow-2xl shadow-pink-500/25">
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white drop-shadow-lg">
                  HealLock
                </h1>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent px-4">
                加密心理健康日记
              </h2>

              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed px-4">
                使用完全同态加密技术，安全、私密地追踪您的心理健康数据
              </p>

              <div className="flex items-center justify-center gap-3 text-sm text-gray-500 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                <span className="font-medium">您的所有数据都经过加密保护</span>
              </div>
            </motion.div>

            {/* Quick Actions - Centered and Prominent */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <QuickActions
                onLogEntry={() => {
                  setActiveTab('log');
                  scrollToSection('diary-logger');
                }}
                onViewEntries={() => {
                  setActiveTab('view');
                  scrollToSection('diary-viewer');
                }}
                onViewAnalytics={() => scrollToSection('health-overview')}
                isConnected={isConnected}
              />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-6 h-10 border-2 border-pink-300 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-pink-300 rounded-full mt-2 animate-pulse"></div>
            </div>
          </motion.div>
        </section>

        {/* Section Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 py-2 bg-white text-gray-500 rounded-full border border-gray-200 shadow-sm">
              📊
            </span>
          </div>
        </div>

        {/* 第二屏：数据概览 */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50/50">
          <div className="container mx-auto px-4 space-y-12">
            {/* Section Header */}
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full mb-4">
                <span className="text-white text-lg">📊</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                您的健康数据概览
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
                通过数据洞察了解您的心理健康趋势，发现改善的机会
              </p>
            </motion.div>

            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <WelcomeCard
                entryCount={isConnected ? mockStats.entryCount : 0}
                streakDays={isConnected ? mockStats.streakDays : 0}
                isConnected={isConnected}
              />
            </motion.div>

            {/* Health Overview */}
            <motion.div
              id="health-overview"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <HealthOverview
                entryCount={isConnected ? mockStats.entryCount : 0}
                averageMood={isConnected ? mockStats.averageMood : 0}
                streakDays={isConnected ? mockStats.streakDays : 0}
                isConnected={isConnected}
              />
            </motion.div>

            {/* Mood Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <MoodTrendChart isConnected={isConnected} />
            </motion.div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 py-2 bg-gray-50 text-gray-500 rounded-full border border-gray-200 shadow-sm">
              ⚙️
            </span>
          </div>
        </div>

        {/* 第三屏：详细操作 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 space-y-12">
            {/* Section Header */}
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full mb-4">
                <span className="text-white text-lg">⚙️</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                详细操作
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto px-4">
                记录您的每日心理健康数据，或查看历史记录和分析结果
              </p>
            </motion.div>

            {/* Operation Tabs */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row bg-gray-100 rounded-xl p-1 shadow-sm w-full max-w-md sm:w-auto">
                <button
                  onClick={() => {
                    setActiveTab('log');
                    scrollToSection('diary-logger');
                  }}
                  className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    activeTab === 'log'
                      ? 'bg-white text-pink-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  📝 记录数据
                </button>
                <button
                  onClick={() => {
                    setActiveTab('view');
                    scrollToSection('diary-viewer');
                  }}
                  className={`px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                    activeTab === 'view'
                      ? 'bg-white text-pink-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  👁️ 查看记录
                </button>
              </div>
            </motion.div>

            {/* Forms */}
            <motion.div
              id="diary-logger"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <DiaryLogger />
            </motion.div>

            <motion.div
              id="diary-viewer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <DiaryViewer />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;


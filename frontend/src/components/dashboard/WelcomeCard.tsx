import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Shield, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from 'react-confetti';
import { useState, useEffect } from "react";

interface WelcomeCardProps {
  entryCount?: number;
  streakDays?: number;
  isConnected: boolean;
}

const WelcomeCard = ({ entryCount = 0, streakDays = 0, isConnected }: WelcomeCardProps) => {
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
    // 当有记录时显示庆祝效果
    if (entryCount > 0 && streakDays > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [entryCount, streakDays]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "早上好";
    if (hour < 18) return "下午好";
    return "晚上好";
  };

  const getMotivationalMessage = () => {
    if (streakDays >= 7) return "🎉 您已经连续记录7天了！保持这个好习惯！";
    if (streakDays >= 3) return "🌟 连续记录进行中！您正在建立良好的习惯！";
    if (entryCount > 0) return "💪 太棒了！开始记录您的心理健康数据吧！";
    return "🌱 欢迎来到 HealLock！让我们一起守护您的心理健康。";
  };

  const features = [
    { icon: Shield, text: "端到端加密", color: "text-blue-600" },
    { icon: Heart, text: "隐私保护", color: "text-pink-600" },
    { icon: TrendingUp, text: "数据分析", color: "text-purple-600" },
    { icon: Sparkles, text: "智能洞察", color: "text-green-600" }
  ];

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 backdrop-blur-xl shadow-xl shadow-pink-100/50 rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>

          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block p-4 bg-gradient-primary rounded-2xl shadow-lg"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-3"
              >
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  欢迎使用 HealLock
                </h2>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  您的隐私心理健康伴侣，基于区块链的全加密数据保护
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-2 gap-4 max-w-md mx-auto"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2 p-3 bg-white/60 rounded-lg"
                  >
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-white/60 rounded-xl p-4 max-w-sm mx-auto"
              >
                <div className="flex items-center justify-center gap-2 text-yellow-600">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">请先连接您的钱包</span>
                </div>
              </motion.div>
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-pink-200 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 backdrop-blur-xl shadow-xl shadow-pink-100/50 rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>

          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block p-4 bg-gradient-primary rounded-2xl shadow-lg"
              >
                {streakDays >= 7 ? (
                  <Sparkles className="w-8 h-8 text-white" />
                ) : streakDays >= 3 ? (
                  <Heart className="w-8 h-8 text-white" />
                ) : (
                  <Shield className="w-8 h-8 text-white" />
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-3"
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  {getGreeting()}！🎉
                </h2>
                <p className="text-lg text-gray-600">
                  {getMotivationalMessage()}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center gap-6"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">{entryCount}</div>
                  <div className="text-sm text-gray-600">总记录</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{streakDays}</div>
                  <div className="text-sm text-gray-600">连续天数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">🔒</div>
                  <div className="text-sm text-gray-600">数据安全</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white/60 rounded-xl p-4 max-w-lg mx-auto"
              >
                <p className="text-sm text-gray-700">
                  💡 <strong>小贴士：</strong>
                  {streakDays >= 7
                    ? "您已经建立了很好的记录习惯！继续保持，让数据为您提供更有价值的洞察。"
                    : "每天记录一次，7天后您就能看到清晰的趋势分析。坚持就是胜利！"
                  }
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default WelcomeCard;

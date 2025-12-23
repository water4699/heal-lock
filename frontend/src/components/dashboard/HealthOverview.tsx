import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, TrendingUp, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface HealthOverviewProps {
  entryCount?: number;
  averageMood?: number;
  streakDays?: number;
  isConnected: boolean;
}

const HealthOverview = ({ entryCount = 0, averageMood = 0, streakDays = 0, isConnected }: HealthOverviewProps) => {
  const stats = [
    {
      title: "总记录数",
      value: entryCount,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "平均情绪",
      value: averageMood.toFixed(1),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "连续记录",
      value: `${streakDays}天`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "健康状态",
      value: averageMood >= 70 ? "良好" : averageMood >= 50 ? "一般" : "需关注",
      icon: Trophy,
      color: averageMood >= 70 ? "text-emerald-600" : averageMood >= 50 ? "text-yellow-600" : "text-red-600",
      bgColor: averageMood >= 70 ? "bg-emerald-50" : averageMood >= 50 ? "bg-yellow-50" : "bg-red-50",
      borderColor: averageMood >= 70 ? "border-emerald-200" : averageMood >= 50 ? "border-yellow-200" : "border-red-200"
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
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              健康概览
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              连接钱包后查看您的心理健康统计数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>请先连接您的钱包</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-pink-200 bg-gradient-card backdrop-blur-xl shadow-xl shadow-pink-100/50 rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
        <CardHeader className="pb-6 pt-8">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            健康概览
          </CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            您的心理健康数据统计和趋势分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-xl border-2 ${stat.bgColor} ${stat.borderColor} hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-1">{stat.title}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${stat.color.replace('text-', 'bg-')}`}
                    style={{
                      width: stat.title === "平均情绪"
                        ? `${Math.min(averageMood, 100)}%`
                        : stat.title === "连续记录"
                        ? `${Math.min(streakDays * 10, 100)}%`
                        : "100%"
                    }}
                  ></div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HealthOverview;

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, BarChart3, Settings, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionsProps {
  onLogEntry: () => void;
  onViewEntries: () => void;
  onViewAnalytics: () => void;
  isConnected: boolean;
}

const QuickActions = ({ onLogEntry, onViewEntries, onViewAnalytics, isConnected }: QuickActionsProps) => {
  const actions = [
    {
      title: "记录今日",
      description: "添加今天的心理健康数据",
      icon: Plus,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      action: onLogEntry,
      disabled: !isConnected
    },
    {
      title: "查看记录",
      description: "浏览和解密历史记录",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      action: onViewEntries,
      disabled: !isConnected
    },
    {
      title: "数据分析",
      description: "查看趋势和统计分析",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      action: onViewAnalytics,
      disabled: !isConnected
    }
  ];

  const secondaryActions = [
    {
      title: "设置",
      icon: Settings,
      action: () => console.log("Settings")
    },
    {
      title: "帮助",
      icon: HelpCircle,
      action: () => console.log("Help")
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-pink-200 bg-gradient-card backdrop-blur-xl shadow-xl shadow-pink-100/50 rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
        <CardHeader className="pb-6 pt-8">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-md">
              <Plus className="w-5 h-5 text-white" />
            </div>
            快速操作
          </CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            常用功能一键访问
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 主要操作 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {actions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  onClick={action.action}
                  disabled={action.disabled}
                  className={`
                    w-full h-auto p-6 flex flex-col items-center gap-3
                    ${action.disabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100'
                      : `bg-gradient-to-br ${action.bgColor} ${action.borderColor} border-2 hover:shadow-lg hover:scale-105`
                    }
                    transition-all duration-300 rounded-xl
                  `}
                  variant="outline"
                >
                  <div className={`p-3 rounded-lg ${action.disabled ? 'bg-gray-200' : action.bgColor} ${action.color}`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <div className={`font-semibold text-sm ${action.disabled ? 'text-gray-400' : 'text-gray-800'}`}>
                      {action.title}
                    </div>
                    <div className={`text-xs mt-1 ${action.disabled ? 'text-gray-400' : 'text-gray-600'}`}>
                      {action.description}
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* 次要操作 */}
          <div className="flex justify-center gap-4 pt-4 border-t border-gray-100">
            {secondaryActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
              >
                <action.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{action.title}</span>
              </motion.button>
            ))}
          </div>

          {/* 状态提示 */}
          {!isConnected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">请先连接钱包</p>
                  <p className="text-xs text-yellow-600 mt-1">连接钱包后即可使用所有功能</p>
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickActions;

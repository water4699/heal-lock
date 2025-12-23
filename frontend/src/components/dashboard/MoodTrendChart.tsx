import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useMemo } from "react";

interface MoodTrendChartProps {
  isConnected: boolean;
}

interface MoodEntry {
  date: string;
  mood: number;
  stress: number;
  timestamp: number;
}

const MoodTrendChart = ({ isConnected }: MoodTrendChartProps) => {
  const { address } = useAccount();

  // Get real historical data from localStorage
  const chartData = useMemo(() => {
    if (!address || !isConnected) {
      // Return empty data when not connected
      return [];
    }

    try {
      const storedData: MoodEntry[] = [];
      const today = new Date();

      // Get data for the past 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const storageKey = `mental_health_entry_${address}_${Math.floor(date.getTime() / (1000 * 60 * 60 * 24))}`;

        const entryData = localStorage.getItem(storageKey);
        if (entryData) {
          const parsed = JSON.parse(entryData);
          storedData.push({
            date: dateKey.split('-').slice(1).join('-'), // MM-DD format for display
            mood: parsed.mentalState || 0,
            stress: parsed.stress || 0,
            timestamp: parsed.timestamp || date.getTime()
          });
        } else {
          // Add empty data point for dates with no records
          storedData.push({
            date: dateKey.split('-').slice(1).join('-'),
            mood: 0, // Use 0 instead of null for recharts compatibility
            stress: 0, // Use 0 instead of null for recharts compatibility
            timestamp: date.getTime()
          });
        }
      }

      return storedData;
    } catch (error) {
      console.error('Error loading chart data:', error);
      return [];
    }
  }, [address, isConnected]);

  // Calculate insights from real data
  const insights = useMemo(() => {
    if (chartData.length === 0) return null;

    const validData = chartData.filter(d => d.mood !== null && d.stress !== null);
    if (validData.length === 0) return null;

    const avgMood = validData.reduce((sum, d) => sum + d.mood, 0) / validData.length;
    const avgStress = validData.reduce((sum, d) => sum + d.stress, 0) / validData.length;

    // Calculate trend (simple: compare first half vs second half)
    const midPoint = Math.floor(validData.length / 2);
    const firstHalfMood = validData.slice(0, midPoint).reduce((sum, d) => sum + d.mood, 0) / midPoint;
    const secondHalfMood = validData.slice(midPoint).reduce((sum, d) => sum + d.mood, 0) / (validData.length - midPoint);
    const moodTrend = secondHalfMood > firstHalfMood ? 'upward' : secondHalfMood < firstHalfMood ? 'downward' : 'stable';

    return {
      avgMood: Math.round(avgMood * 10) / 10,
      avgStress: Math.round(avgStress * 10) / 10,
      moodTrend,
      recordCount: validData.length
    };
  }, [chartData]);
  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-pink-200 bg-gradient-card backdrop-blur-xl shadow-xl shadow-pink-100/50 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-md">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              Mood Trend Chart
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Visualize your mood changes over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">Connect wallet to view data</p>
              <p className="text-sm">Your mood data will be displayed here as charts</p>
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-pink-200 bg-gradient-card backdrop-blur-xl shadow-xl shadow-pink-100/50 rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
        <CardHeader className="pb-6 pt-8">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-md">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            Mood Trend Chart
          </CardTitle>
          <CardDescription className="text-base text-gray-600 mt-2">
            Your mental health data trend analysis for the past 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                  formatter={(value: number, name: string) => {
                    return [`${value}/100`, name === 'mood' ? 'Mood Score' : 'Stress Level'];
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={(props) => {
                    const { payload } = props;
                    if (payload.mood === null) return <circle />;
                    return <circle fill="#ec4899" strokeWidth={2} r={6} />;
                  }}
                  activeDot={{ r: 8, stroke: '#ec4899', strokeWidth: 2, fill: '#fff' }}
                  connectNulls={false}
                  name="mood"
                />
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={(props) => {
                    const { payload } = props;
                    if (payload.stress === null) return <circle />;
                    return <circle fill="#8b5cf6" strokeWidth={2} r={6} />;
                  }}
                  activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
                  connectNulls={false}
                  name="stress"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 图例 */}
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-pink-500"></div>
              <span className="text-sm font-medium text-gray-700">Mood Score</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-sm font-medium text-gray-700">Stress Level</span>
            </div>
          </div>

          {/* Data Insights */}
          {insights && (
            <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-pink-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Data Insights</h4>
                  <p className="text-sm text-gray-600">
                    {insights.recordCount === 0 ? (
                      "Start recording your mental health data to see insights here."
                    ) : (
                      <>
                        Your mood score shows a{insights.moodTrend === 'upward' ? 'n upward' : insights.moodTrend === 'downward' ? ' downward' : ' stable'} trend with an average of {insights.avgMood}.
                        {insights.avgStress < 30 ? " Stress levels are well managed!" :
                         insights.avgStress < 60 ? " Moderate stress levels detected." :
                         " High stress levels - consider stress management techniques."}
                        {insights.recordCount >= 3 && " Keep up the consistent recording!"}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MoodTrendChart;

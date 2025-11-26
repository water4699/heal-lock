import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Lock, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useMentalHealthDiary } from "@/hooks/useMentalHealthDiary";

const DiaryLogger = () => {
  const { toast } = useToast();
  const { isConnected, address } = useAccount();
  const { addEntry, isLoading, message, entryCount } = useMentalHealthDiary();
  const [connectedAddress, setConnectedAddress] = useState<string>("");

  useEffect(() => {
    if (address) {
      setConnectedAddress(address);
    }
  }, [address]);
  
  const [mentalStateScore, setMentalStateScore] = useState<number[]>([50]);
  const [stressLevel, setStressLevel] = useState<number[]>([30]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const handleLogEntry = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to log your mental health entry.",
        variant: "destructive",
      });
      return;
    }

    // Validate mental state score range
    if (mentalStateScore[0] < 0 || mentalStateScore[0] > 100) {
      toast({
        title: "Invalid Mental State Score",
        description: "Mental state score must be between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    // Validate stress level range
    if (stressLevel[0] < 0 || stressLevel[0] > 100) {
      toast({
        title: "Invalid Stress Level",
        description: "Stress level must be between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert date to day number (days since epoch)
      const dateObj = new Date(selectedDate);
      const epochDate = new Date(1970, 0, 1);
      const daysSinceEpoch = Math.floor((dateObj.getTime() - epochDate.getTime()) / (1000 * 60 * 60 * 24));

      // Validate date is not in the future
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      if (dateObj > today) {
        toast({
          title: "Invalid Date",
          description: "Cannot log entries for future dates.",
          variant: "destructive",
        });
        return;
      }

      await addEntry(daysSinceEpoch, mentalStateScore[0], stressLevel[0]);
      
      toast({
        title: "Entry Logged Successfully! 🎉",
        description: `Your mental health data has been encrypted and recorded on the blockchain.`,
      });
      
      // Reset form
      setMentalStateScore([50]);
      setStressLevel([30]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <Card className="border-pink-200 bg-gradient-card backdrop-blur-xl shadow-xl shadow-pink-100/50 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary"></div>
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-md">
                <Lock className="w-6 h-6 text-white" />
              </div>
              Log Mental Health Entry
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Securely encrypt and record your daily mental health metrics with blockchain proof
              {entryCount !== undefined && entryCount > 0 && (
                <div className="mt-2 text-sm font-medium text-pink-600">
                  📊 Total entries logged: {entryCount}
                </div>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <span className="text-gray-600">Mental State Score:</span>
                <span className="text-primary font-bold text-lg">{mentalStateScore[0]}/100</span>
              </label>
              <Slider
                value={mentalStateScore}
                onValueChange={setMentalStateScore}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Rate your overall mental state from 0 (very poor) to 100 (excellent)
              </p>
            </div>

            <div className="space-y-4 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Stress Level:</span>
                <span className="text-primary font-bold text-lg">{stressLevel[0]}/100</span>
              </label>
              <Slider
                value={stressLevel}
                onValueChange={setStressLevel}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Rate your stress level from 0 (no stress) to 100 (extreme stress)
              </p>
            </div>

            {message && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700">{message}</p>
              </div>
            )}

            <Button
              onClick={handleLogEntry}
              disabled={isLoading || !isConnected}
              className="w-full gap-2 bg-gradient-primary hover:opacity-90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 rounded-xl font-semibold text-lg py-6"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Encrypting & Logging...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {isConnected ? "Log Entry" : "Connect Wallet First"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DiaryLogger;


              className="w-full gap-2 bg-gradient-primary hover:opacity-90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 rounded-xl font-semibold text-lg py-6"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Encrypting & Logging...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {isConnected ? "Log Entry" : "Connect Wallet First"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DiaryLogger;


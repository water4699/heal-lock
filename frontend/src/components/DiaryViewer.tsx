import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Eye, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useMentalHealthDiary } from "@/hooks/useMentalHealthDiary";

const DiaryViewer = () => {
  const { toast } = useToast();
  const { isConnected, address } = useAccount();
  const { decryptEntry, entryCount, isLoading, message } = useMentalHealthDiary();
  const [connectedAddress, setConnectedAddress] = useState<string>("");

  useEffect(() => {
    if (address) {
      setConnectedAddress(address);
    }
  }, [address]);
  
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [debugInfo, setDebugInfo] = useState<string>("");
  const [decryptedData, setDecryptedData] = useState<{
    mentalState: number;
    stress: number;
  } | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const handleDecrypt = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to decrypt your entries.",
        variant: "destructive",
      });
      return;
    }

    // Contract address validation is now handled by useMentalHealthDiary hook

    try {
      setIsDecrypting(true);

      // Convert date to day number
      const dateObj = new Date(selectedDate);
      const epochDate = new Date(1970, 0, 1);
      const daysSinceEpoch = Math.floor((dateObj.getTime() - epochDate.getTime()) / (1000 * 60 * 60 * 24));

      console.log(`🔍 Attempting to decrypt entry for date: ${selectedDate} (days since epoch: ${daysSinceEpoch})`);
      // Contract address is now managed by useMentalHealthDiary hook
      console.log(`👤 Wallet address: ${connectedAddress}`);

      // Set debug info
      setDebugInfo(`Date: ${selectedDate}, Days: ${daysSinceEpoch}, Wallet: ${connectedAddress}`);

      const result = await decryptEntry(daysSinceEpoch);

      if (result) {
        setDecryptedData(result);
        setDebugInfo("");
        toast({
          title: "Decryption Successful! 🔓",
          description: "Your encrypted mental health data has been decrypted.",
        });
      } else {
        toast({
          title: "No Entry Found",
          description: "No entry exists for the selected date.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Decryption Failed",
        description: error.message || "Failed to decrypt entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDecrypting(false);
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
                <Eye className="w-6 h-6 text-white" />
              </div>
              View & Decrypt Entries
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Decrypt and view your encrypted mental health entries. Only you can decrypt your data.
            </CardDescription>
            {connectedAddress && (
              <div className="mt-2 text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                Connected: {connectedAddress}
              </div>
            )}
            {entryCount !== undefined && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                <span className="text-sm font-semibold text-gray-700">Total Entries: </span>
                <span className="text-lg font-bold text-primary">{entryCount}</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Select Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setDecryptedData(null);
                }}
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            {message && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700">{message}</p>
              </div>
            )}

            {debugInfo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-xs text-yellow-700 font-mono">{debugInfo}</p>
              </div>
            )}

            <Button
              onClick={handleDecrypt}
              disabled={isDecrypting || !isConnected || isLoading}
              className="w-full gap-2 bg-gradient-primary hover:opacity-90 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 rounded-xl font-semibold text-lg py-6"
              size="lg"
            >
              {isDecrypting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Decrypting...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {isConnected ? "Decrypt Entry" : "Connect Wallet First"}
                </>
              )}
            </Button>

            {decryptedData && (
              <div className="mt-6 space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl border-2 border-gray-200 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Decrypted Data</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white/90 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <span className="text-lg">😊</span>
                      </div>
                      <span className="font-semibold text-gray-700">Mental State Score</span>
                    </div>
                    <span className="text-3xl font-bold text-gray-800">{decryptedData.mentalState}/100</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/90 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                      </div>
                      <span className="font-semibold text-gray-700">Stress Level</span>
                    </div>
                    <span className="text-3xl font-bold text-orange-600">{decryptedData.stress}/100</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    This data was encrypted on-chain and can only be decrypted by you.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DiaryViewer;


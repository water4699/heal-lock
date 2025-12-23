import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Eye, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import { useMentalHealthDiary } from "@/hooks/useMentalHealthDiary";
import { motion } from "framer-motion";

const DiaryViewer = () => {
  const { toast } = useToast();
  const { isConnected, address } = useAccount();
  const { decryptEntry, entryCount, isLoading, message, setMessage } = useMentalHealthDiary();
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

    try {
      setIsDecrypting(true);
      setDecryptedData(null); // Clear previous data
      setMessage(""); // Clear previous messages

      // Convert date to day number
      const dateObj = new Date(selectedDate);
      const epochDate = new Date(1970, 0, 1);
      const daysSinceEpoch = Math.floor((dateObj.getTime() - epochDate.getTime()) / (1000 * 60 * 60 * 24));

      console.log(`🔍 Attempting to decrypt entry for date: ${selectedDate} (days since epoch: ${daysSinceEpoch})`);
      console.log(`👤 Wallet address: ${connectedAddress}`);

      // Set debug info
      setDebugInfo(`Date: ${selectedDate}, Days: ${daysSinceEpoch}, Wallet: ${connectedAddress}`);

      const result = await decryptEntry(daysSinceEpoch);

      if (result) {
        console.log("✅ Decryption result:", result);
        setDecryptedData(result);
        setDebugInfo("");
        setMessage("Decryption successful!");
        toast({
          title: "Decryption Successful! 🔓",
          description: "Your encrypted mental health data has been decrypted.",
        });
      } else {
        console.log("❌ No entry found for selected date");
        setDecryptedData(null);
        toast({
          title: "No Entry Found",
          description: "No entry exists for the selected date.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("❌ Decryption error:", error);
      setDecryptedData(null);
      const errorMessage = error?.message || error?.toString() || "Unknown error occurred";
      setMessage(`Decryption failed: ${errorMessage}`);
      toast({
        title: "Decryption Failed",
        description: errorMessage,
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
              View and Decrypt Records
            </CardTitle>
            <CardDescription className="text-base text-gray-600 mt-2">
              Decrypt and view your encrypted mental health records. Only you can decrypt your own data.
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
          <CardContent className="space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
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
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary/20 rounded-xl text-base"
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
              className="w-full gap-3 bg-gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 rounded-xl font-semibold text-base sm:text-lg py-4 sm:py-6 hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
            >
              {isDecrypting ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Decrypting...</span>
                  <span className="sm:hidden">Decrypting...</span>
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  <span className="hidden sm:inline">
                    {isConnected ? "Decrypt and View Records" : "Connect Wallet First"}
                  </span>
                  <span className="sm:hidden">
                    {isConnected ? "Decrypt" : "Connect"}
                  </span>
                </>
              )}
            </Button>

            {decryptedData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 space-y-4 p-4 sm:p-6 bg-gradient-to-br from-green-50/50 to-blue-50/50 rounded-2xl border-2 border-green-200/50 shadow-lg"
              >
                {/* Error boundary for decrypted data rendering */}
                {(() => {
                  try {
                    return (
                      <>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl shadow-lg">
                            <Eye className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Decryption Successful 🎉</h3>
                            <p className="text-sm text-gray-600">Your encrypted data has been securely decrypted</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Mental State Score */}
                          <div className="p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl border border-pink-200 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-100 rounded-lg">
                                  <span className="text-xl">😊</span>
                                </div>
                                <span className="font-semibold text-gray-700 text-sm sm:text-base">Mood Status</span>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl sm:text-3xl font-bold text-pink-600">{decryptedData.mentalState}</span>
                                <span className="text-sm text-gray-500">/100</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${decryptedData.mentalState}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                              {decryptedData.mentalState >= 80 ? "Good 👍" :
                               decryptedData.mentalState >= 60 ? "Fair 😐" :
                               decryptedData.mentalState >= 40 ? "Needs Attention ⚠️" : "Needs Help 🤗"}
                            </p>
                          </div>

                          {/* Stress Level */}
                          <div className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                  <AlertCircle className="w-5 h-5 text-purple-500" />
                                </div>
                                <span className="font-semibold text-gray-700 text-sm sm:text-base">Stress Level</span>
                              </div>
                              <div className="text-right">
                                <span className="text-2xl sm:text-3xl font-bold text-purple-600">{decryptedData.stress}</span>
                                <span className="text-sm text-gray-500">/100</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${decryptedData.stress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-600 mt-2">
                              {decryptedData.stress <= 20 ? "Very Low 😌" :
                               decryptedData.stress <= 40 ? "Mild 🙂" :
                               decryptedData.stress <= 60 ? "Moderate 😰" : "High ⚠️"}
                            </p>
                          </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-blue-800 mb-1">Data Security Guarantee</p>
                              <p className="text-xs text-blue-700">
                                This data is encrypted and stored on the blockchain. Only you can decrypt and view it using your private key.
                                Your private data is protected by Fully Homomorphic Encryption technology.
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  } catch (renderError) {
                    console.error("Error rendering decrypted data:", renderError);
                    return (
                      <div className="text-center py-8">
                        <div className="text-red-500 mb-4">❌ Error displaying decrypted data</div>
                        <div className="text-sm text-gray-600 bg-red-50 p-4 rounded-lg">
                          There was an error displaying your decrypted data. Please try again or contact support.
                          <br />
                          <code className="text-xs mt-2 block">
                            Error: {renderError instanceof Error ? renderError.message : "Unknown rendering error"}
                          </code>
                        </div>
                      </div>
                    );
                  }
                })()}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DiaryViewer;


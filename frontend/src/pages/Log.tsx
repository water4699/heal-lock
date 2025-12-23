import { motion } from "framer-motion";
import { Plus, Lock, Shield } from "lucide-react";
import DiaryLogger from "@/components/DiaryLogger";

const Log = () => {
  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-64 h-64 bg-green-100/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        <motion.div
          className="absolute bottom-20 -right-20 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-24 md:pb-16 relative z-10 mobile-bottom-spacing">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.section
            className="text-center space-y-6 max-w-4xl mx-auto py-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4 shadow-lg">
              <Plus className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Log Data</span>
            </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Record Your Mental Health Data
              </h1>

              <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
                Securely record your mental health status today, all data will be encrypted
              </p>

            {/* Security badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-green-200">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-blue-200">
                <Lock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Privacy Protection</span>
              </div>
            </div>
          </motion.section>

          {/* Logger Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <DiaryLogger />
          </motion.div>

          {/* Tips Section */}
          <motion.section
            className="mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-1 bg-green-100 rounded-lg">
                  💡
                </div>
                Logging Tips
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Record Honestly</h4>
                      <p className="text-sm text-gray-600">Record your feelings honestly, this will help you better understand your mental health status.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Record Regularly</h4>
                      <p className="text-sm text-gray-600">It is recommended to record at the same time every day to establish better data comparison.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Data Security</h4>
                      <p className="text-sm text-gray-600">All data is encrypted and only you can decrypt and view it. Blockchain ensures data immutability.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Trend Analysis</h4>
                      <p className="text-sm text-gray-600">After regular recording, you can view mood trends and health insights on the dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default Log;

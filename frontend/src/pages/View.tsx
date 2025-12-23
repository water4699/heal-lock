import { motion } from "framer-motion";
import { Eye, Search, Calendar, BarChart3 } from "lucide-react";
import DiaryViewer from "@/components/DiaryViewer";

const View = () => {
  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -right-20 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 -left-20 w-80 h-80 bg-pink-100/20 rounded-full blur-3xl"
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
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <Eye className="w-5 h-5 text-white" />
              <span className="text-white font-medium">View Records</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              View and Decrypt Your Records
            </h1>

            <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto">
              Securely decrypt and view your previously recorded mental health data
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-purple-200">
                <Search className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Search by Date</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-pink-200">
                <BarChart3 className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-medium text-pink-700">Data Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-blue-200">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">History</span>
              </div>
            </div>
          </motion.section>

          {/* Viewer Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <DiaryViewer />
          </motion.div>

          {/* Help Section */}
          <motion.section
            className="mt-12 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-1 bg-purple-100 rounded-lg">
                  ❓
                </div>
                Frequently Asked Questions
              </h3>

              <div className="space-y-4">
                <div className="bg-white/60 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Why can't I see data?</h4>
                  <p className="text-sm text-gray-600">
                    This might be because you haven't recorded any data yet, or the selected date has no records. Please add data on the "Log" page first.
                  </p>
                </div>

                <div className="bg-white/60 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">What to do if decryption fails?</h4>
                  <p className="text-sm text-gray-600">
                    This usually happens in Mock environments. Please re-record your data and try decrypting again. This won't occur in production environments.
                  </p>
                </div>

                <div className="bg-white/60 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Is the data secure?</h4>
                  <p className="text-sm text-gray-600">
                    Absolutely secure! All data is encrypted with FHE and only you can decrypt and view it. Blockchain ensures data immutability.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default View;

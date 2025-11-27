import Logo from "@/components/Logo";
import WalletConnect from "@/components/WalletConnect";
import DiaryLogger from "@/components/DiaryLogger";
import DiaryViewer from "@/components/DiaryViewer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-40 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-pink-50/15 rounded-full blur-3xl"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <WalletConnect />
        </div>
      </header>
      
      <main className="pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 space-y-12">
          <section className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-block p-4 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
              <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
                HealLock
              </h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Encrypted Mental Health Diary
            </h2>
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              Privately track your mental health with fully homomorphic encryption
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Your data is encrypted and secure</span>
            </div>
          </section>

          <DiaryLogger />
          <DiaryViewer />
        </div>
      </main>
    </div>
  );
};

export default Index;


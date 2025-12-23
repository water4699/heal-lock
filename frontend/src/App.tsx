import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from './lib/wagmi';
import Navigation from "./components/layout/Navigation";
import Dashboard from "./pages/Dashboard";
import Log from "./pages/Log";
import View from "./pages/View";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider locale="en" theme={lightTheme({
        accentColor: '#ec4899',
        accentColorForeground: 'white',
        borderRadius: 'large',
        overlayBlur: 'small',
      })}>
        <Toaster />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<Log />} />
            <Route path="/view" element={<View />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;


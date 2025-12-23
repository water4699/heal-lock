import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Plus, Eye } from 'lucide-react';
import Logo from '@/components/Logo';
import WalletConnect from '@/components/WalletConnect';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: Home,
      description: 'Data Overview'
    },
    {
      path: '/log',
      label: 'Log',
      icon: Plus,
      description: 'Log Data'
    },
    {
      path: '/view',
      label: 'View',
      icon: Eye,
      description: 'View Records'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-pink-100/50 shadow-sm"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                {/* Content with proper z-index */}
                <div className={`relative z-10 flex items-center gap-2 ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}>
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                {/* Hover background */}
                {!isActive(item.path) && (
                  <div className="absolute inset-0 bg-gray-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200" />
                )}

                {/* Active indicator */}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-primary rounded-lg shadow-md"
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Wallet Connect */}
          <WalletConnect />

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative p-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title={item.description}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'scale-110' : ''} transition-transform`} />

                {/* Active indicator for mobile top nav */}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-primary rounded-lg shadow-md"
                    layoutId="activeMobileTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation for better UX */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-pink-100/50 shadow-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive(item.path)
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'scale-110' : ''} transition-transform`} />
              <span className={`text-xs font-medium ${isActive(item.path) ? 'text-pink-600' : 'text-gray-600'}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;

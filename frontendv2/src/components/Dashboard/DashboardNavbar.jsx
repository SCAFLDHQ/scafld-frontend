import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Settings, LogOut, User, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

export default function DashboardNavbar({ searchQuery = '', onSearchChange }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4 sm:gap-6">
          {/* Left: Logo & Mobile Menu */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Mobile Menu Button */}
            <button
              className="sm:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-[#29142e] flex items-center justify-center rounded-lg">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="tracking-tight text-white font-bold hidden sm:inline">SCAFLD</span>
            </a>
          </div>

          {/* Center: Search - Hidden on mobile */}
          <div className="flex-1 max-w-2xl hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Search projects, templates, or commands..."
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] transition-colors text-sm rounded-lg"
              />
            </div>
          </div>

          {/* Right: Navigation + Profile */}
          <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-6">
              <Link to="/marketplace" className="text-white/60 hover:text-white transition-colors text-sm">
                Marketplace
              </Link>
              <Link to="/pricing" className="text-white/60 hover:text-white transition-colors text-sm">
                Pricing
              </Link>
              <Link to="/templates" className="text-white/60 hover:text-white transition-colors text-sm">
                Templates
              </Link>
              <Link to="/tools" className="text-white/60 hover:text-white transition-colors text-sm">
                Tools
              </Link>
            </div>

            {/* Notifications */}
            <button className="relative text-white/60 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#29142e] rounded-full"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-[#29142e] flex items-center justify-center rounded-lg">
                  <User className="w-4 h-4 text-white" />
                </div>
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-lg z-50"
                  >
                    <div className="p-3 border-b border-white/10">
                      <div className="text-white text-sm">
                        {userProfile?.first_name && userProfile?.last_name 
                          ? `${userProfile.first_name} ${userProfile.last_name}`
                          : userProfile?.username || user?.username || 'User'
                        }
                      </div>
                      <div className="text-white/40 text-xs">{userProfile?.email || user?.email}</div>
                      <div className="text-white/60 text-xs mt-1">
                        {['pro','max'].includes(userProfile?.tier) ? 'Unlimited' : `${userProfile?.credits ?? 0} credits`} • {userProfile?.subscription_tier?.name || userProfile?.tier || 'Free'}
                      </div>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm rounded"
                      >
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-white/10">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors text-sm w-full rounded"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Search - Visible only on mobile */}
        <div className="mt-4 sm:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search projects, templates, or commands..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#29142e] transition-colors text-sm rounded-lg"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden mt-4 overflow-hidden"
            >
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
                <Link to="/marketplace" className="block text-white/60 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Marketplace
                </Link>
                <Link to="/pricing" className="block text-white/60 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Pricing
                </Link>
                <Link to="/templates" className="block text-white/60 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Templates
                </Link>
                <Link to="/tools" className="block text-white/60 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  Tools
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
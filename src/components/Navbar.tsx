import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  Sun, 
  Moon, 
  ShieldAlert, 
  UserCheck, 
  Car, 
  Shield, 
  ChevronDown, 
  Sparkles,
  Presentation,
  PlayCircle
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC<{ onOpenSos: () => void; onOpenPayment: () => void }> = ({ onOpenSos, onOpenPayment }) => {
  const {
    currentUser,
    users,
    setCurrentUserById,
    isDarkMode,
    toggleDarkMode,
    setIsDemoDrawerOpen,
    setIsPitchDeckOpen,
    sosAlerts
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const activeSosCount = sosAlerts.filter(a => a.status === 'active').length;

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    student: { label: 'Student', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
    staff: { label: 'Faculty / Staff', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
    driver: { label: 'Cart Driver', icon: <Car className="w-3.5 h-3.5" />, color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
    admin: { label: 'Transport Admin', icon: <Shield className="w-3.5 h-3.5" />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-charcoal-700/80 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-campus-600 via-violet-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-campus-600/25 ring-2 ring-white/10">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-campus-600 to-violet-500 dark:from-campus-400 dark:to-indigo-300 bg-clip-text text-transparent font-['Plus_Jakarta_Sans']">
                CampusCart
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-campus-500/10 text-campus-600 dark:text-campus-300 border border-campus-500/20">
                GreenTech
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 -mt-0.5 hidden sm:block">
              GreenTech University E-Cart Fleet
            </p>
          </div>
        </div>

        {/* Quick Actions & Demo Triggers */}
        <div className="flex items-center gap-2">
          {/* Demo Walkthrough Script Button */}
          <button
            onClick={() => setIsDemoDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-campus-600/10 hover:bg-campus-600/20 text-campus-700 dark:text-campus-300 border border-campus-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Open 3-Minute Hackathon Demo Guide"
          >
            <PlayCircle className="w-3.5 h-3.5 text-campus-500 animate-pulse" />
            <span className="hidden md:inline">Demo Script</span>
          </button>

          {/* Pitch Deck Button */}
          <button
            onClick={() => setIsPitchDeckOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-charcoal-800 dark:hover:bg-charcoal-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-charcoal-700 transition-all hover:scale-[1.02]"
            title="View Hackathon Pitch Deck & Business Model"
          >
            <Presentation className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden lg:inline">Pitch Deck</span>
          </button>

          {/* SOS Dispatch Trigger */}
          <button
            onClick={onOpenSos}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeSosCount > 0
                ? 'bg-red-600 text-white animate-bounce shadow-lg shadow-red-600/40'
                : 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
            }`}
            title="Emergency Transport Dispatch"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SOS</span>
            {activeSosCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-red-600 text-[10px] font-black">
                {activeSosCount}
              </span>
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-charcoal-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Active User Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-2xl border border-gray-200 dark:border-charcoal-700 bg-gray-50 dark:bg-charcoal-800 hover:bg-gray-100 dark:hover:bg-charcoal-700/80 transition-all text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-xl object-cover ring-1 ring-campus-500/30"
              />
              <div className="hidden sm:block text-left pr-1">
                <div className="text-xs font-bold leading-tight truncate max-w-[110px] text-gray-800 dark:text-gray-200">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl border border-gray-200 dark:border-charcoal-700 bg-white dark:bg-charcoal-850 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-gray-100 dark:border-charcoal-700/80 mb-1">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Switch Role & Persona
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Test multi-role realtime coordination:
                    </p>
                  </div>

                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    {users.map(u => {
                      const isSelected = u.id === currentUser.id;
                      const roleConfig = roleLabels[u.role];
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            setCurrentUserById(u.id);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-campus-600/15 text-campus-700 dark:text-campus-300 font-bold border border-campus-500/30'
                              : 'hover:bg-gray-100 dark:hover:bg-charcoal-750 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                            <div className="truncate">
                              <p className="font-semibold truncate">{u.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{u.department}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border capitalize flex items-center gap-1 ${roleConfig.color}`}>
                            {roleConfig.icon}
                            {u.role}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-charcoal-700/80 flex items-center justify-between px-2">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenPayment();
                      }}
                      className="text-xs font-semibold text-campus-600 dark:text-campus-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Recharge / Pass Plans
                    </button>
                    <span className="text-[10px] text-gray-400 font-mono">
                      GTU v2.4
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


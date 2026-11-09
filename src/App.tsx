import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { PitchDeckModal } from './components/PitchDeckModal';
import { DemoGuideModal } from './components/DemoGuideModal';
import { SosModal } from './components/SosModal';
import { PaymentModal } from './components/PaymentModal';
import { OnboardingTour } from './components/OnboardingTour';
import { RiderView } from './views/RiderView';
import { DriverView } from './views/DriverView';
import { AdminView } from './views/AdminView';
import { LandingView } from './views/LandingView';
import { UserCheck, Car, Shield, LayoutGrid, SplitSquareVertical } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentRole, setRole, setCurrentUserById } = useApp();
  const [activeTab, setActiveTab] = useState<'current_role' | 'landing' | 'split'>('current_role');
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-charcoal-900 dark:text-gray-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenSos={() => setIsSosOpen(true)}
        onOpenPayment={() => setIsPaymentOpen(true)}
      />

      {/* Role & Mode Switcher Bar */}
      <div className="border-b border-gray-200 dark:border-charcoal-800 bg-white dark:bg-charcoal-850 px-4 py-2 sticky top-16 z-30 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto text-xs">
          {/* Left: View Tabs */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setActiveTab('current_role');
                if (currentRole === 'driver' || currentRole === 'admin') setRole('student');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'current_role' && (currentRole === 'student' || currentRole === 'staff')
                  ? 'bg-campus-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-charcoal-750'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Rider App</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('current_role');
                setRole('driver');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'current_role' && currentRole === 'driver'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-charcoal-750'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Driver Console</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('current_role');
                setRole('admin');
              }}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'current_role' && currentRole === 'admin'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-charcoal-750'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Transport Admin</span>
            </button>
          </div>

          {/* Right: Presentation Modes */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'split'
                  ? 'bg-gradient-to-r from-campus-600 to-indigo-600 text-white shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-charcoal-750'
              }`}
              title="View Rider and Driver side-by-side for live hackathon demo!"
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split Screen Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('landing')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'landing'
                  ? 'bg-gray-900 dark:bg-charcoal-700 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-charcoal-750'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Campus Overview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'landing' ? (
          <LandingView
            onSelectRole={(role, userId) => {
              setRole(role);
              if (userId) setCurrentUserById(userId);
              setActiveTab('current_role');
            }}
          />
        ) : activeTab === 'split' ? (
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-campus-500/10 border border-campus-500/20 text-xs text-campus-600 dark:text-campus-300 flex items-center justify-between">
              <span>
                💡 <strong>Live Hackathon Demo Mode:</strong> Rider and Driver apps running simultaneously. Request on the left to watch the driver receive and advance stages on the right in real time!
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="p-4 rounded-3xl bg-white dark:bg-charcoal-850 border border-gray-200 dark:border-charcoal-750 shadow-xl">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-charcoal-700">
                  <span className="font-bold text-xs uppercase tracking-wider text-campus-500 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" /> Rider App (Student Screen)
                  </span>
                </div>
                <RiderView onOpenPayment={() => setIsPaymentOpen(true)} />
              </div>

              <div className="p-4 rounded-3xl bg-white dark:bg-charcoal-850 border border-gray-200 dark:border-charcoal-750 shadow-xl">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-charcoal-700">
                  <span className="font-bold text-xs uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <Car className="w-4 h-4" /> Driver App (Rajesh - Cart #01)
                  </span>
                </div>
                <DriverView onOpenSos={() => setIsSosOpen(true)} />
              </div>
            </div>
          </div>
        ) : (
          <>
            {(currentRole === 'student' || currentRole === 'staff') && (
              <RiderView onOpenPayment={() => setIsPaymentOpen(true)} />
            )}
            {currentRole === 'driver' && (
              <DriverView onOpenSos={() => setIsSosOpen(true)} />
            )}
            {currentRole === 'admin' && (
              <AdminView />
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
      />
      <PitchDeckModal />
      <DemoGuideModal />
      <OnboardingTour />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;

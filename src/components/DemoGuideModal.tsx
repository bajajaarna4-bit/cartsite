import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Play, 
  ShieldAlert, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  Radio, 
  Smartphone,
  Sparkles
} from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const { 
    isDemoDrawerOpen, 
    setIsDemoDrawerOpen, 
    setCurrentUserById, 
    users, 
    resetDemoData, 
    simulateIncomingRequest,
    addToast
  } = useApp();

  if (!isDemoDrawerOpen) return null;

  const runScenario1 = () => {
    // Unverified Student Block Demo
    const unverifiedUser = users.find(u => u.collegeId === 'GTU-2025-ME019');
    if (unverifiedUser) {
      setCurrentUserById(unverifiedUser.id);
      addToast('Step 1 Active', `Switched to ${unverifiedUser.name}. Try clicking 'Request E-Cart Ride' to see instant gate blocking!`, 'warning');
      setIsDemoDrawerOpen(false);
    }
  };

  const runScenario2 = () => {
    // Admin verification
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
      setCurrentUserById(adminUser.id);
      addToast('Step 2 Active', `Switched to Admin. Look at 'Pending Verification Queue' to approve Vikram Singh with 1 click!`, 'success');
      setIsDemoDrawerOpen(false);
    }
  };

  const runScenario3 = () => {
    // Verified Student with active pass
    const verifiedUser = users.find(u => u.id === 'user-stu-1');
    if (verifiedUser) {
      setCurrentUserById(verifiedUser.id);
      addToast('Step 3 Active', `Switched to ${verifiedUser.name}. Choose pickup/drop to request a real-time e-cart!`, 'info');
      setIsDemoDrawerOpen(false);
    }
  };

  const runScenario4 = () => {
    // Driver view
    const driverUser = users.find(u => u.role === 'driver');
    if (driverUser) {
      setCurrentUserById(driverUser.id);
      simulateIncomingRequest();
      addToast('Step 4 Active', `Switched to Driver (${driverUser.name}). An incoming ride request has been broadcasted!`, 'success');
      setIsDemoDrawerOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-charcoal-900 border border-charcoal-700 p-6 shadow-2xl text-gray-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-campus-600/20 text-campus-400 flex items-center justify-center border border-campus-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-['Plus_Jakarta_Sans'] text-white">
                3-Minute Hackathon Demo Script
              </h3>
              <p className="text-xs text-gray-400">
                Show judges the real-time student-to-driver coordination handoff
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoDrawerOpen(false)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Script Steps */}
        <div className="py-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Minute 0:00 - 0:45: The Verification Gate
              </span>
              <button
                onClick={runScenario1}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-[11px] flex items-center gap-1 transition-all"
              >
                <Play className="w-3 h-3 fill-current" /> Run Step 1
              </button>
            </div>
            <p className="text-gray-300 leading-relaxed">
              <strong>Say to judges:</strong> "Unlike standard ride-hailing apps, campus transit is closed-loop and secure. Here, fresher Vikram Singh tries booking a ride, but gets immediately blocked because his college ID is pending admin verification."
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-campus-400 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> Minute 0:45 - 1:30: Transport Admin Desk
              </span>
              <button
                onClick={runScenario2}
                className="px-2.5 py-1 rounded-lg bg-campus-500/20 hover:bg-campus-500/30 text-campus-300 font-semibold text-[11px] flex items-center gap-1 transition-all"
              >
                <Play className="w-3 h-3 fill-current" /> Run Step 2
              </button>
            </div>
            <p className="text-gray-300 leading-relaxed">
              <strong>Say to judges:</strong> "Now switch to Transport Admin. You see the pending verification queue. We approve Vikram's ID, or grant a 14-day temporary medical pass for an injured student. Notice the auto-expiry tracking."
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" /> Minute 1:30 - 2:15: Live Rider Booking
              </span>
              <button
                onClick={runScenario3}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-[11px] flex items-center gap-1 transition-all"
              >
                <Play className="w-3 h-3 fill-current" /> Run Step 3
              </button>
            </div>
            <p className="text-gray-300 leading-relaxed">
              <strong>Say to judges:</strong> "Logged in as Aarav (who holds an active knee-injury pass), he requests a pickup from Hostel Block A to the Engineering Lab. Fare is waived by medical policy, and request broadcasts immediately."
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-2xl bg-charcoal-800/80 border border-charcoal-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" /> Minute 2:15 - 3:00: Driver Realtime Handoff
              </span>
              <button
                onClick={runScenario4}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-semibold text-[11px] flex items-center gap-1 transition-all"
              >
                <Play className="w-3 h-3 fill-current" /> Run Step 4
              </button>
            </div>
            <p className="text-gray-300 leading-relaxed">
              <strong>Say to judges:</strong> "Driver Rajesh receives the request chime, clicks 'Accept' → 'Arrived' → 'Start Trip' → 'End Trip'. On trip completion, the rider gets a celebratory confetti moment and driver earnings update in real time!"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-charcoal-800 flex items-center justify-between">
          <button
            onClick={resetDemoData}
            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Database</span>
          </button>
          <span className="text-[11px] text-campus-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Multi-tab sync ready
          </span>
        </div>
      </div>
    </div>
  );
};

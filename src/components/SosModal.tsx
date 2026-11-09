import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldAlert, PhoneCall, AlertTriangle, Send } from 'lucide-react';

export const SosModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { campusLocations, triggerSos, currentUser } = useApp();
  const [selectedLocation, setSelectedLocation] = useState(campusLocations[0]?.name || 'Main Campus Gate');
  const [reason, setReason] = useState('Medical assistance / Injury requiring immediate cart dispatch');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSos(reason, selectedLocation);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-charcoal-900 border-2 border-red-500/50 p-6 shadow-2xl text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
          <div className="flex items-center gap-2.5 text-red-500">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold font-['Plus_Jakarta_Sans'] text-white">
                Emergency SOS Dispatch
              </h3>
              <p className="text-[11px] text-red-400 font-semibold">
                Direct Priority Alert to Campus Transport & Security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-charcoal-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">SOS Beacon Broadcasting!</h4>
            <p className="text-xs text-gray-300 max-w-xs mx-auto">
              Security Patrol & Nearest Electric Cart have been prioritized for {selectedLocation}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            <div className="p-3 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>Use only for genuine urgent transit emergencies, late-night safety hazards, or accidents on campus grounds.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Your Current Campus Location:
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-charcoal-800 border border-charcoal-700 text-xs text-gray-100 focus:outline-none focus:border-red-500"
              >
                {campusLocations.map(loc => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name} ({loc.description})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Nature of Emergency:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-charcoal-800 border border-charcoal-700 text-xs text-gray-100 focus:outline-none focus:border-red-500"
              >
                <option value="Medical assistance / Injury requiring immediate cart dispatch">
                  Medical assistance / Sudden injury requiring cart
                </option>
                <option value="Late-Night Safety Escort (Suspicious activity / Dark route)">
                  Late-Night Safety Escort (Suspicious activity / Dark pathway)
                </option>
                <option value="Cart Breakdown / Flat tire blocking road">
                  Cart Breakdown / Technical failure blocking transit
                </option>
                <option value="Physical Accessibility barrier (Stranded wheelchair/crutches)">
                  Physical Accessibility barrier (Stranded without mobility)
                </option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-charcoal-800 border border-charcoal-700 text-[11px] text-gray-400 flex items-center justify-between">
              <div>
                <span className="text-gray-300 font-semibold block">{currentUser.name} ({currentUser.collegeId})</span>
                <span>Phone: {currentUser.phone}</span>
              </div>
              <a
                href="tel:1800-GTU-SOS"
                className="flex items-center gap-1 text-red-400 font-bold hover:underline"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Direct Call
              </a>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-700 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
              >
                <Send className="w-3.5 h-3.5" /> Trigger SOS Now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};


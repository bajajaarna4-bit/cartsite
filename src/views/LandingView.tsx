import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Zap, 
  ShieldCheck, 
  Car, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Presentation,
  PlayCircle
} from 'lucide-react';

export const LandingView: React.FC<{ onSelectRole: (role: 'student' | 'driver' | 'admin', userId?: string) => void }> = ({ onSelectRole }) => {
  const { campusLocations, drivers, setIsDemoDrawerOpen, setIsPitchDeckOpen } = useApp();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative text-center py-10 md:py-16 px-4 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-campus-500/10 border border-campus-500/20 text-campus-400 text-xs font-bold uppercase tracking-wider animate-pulse-subtle">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>GreenTech University Smart Mobility Mesh</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-[1.1]">
          Campus e-cart transit, <br />
          <span className="bg-gradient-to-r from-campus-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
            coordinated in real time.
          </span>
        </h1>

        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Zero-emission electric carts connecting 6,000+ students, faculty, and support staff across 320 acres. One-time verified access, medical exemptions, and sub-second driver dispatch.
        </p>

        {/* CTA Pills for instant demo access */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onSelectRole('student', 'user-stu-1')}
            className="px-5 py-3 rounded-2xl bg-campus-600 hover:bg-campus-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-campus-600/30 transition-all hover:scale-[1.03]"
          >
            <span>Enter as Student (Aarav)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectRole('driver', 'user-drv-1')}
            className="px-5 py-3 rounded-2xl bg-charcoal-800 hover:bg-charcoal-750 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center gap-2 transition-all hover:scale-[1.03]"
          >
            <Car className="w-4 h-4" />
            <span>Enter as Driver (Rajesh - Cart #01)</span>
          </button>

          <button
            onClick={() => onSelectRole('admin', 'user-adm-1')}
            className="px-5 py-3 rounded-2xl bg-charcoal-800 hover:bg-charcoal-750 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-2 transition-all hover:scale-[1.03]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Transport Admin Desk</span>
          </button>
        </div>

        {/* Hackathon presenter tools */}
        <div className="flex items-center justify-center gap-4 text-xs pt-4 text-gray-400">
          <button
            onClick={() => setIsDemoDrawerOpen(true)}
            className="hover:text-campus-300 flex items-center gap-1 font-semibold underline underline-offset-4"
          >
            <PlayCircle className="w-3.5 h-3.5 text-campus-400" />
            Open 3-Min Demo Script
          </button>
          <span>•</span>
          <button
            onClick={() => setIsPitchDeckOpen(true)}
            className="hover:text-campus-300 flex items-center gap-1 font-semibold underline underline-offset-4"
          >
            <Presentation className="w-3.5 h-3.5 text-violet-400" />
            Launch Hackathon Pitch Deck
          </button>
        </div>
      </section>

      {/* Interactive Campus Map & Live Fleet Telematics */}
      <section className="p-6 md:p-8 rounded-3xl bg-charcoal-900 border border-charcoal-750 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans']">
                Live Campus Mesh Telematics
              </h3>
            </div>
            <p className="text-xs text-gray-400">
              Interactive node map of GreenTech University with 8 designated transit hubs
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <Car className="w-3.5 h-3.5" /> 3 Carts In Service
            </span>
            <span className="text-gray-500">|</span>
            <span className="flex items-center gap-1 text-campus-300 font-bold">
              <Clock className="w-3.5 h-3.5" /> Average Wait: 2.8 mins
            </span>
          </div>
        </div>

        {/* Visual Map Canvas */}
        <div className="relative w-full h-80 rounded-2xl bg-charcoal-950 border border-charcoal-800 overflow-hidden p-4">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

          {/* Render Campus Nodes */}
          {campusLocations.map(loc => (
            <div
              key={loc.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${loc.coordinates.x}%`, top: `${loc.coordinates.y}%` }}
            >
              <div className="relative flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-campus-600/30 text-campus-300 border border-campus-500 flex items-center justify-center text-xs font-bold shadow-lg group-hover:scale-125 transition-transform">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="absolute top-8 whitespace-nowrap px-2 py-0.5 rounded-md bg-charcoal-850/90 border border-charcoal-700 text-[10px] font-bold text-gray-200 pointer-events-none shadow">
                  {loc.name.split(' ')[0]}
                </div>
              </div>
            </div>
          ))}

          {/* Active Carts Moving on Grid */}
          {drivers.filter(d => d.status === 'online').map((d, i) => (
            <div
              key={d.id}
              className="absolute animate-bounce-subtle flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500 text-charcoal-950 text-[10px] font-black shadow-xl"
              style={{ left: `${20 + i * 28}%`, top: `${45 + (i % 2) * 15}%` }}
            >
              <Car className="w-3 h-3 fill-current" />
              <span>Cart {i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-charcoal-850 border border-charcoal-750 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-campus-500/20 text-campus-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
            Protected Campus Gate
          </h4>
          <p className="text-gray-400 leading-relaxed">
            Only enrolled college IDs can book rides. Unverified freshers are blocked until approved by the Transport Office.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-charcoal-850 border border-charcoal-750 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
            Medical & Exam Exceptions
          </h4>
          <p className="text-gray-400 leading-relaxed">
            Students with temporary injuries, accessibility needs, or night-shift lab access receive auto-expiring 100% free passes.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-charcoal-850 border border-charcoal-750 space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
            Real-Time Broadcast Dispatch
          </h4>
          <p className="text-gray-400 leading-relaxed">
            Sub-second synchronization across tabs and phones without lag. Drivers receive incoming alerts and update stages instantly.
          </p>
        </div>
      </section>

      {/* Local Campus Sponsors (Phase 6 Business Model) */}
      <section className="p-6 rounded-3xl bg-charcoal-850/60 border border-charcoal-750 text-center space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
          Campus Business Partners & Co-Sponsors
        </span>
        <div className="flex flex-wrap items-center justify-center gap-6 text-gray-400 text-xs font-semibold">
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            ☕ GreenTech Central Canteen (10% off with Cart Pass)
          </span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            📚 University Book & Stationery Quad
          </span>
          <span className="flex items-center gap-1.5 hover:text-white transition-colors">
            ⚡ CleanGrid Solar Charging Stations
          </span>
        </div>
      </section>
    </div>
  );
};

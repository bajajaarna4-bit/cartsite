import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Target, 
  Rocket, 
  CheckCircle,
  Award
} from 'lucide-react';

export const PitchDeckModal: React.FC = () => {
  const { isPitchDeckOpen, setIsPitchDeckOpen } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isPitchDeckOpen) return null;

  const slides = [
    {
      title: 'The Problem',
      subtitle: 'Campus Transit Friction & Safety Blindspots',
      icon: <Target className="w-8 h-8 text-rose-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            Large university campuses sprawl across 200–800 acres. Students, injured peers, and late-night researchers face severe transit bottlenecks:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-charcoal-800/80 border border-charcoal-700">
              <span className="text-2xl font-bold text-rose-400">22 Mins</span>
              <h5 className="font-semibold text-xs mt-1 text-gray-200">Average Walking Delay</h5>
              <p className="text-[11px] text-gray-400 mt-1">Hostel to lab transit wastes productive academic hours every day.</p>
            </div>
            <div className="p-4 rounded-2xl bg-charcoal-800/80 border border-charcoal-700">
              <span className="text-2xl font-bold text-amber-400">0%</span>
              <h5 className="font-semibold text-xs mt-1 text-gray-200">Visibility of Carts</h5>
              <p className="text-[11px] text-gray-400 mt-1">Carts idle at main gates while disabled students wait stranded across campus.</p>
            </div>
            <div className="p-4 rounded-2xl bg-charcoal-800/80 border border-charcoal-700">
              <span className="text-2xl font-bold text-rose-400">Night Safety</span>
              <h5 className="font-semibold text-xs mt-1 text-gray-200">Unmonitored Transit</h5>
              <p className="text-[11px] text-gray-400 mt-1">No emergency SOS, no verification, and no coordination with campus security.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'The Solution: CampusCart',
      subtitle: 'Real-Time Campus E-Cart Coordination Platform',
      icon: <Sparkles className="w-8 h-8 text-campus-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            A purpose-built mobility OS connecting verified students, drivers, and transport administrators into one synchronized real-time mesh.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-charcoal-800/60 border border-charcoal-700 space-y-1.5">
              <div className="flex items-center gap-2 text-campus-300 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-campus-400" /> Real-Time Driver Handoff
              </div>
              <p className="text-[11px] text-gray-400">Sub-second ride request dispatch with instant driver accept & stage tracking.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-charcoal-800/60 border border-charcoal-700 space-y-1.5">
              <div className="flex items-center gap-2 text-campus-300 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-campus-400" /> Verified Access Control
              </div>
              <p className="text-[11px] text-gray-400">One-time transport office verification blocks trespassers and prioritizes medical/exam passes.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-charcoal-800/60 border border-charcoal-700 space-y-1.5">
              <div className="flex items-center gap-2 text-campus-300 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-campus-400" /> Integrated Micro-Fares
              </div>
              <p className="text-[11px] text-gray-400">Razorpay / UPI test mode supporting ₹15 micro-rides, semester passes, and free waivers.</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-charcoal-800/60 border border-charcoal-700 space-y-1.5">
              <div className="flex items-center gap-2 text-campus-300 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-campus-400" /> 24/7 Safety & SOS Mesh
              </div>
              <p className="text-[11px] text-gray-400">Instant distress beacon alerts transport control room with precise campus coordinates.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Market Opportunity',
      subtitle: '$2.4B Global Higher Education Micro-Mobility',
      icon: <TrendingUp className="w-8 h-8 text-emerald-400" />,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
              <span className="text-3xl font-extrabold text-emerald-400">1,100+</span>
              <p className="text-xs font-semibold text-gray-300 mt-1">Tier-1 & Tier-2 Universities in India</p>
              <p className="text-[10px] text-emerald-400/80 mt-1">IITs, NITs, BITS, Central & State Campuses</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
              <span className="text-3xl font-extrabold text-emerald-400">4.2M</span>
              <p className="text-xs font-semibold text-gray-300 mt-1">Daily Campus Commuters</p>
              <p className="text-[10px] text-emerald-400/80 mt-1">Students, researchers, faculty & campus visitors</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
              <span className="text-3xl font-extrabold text-emerald-400">₹180 Cr</span>
              <p className="text-xs font-semibold text-gray-300 mt-1">TAM for Campus EV Shuttles</p>
              <p className="text-[10px] text-emerald-400/80 mt-1">Projected annual micro-fare & university SaaS</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed text-center">
            Universities already purchase electric golf carts (4–12 seaters). CampusCart turns idle, uncoordinated carts into a high-utilization digital transit utility.
          </p>
        </div>
      )
    },
    {
      title: 'Business Model & Unit Economics',
      subtitle: 'Multi-Sided Revenue Streams',
      icon: <DollarSign className="w-8 h-8 text-amber-400" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-charcoal-800 border border-charcoal-700 space-y-1">
            <h5 className="font-bold text-amber-400 text-sm">1. Micro-Fare & Pass Subscriptions</h5>
            <p className="text-gray-300">₹15 per single hop or ₹299 monthly unlimited student pass. 10% platform fee on paid rides.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-charcoal-800 border border-charcoal-700 space-y-1">
            <h5 className="font-bold text-amber-400 text-sm">2. University Transport SaaS License</h5>
            <p className="text-gray-300">₹1.5L / year institutional software contract for fleet telematics, verification, and driver payroll management.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-charcoal-800 border border-charcoal-700 space-y-1">
            <h5 className="font-bold text-amber-400 text-sm">3. Local Campus Sponsor Placements</h5>
            <p className="text-gray-300">Hyperlocal sponsorship banner cards on rider dashboard (Campus Canteen specials, Stationery, Tech Fest sponsors).</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-charcoal-800 border border-charcoal-700 space-y-1">
            <h5 className="font-bold text-amber-400 text-sm">4. Green Energy & Carbon Offsets</h5>
            <p className="text-gray-300">Tracking EV zero-emission miles to help universities earn ISO sustainability green campus credits.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Traction & Deployment Plan',
      subtitle: 'Rollout Playbook (0 to 10 Campuses)',
      icon: <Rocket className="w-8 h-8 text-indigo-400" />,
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-charcoal-800 border border-charcoal-700">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">1</span>
            <div>
              <h5 className="font-bold text-xs text-gray-200">Phase 1: Pilot Campus Launch (Weeks 1-4)</h5>
              <p className="text-[11px] text-gray-400">Deploy at GreenTech University with 5 e-carts, 3 drivers, onboarding 1,500 hostel residents.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-charcoal-800 border border-charcoal-700">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
            <div>
              <h5 className="font-bold text-xs text-gray-200">Phase 2: IoT Telemetry Retrofit (Weeks 5-10)</h5>
              <p className="text-[11px] text-gray-400">OBD-II / ESP32 GPS sensors on e-carts for live battery voltage reporting and charging station alert triggers.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-charcoal-800 border border-charcoal-700">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
            <div>
              <h5 className="font-bold text-xs text-gray-200">Phase 3: Multi-Campus Expansion (Months 3-6)</h5>
              <p className="text-[11px] text-gray-400">Expansion to 10 regional technical institutes and medical colleges with multi-tenant subdomains.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'The Ask & Hackathon Pitch Summary',
      subtitle: 'Why CampusCart Wins',
      icon: <Award className="w-8 h-8 text-yellow-400" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-campus-950/60 to-charcoal-800 border border-campus-500/40">
            <h4 className="text-base font-bold text-campus-300 font-['Plus_Jakarta_Sans']">The 24-Hour Hackathon Delivery</h4>
            <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
              We did not just build wireframes—we built a live multi-actor coordination system complete with student verification gates, medical exception rules, live driver broadcast dispatch, test-mode payment passes, and an emergency SOS panic mesh.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-charcoal-800 border border-charcoal-700">
              <span className="text-gray-400 block text-[11px]">Prototype Status</span>
              <span className="font-bold text-emerald-400">100% Functional MVP</span>
            </div>
            <div className="p-3 rounded-xl bg-charcoal-800 border border-charcoal-700">
              <span className="text-gray-400 block text-[11px]">Live Verification Gate</span>
              <span className="font-bold text-campus-400">Fully Enforced</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-charcoal-900 border border-charcoal-700 p-6 md:p-8 shadow-2xl text-gray-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-charcoal-800">
          <div className="flex items-center gap-3">
            {slides[currentSlide].icon}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-campus-400">
                  Slide {currentSlide + 1} of {slides.length}
                </span>
                <span className="text-gray-500 text-xs">• Hackathon Pitch</span>
              </div>
              <h2 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] text-white">
                {slides[currentSlide].title}
              </h2>
              <p className="text-xs text-gray-400">{slides[currentSlide].subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setIsPitchDeckOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-charcoal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="py-6 flex-1 overflow-y-auto">
          {slides[currentSlide].content}
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-charcoal-800 flex items-center justify-between">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  i === currentSlide ? 'w-6 bg-campus-500' : 'w-2 bg-charcoal-700 hover:bg-charcoal-600'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className="p-2 rounded-xl border border-charcoal-700 disabled:opacity-30 hover:bg-charcoal-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className="px-4 py-2 rounded-xl bg-campus-600 hover:bg-campus-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-30"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

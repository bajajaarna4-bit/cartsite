import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, ShieldCheck, ArrowRight, X } from 'lucide-react';

export const OnboardingTour: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('campus_cart_seen_tour_v2');
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('campus_cart_seen_tour_v2', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const steps = [
    {
      title: 'Welcome to CampusCart!',
      desc: 'GreenTech University’s real-time electric cart coordination platform. Effortlessly hop between hostels, libraries, labs, and gates in minutes.',
      icon: <Sparkles className="w-7 h-7 text-campus-400" />,
      accent: 'from-campus-500/20 to-violet-500/10'
    },
    {
      title: 'Protected Access & Verification',
      desc: 'Only verified campus community members can request rides. Transport Admin grants priority passes for medical injuries, late nights, and exam weeks.',
      icon: <ShieldCheck className="w-7 h-7 text-emerald-400" />,
      accent: 'from-emerald-500/20 to-teal-500/10'
    },
    {
      title: 'Live Real-Time Coordination',
      desc: 'Drivers receive broadcasts instantly. Watch the cart arrive, view live ETAs, and easily test other roles using the top-bar profile switcher!',
      icon: <MapPin className="w-7 h-7 text-indigo-400" />,
      accent: 'from-indigo-500/20 to-blue-500/10'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-charcoal-900 border border-charcoal-700 shadow-2xl p-6 text-gray-100 overflow-hidden">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-charcoal-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${steps[step].accent} border border-white/10 flex items-center justify-center mb-4`}>
          {steps[step].icon}
        </div>

        <h3 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans']">
          {steps[step].title}
        </h3>
        <p className="text-xs text-gray-300 mt-2 leading-relaxed">
          {steps[step].desc}
        </p>

        <div className="mt-6 pt-4 border-t border-charcoal-800 flex items-center justify-between">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-5 bg-campus-500' : 'w-1.5 bg-charcoal-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 rounded-xl bg-campus-600 hover:bg-campus-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleDismiss}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Explore Campus</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


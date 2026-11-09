import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ShieldAlert, 
  Car, 
  Phone, 
  X, 
  Star, 
  ArrowRight, 
  Compass, 
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RiderView: React.FC<{ onOpenPayment: () => void }> = ({ onOpenPayment }) => {
  const {
    currentUser,
    campusLocations,
    rides,
    requestRide,
    cancelRide,
    rateRide,
    userActivePass,
    checkAccessEligibility,
    drivers,
    carts,
  } = useApp();

  const [pickup, setPickup] = useState(campusLocations[0].name);
  const [drop, setDrop] = useState(campusLocations[1].name);
  const [showRatingModal, setShowRatingModal] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [reviewNote, setReviewNote] = useState('');
  const [isCallingDriver, setIsCallingDriver] = useState(false);

  // Active ride tracking
  const activeRide = rides.find(
    r => r.riderId === currentUser.id && ['requested', 'accepted', 'arriving', 'in_progress'].includes(r.status)
  );

  const activePass = userActivePass(currentUser.id);
  const eligibility = checkAccessEligibility(currentUser);

  // Completed rides for recent history
  const recentRides = rides
    .filter(r => r.riderId === currentUser.id && r.status === 'completed')
    .slice(0, 5);

  // Trigger celebration confetti when trip completes
  useEffect(() => {
    const latestFinishedRide = rides.find(
      r => r.riderId === currentUser.id && r.status === 'completed' && !r.rating
    );
    if (latestFinishedRide) {
      setShowRatingModal(latestFinishedRide.id);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if not loaded
      }
    }
  }, [rides, currentUser.id]);

  const handleBooking = () => {
    if (pickup === drop) {
      alert('Pickup and destination must be different campus locations.');
      return;
    }
    requestRide(pickup, drop);
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showRatingModal) {
      rateRide(showRatingModal, selectedRating, reviewNote);
      setShowRatingModal(null);
      setReviewNote('');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const activeDriver = activeRide?.driverId ? drivers.find(d => d.id === activeRide.driverId) : null;
  const activeCart = activeRide?.cartId ? carts.find(c => c.id === activeRide.cartId) : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Verification & Eligibility Alert Banner if blocked */}
      {!eligibility.eligible && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm font-['Plus_Jakarta_Sans']">
                {currentUser.verificationStatus === 'unverified'
                  ? 'College ID Verification Required'
                  : 'Access Pass or Balance Required'}
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                {eligibility.reason}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenPayment}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shrink-0 transition-all shadow"
          >
            {currentUser.verificationStatus === 'unverified' ? 'View ID Status' : 'Get Transit Pass (₹49+)'}
          </button>
        </div>
      )}

      {/* Hero "Where to?" Card (Netflix style) */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-campus-900 via-charcoal-850 to-charcoal-900 border border-charcoal-700/80 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-campus-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-campus-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {getGreeting()}, {currentUser.name.split(' ')[0]}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-xs text-gray-400 font-mono">
              ID: {currentUser.collegeId}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-['Plus_Jakarta_Sans'] tracking-tight">
            Where across campus are you heading today?
          </h1>
          <p className="text-xs md:text-sm text-gray-300 mt-2">
            Zero-emission electric carts connecting you across hostels, academic halls, and campus gates in under 4 minutes.
          </p>

          {/* Booking Bar */}
          {!activeRide && (
            <div className="mt-6 p-4 rounded-2xl bg-charcoal-950/80 border border-charcoal-700 backdrop-blur-xl shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {/* Pickup */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Pickup Location
                  </label>
                  <select
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-xs text-white focus:outline-none focus:border-campus-500"
                  >
                    {campusLocations.map(loc => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Drop */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-campus-400" />
                    Destination
                  </label>
                  <select
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-charcoal-850 border border-charcoal-700 text-xs text-white focus:outline-none focus:border-campus-500"
                  >
                    {campusLocations.map(loc => (
                      <option key={loc.id} value={loc.name}>
                        {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estimate stats & CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-charcoal-800">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Transit Time</span>
                    <span className="font-bold text-white flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> 3 mins
                      <span className="text-[10px] text-gray-400 line-through ml-1">18 min walk</span>
                    </span>
                  </div>
                  <div className="h-6 w-px bg-charcoal-800" />
                  <div>
                    <span className="text-[10px] text-gray-400 block">Fare</span>
                    <span className="font-bold text-emerald-400">
                      {activePass ? 'FREE (Pass Active)' : '₹15 Flat'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-campus-600 to-violet-600 hover:from-campus-500 hover:to-violet-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-campus-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Car className="w-4 h-4" />
                  <span>Request E-Cart Ride</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE RIDE LIVE TRACKER */}
      {activeRide && (
        <div className="p-6 rounded-3xl bg-charcoal-900 border-2 border-campus-500/60 shadow-2xl relative overflow-hidden animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-charcoal-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-campus-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-campus-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-campus-400">
                  Live Ride Status: {activeRide.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1 font-['Plus_Jakarta_Sans']">
                {activeRide.status === 'requested' && 'Finding nearest campus e-cart...'}
                {activeRide.status === 'accepted' && `${activeRide.driverName} accepted your ride!`}
                {activeRide.status === 'arriving' && `${activeRide.driverName} has arrived at pickup`}
                {activeRide.status === 'in_progress' && `Heading towards ${activeRide.drop}`}
              </h3>
            </div>

            <button
              onClick={() => cancelRide(activeRide.id)}
              className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Trip</span>
            </button>
          </div>

          {/* Progress Timeline */}
          <div className="py-6">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { key: 'requested', label: 'Requested' },
                { key: 'accepted', label: 'Driver Assigned' },
                { key: 'arriving', label: 'At Pickup' },
                { key: 'in_progress', label: 'On Route' },
              ].map((step, idx) => {
                const stages = ['requested', 'accepted', 'arriving', 'in_progress'];
                const currentIdx = stages.indexOf(activeRide.status);
                const isPassed = currentIdx >= idx;
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                        isPassed
                          ? 'bg-campus-600 text-white shadow-lg shadow-campus-600/40'
                          : 'bg-charcoal-800 text-gray-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className={`text-[11px] font-semibold ${isPassed ? 'text-white' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Driver & Cart Info Card */}
          {activeDriver && (
            <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-charcoal-750 border border-charcoal-700 flex items-center justify-center text-campus-400">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{activeDriver.name}</h4>
                  <p className="text-xs text-gray-400">
                    Cart {activeCart?.cartNumber || 'EC-01'} • {activeDriver.licenseNo} • ★ {activeDriver.rating}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCallingDriver(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver ({activeDriver.phone})</span>
                </button>
              </div>
            </div>
          )}

          {/* Route path */}
          <div className="mt-4 pt-3 border-t border-charcoal-800/80 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {activeRide.pickup}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-campus-400" /> {activeRide.drop}
            </span>
          </div>
        </div>
      )}

      {/* HORIZONTAL CAROUSEL ROWS (Phase 7: Netflix / Canva Polish) */}

      {/* Row 1: Popular Campus Routes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
            <Compass className="w-4 h-4 text-campus-500" /> Popular Campus Routes
          </h3>
          <span className="text-xs text-gray-400">One-tap fast booking</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { from: 'Hostel Block A (Girls)', to: 'Central Library', time: '2 mins', badge: 'Study Rush' },
            { from: 'Main Campus Gate', to: 'Engineering & Computing Block', time: '3 mins', badge: 'Morning Classes' },
            { from: 'Hostel Block B (Boys)', to: 'Food Court & Student Center', time: '3 mins', badge: 'Dinner' },
            { from: 'Sports Complex & Gym', to: 'Admin & Examination Hall', time: '4 mins', badge: 'Fast Transit' },
          ].map((route, i) => (
            <button
              key={i}
              onClick={() => {
                setPickup(route.from);
                setDrop(route.to);
              }}
              className="shrink-0 w-64 p-4 rounded-2xl bg-white dark:bg-charcoal-850 border border-gray-200 dark:border-charcoal-700/80 hover:border-campus-500 transition-all hover:scale-[1.02] text-left group shadow-sm"
            >
              <span className="px-2 py-0.5 rounded-md bg-campus-500/10 text-campus-600 dark:text-campus-300 text-[10px] font-bold">
                {route.badge}
              </span>
              <div className="mt-2 text-xs font-bold text-gray-900 dark:text-white group-hover:text-campus-400 transition-colors">
                {route.from}
              </div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <ArrowRight className="w-3 h-3 text-campus-500" />
                <span>{route.to}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-100 dark:border-charcoal-750 flex items-center justify-between text-[11px] text-gray-400">
                <span>Cart ETA: {route.time}</span>
                <span className="font-bold text-emerald-500">₹15</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Row 2: Your Passes & Wallet Status */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pass card */}
        <div className="p-5 rounded-3xl bg-gradient-to-tr from-campus-950/40 via-charcoal-850 to-charcoal-900 border border-campus-500/30 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-campus-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Transit Pass
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              activePass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
            }`}>
              {activePass ? 'Active' : 'No Active Pass'}
            </span>
          </div>

          {activePass ? (
            <div className="space-y-1">
              <h4 className="font-extrabold text-base text-white font-['Plus_Jakarta_Sans']">
                {activePass.passType.replace('_', ' ').toUpperCase()}
              </h4>
              <p className="text-xs text-gray-300">{activePass.reason}</p>
              <div className="mt-3 pt-3 border-t border-charcoal-700 flex items-center justify-between text-xs text-gray-400">
                <span>Valid until: <strong className="text-white">{activePass.validUntil}</strong></span>
                <span className="text-emerald-400 font-semibold">Unlimited Rides</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-300">
                Get unlimited hop-on, hop-off transit across GreenTech campus.
              </p>
              <button
                onClick={onOpenPayment}
                className="mt-2 px-4 py-2 rounded-xl bg-campus-600 hover:bg-campus-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
              >
                <span>Subscribe from ₹49</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Campus Wallet */}
        <div className="p-5 rounded-3xl bg-white dark:bg-charcoal-850 border border-gray-200 dark:border-charcoal-700/80 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Campus Transit Wallet
              </span>
              <span className="text-xs text-emerald-500 font-bold">Auto-Debit Ready</span>
            </div>
            <div className="text-3xl font-extrabold text-gray-900 dark:text-white font-['Plus_Jakarta_Sans']">
              ₹{currentUser.walletBalance}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Valid for pay-per-ride bookings on all 5 GreenTech e-carts.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-charcoal-750 flex items-center justify-between">
            <span className="text-xs text-gray-400">₹15 / single trip</span>
            <button
              onClick={onOpenPayment}
              className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-charcoal-750 hover:bg-gray-200 dark:hover:bg-charcoal-700 text-gray-900 dark:text-white text-xs font-semibold transition-colors"
            >
              + Top-up Balance
            </button>
          </div>
        </div>
      </section>

      {/* Row 3: Recent Trips */}
      {recentRides.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white font-['Plus_Jakarta_Sans']">
            Recent Rides
          </h3>
          <div className="space-y-2">
            {recentRides.map(r => (
              <div
                key={r.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-charcoal-850 border border-gray-200 dark:border-charcoal-700/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      {r.pickup} → {r.drop}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">
                      Driver: {r.driverName || 'Rajesh'} • Paid via {r.paymentMethod.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-gray-900 dark:text-white">₹{r.fare}</span>
                  {r.rating && (
                    <div className="text-[11px] text-amber-400 flex items-center justify-end gap-0.5">
                      ★ {r.rating}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Driver Simulated In-App Call Dialog */}
      {isCallingDriver && activeDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-charcoal-900 border border-charcoal-700 p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">Calling Driver...</h4>
              <p className="text-sm font-semibold text-gray-200">{activeDriver.name}</p>
              <p className="text-xs text-gray-400 mt-1">{activeDriver.phone}</p>
            </div>
            <p className="text-xs text-emerald-400 bg-emerald-950/30 p-2 rounded-xl border border-emerald-500/30">
              "Hi! I am approaching your pickup at {activeRide?.pickup} in 1 minute."
            </p>
            <button
              onClick={() => setIsCallingDriver(false)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
            >
              End Call
            </button>
          </div>
        </div>
      )}

      {/* Driver Rating & Review Modal (Celebration moment) */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-charcoal-900 border border-campus-500/50 p-6 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-campus-500/20 text-campus-400 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
              You Have Arrived!
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Hope you enjoyed your zero-emission e-cart ride across GreenTech campus.
            </p>

            <form onSubmit={handleRatingSubmit} className="mt-4 space-y-4">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= selectedRating ? 'text-amber-400 fill-amber-400' : 'text-charcoal-700'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="Leave feedback for driver (punctual, smooth driving, friendly)..."
                rows={2}
                className="w-full p-3 rounded-xl bg-charcoal-800 border border-charcoal-700 text-xs text-white focus:outline-none focus:border-campus-500"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(null)}
                  className="flex-1 py-2 rounded-xl bg-charcoal-800 text-xs font-semibold text-gray-400"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-campus-600 hover:bg-campus-500 text-white font-bold text-xs shadow"
                >
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

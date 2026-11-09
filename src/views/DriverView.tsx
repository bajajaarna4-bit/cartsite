import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Car,
  Power, 
  MapPin, 
  Navigation, 
  CheckCircle, 
  X, 
  BatteryCharging, 
  Phone, 
  ShieldAlert, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const DriverView: React.FC<{ onOpenSos: () => void }> = ({ onOpenSos }) => {
  const {
    currentUser,
    currentDriverProfile,
    drivers,
    carts,
    rides,
    toggleDriverStatus,
    acceptRide,
    declineRide,
    updateRideStatus,
    simulateIncomingRequest,
  } = useApp();

  const driver = currentDriverProfile || drivers[0];
  const cart = carts.find(c => c.id === driver.cartId) || carts[0];

  // Rides specifically assigned to or requested from this driver
  const incomingRequests = rides.filter(
    r => r.status === 'requested' && (r.driverId === driver.id || !r.driverId)
  );

  const activeTrip = rides.find(
    r => r.driverId === driver.id && ['accepted', 'arriving', 'in_progress'].includes(r.status)
  );

  const [simulatedCallingRider, setSimulatedCallingRider] = useState(false);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Driver Header & Online Toggle */}
      <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-700/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={driver.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-campus-500/40"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-charcoal-900 ${
                driver.status === 'online'
                  ? 'bg-emerald-500'
                  : driver.status === 'busy'
                  ? 'bg-amber-500'
                  : 'bg-gray-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                {driver.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-campus-500/10 text-campus-400 border border-campus-500/20">
                ★ {driver.rating} ({driver.totalRides} trips)
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Assigned: <strong>{cart.model}</strong> ({cart.cartNumber}) • {driver.licenseNo}
            </p>
          </div>
        </div>

        {/* Online Switch Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => toggleDriverStatus(driver.id)}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
              driver.status === 'online'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-charcoal-800 hover:bg-charcoal-750 text-gray-300 border border-charcoal-750'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{driver.status === 'online' ? 'Online (Accepting Rides)' : 'Go Online'}</span>
          </button>
        </div>
      </div>

      {/* Driver Daily Metrics & Cart Health */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-700/80">
          <span className="text-gray-400 text-[11px] block">Today's Earnings</span>
          <span className="text-xl font-black text-emerald-400 font-['Plus_Jakarta_Sans']">
            ₹{driver.earningsToday}
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">Direct payout</span>
        </div>

        <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-700/80">
          <span className="text-gray-400 text-[11px] block">Weekly Total</span>
          <span className="text-xl font-black text-white font-['Plus_Jakarta_Sans']">
            ₹{driver.earningsWeek}
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5">+14% vs last week</span>
        </div>

        <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-700/80">
          <span className="text-gray-400 text-[11px] block">Cart Battery</span>
          <span className="text-xl font-black text-emerald-400 font-['Plus_Jakarta_Sans'] flex items-center gap-1">
            <BatteryCharging className="w-4 h-4" /> {cart.batteryPercent}%
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Health: Optimal</span>
        </div>

        <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-700/80">
          <span className="text-gray-400 text-[11px] block">Current Location</span>
          <span className="text-xs font-bold text-white truncate block mt-1">
            {driver.currentLocation}
          </span>
          <span className="text-[10px] text-campus-400 block mt-0.5">Fleet GPS synced</span>
        </div>
      </div>

      {/* INCOMING RIDE REQUEST BROADCAST (Phase 5 real-time matching) */}
      {incomingRequests.length > 0 && !activeTrip && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              Incoming Campus Ride Request!
            </h3>
            <span className="text-xs text-gray-400">Broadcasted to online carts</span>
          </div>

          {incomingRequests.map(req => (
            <div
              key={req.id}
              className="p-5 rounded-3xl bg-charcoal-900 border-2 border-amber-500/70 shadow-2xl space-y-4 animate-in slide-in-from-top-4 duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                    {req.riderName}
                  </h4>
                  <p className="text-xs text-gray-400">
                    Phone: {req.riderPhone} • Payment: {req.paymentMethod.toUpperCase()} (₹{req.fare})
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    ₹{req.fare} Fare
                  </span>
                </div>
              </div>

              {/* Route */}
              <div className="p-3.5 rounded-2xl bg-charcoal-850 border border-charcoal-750 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Pickup</span>
                    <strong className="text-white">{req.pickup}</strong>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-500" />
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-campus-400" />
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Drop</span>
                    <strong className="text-white">{req.drop}</strong>
                  </div>
                </div>
              </div>

              {/* Accept & Decline Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => declineRide(req.id, driver.id)}
                  className="flex-1 py-3 rounded-2xl bg-charcoal-800 hover:bg-charcoal-750 text-gray-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Decline
                </button>
                <button
                  onClick={() => acceptRide(req.id, driver.id)}
                  className="flex-2 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  <CheckCircle className="w-4 h-4" /> Accept & Navigate to Pickup
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ACTIVE TRIP IN PROGRESS (Driver Execution Panel) */}
      {activeTrip && (
        <div className="p-6 rounded-3xl bg-charcoal-900 border-2 border-campus-500 shadow-2xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-campus-400">
                Current Active Assignment
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5 font-['Plus_Jakarta_Sans']">
                Rider: {activeTrip.riderName}
              </h3>
            </div>
            <button
              onClick={() => setSimulatedCallingRider(true)}
              className="px-3.5 py-1.5 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 text-emerald-400 text-xs font-bold flex items-center gap-1.5 border border-charcoal-700"
            >
              <Phone className="w-3.5 h-3.5" /> Call Rider
            </button>
          </div>

          {/* Route path */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-charcoal-850 border border-charcoal-750">
              <span className="text-[10px] text-gray-400 block uppercase">Pickup Location</span>
              <p className="font-bold text-white text-sm mt-0.5">{activeTrip.pickup}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-charcoal-850 border border-charcoal-750">
              <span className="text-[10px] text-gray-400 block uppercase">Destination</span>
              <p className="font-bold text-white text-sm mt-0.5">{activeTrip.drop}</p>
            </div>
          </div>

          {/* Trip Lifecycle Controls */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Advance Ride Stage (Updates Rider Instantly):
            </label>

            {activeTrip.status === 'accepted' && (
              <button
                onClick={() => updateRideStatus(activeTrip.id, 'arriving')}
                className="w-full py-3.5 rounded-2xl bg-campus-600 hover:bg-campus-500 text-white font-bold text-sm shadow-lg shadow-campus-600/30 transition-all flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" /> Mark "Arrived at Pickup"
              </button>
            )}

            {activeTrip.status === 'arriving' && (
              <button
                onClick={() => updateRideStatus(activeTrip.id, 'in_progress')}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" /> Start Trip (Rider Boarded)
              </button>
            )}

            {activeTrip.status === 'in_progress' && (
              <button
                onClick={() => updateRideStatus(activeTrip.id, 'completed')}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <CheckCircle className="w-4 h-4" /> Complete Trip & Collect ₹{activeTrip.fare}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick Test Trigger */}
      {!activeTrip && incomingRequests.length === 0 && (
        <div className="p-5 rounded-3xl bg-charcoal-850 border border-charcoal-750 text-center space-y-3">
          <Car className="w-8 h-8 text-gray-500 mx-auto" />
          <h4 className="text-sm font-bold text-gray-200">No Active Ride Right Now</h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            You are ready and online. Incoming requests from students and staff will appear here immediately.
          </p>
          <button
            onClick={simulateIncomingRequest}
            className="px-4 py-2 rounded-xl bg-campus-600/20 hover:bg-campus-600/30 text-campus-300 font-semibold text-xs border border-campus-500/30 inline-flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Simulate Incoming Request for Demo
          </button>
        </div>
      )}

      {/* Driver SOS button */}
      <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-red-400">
          <ShieldAlert className="w-4 h-4" />
          <span>Vehicle Breakdown or Campus Obstacle?</span>
        </div>
        <button
          onClick={onOpenSos}
          className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
        >
          Report SOS Alert
        </button>
      </div>

      {/* Simulated Rider Call Modal */}
      {simulatedCallingRider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-charcoal-900 border border-charcoal-700 p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Calling Rider...</h4>
              <p className="text-sm font-semibold text-gray-200">{activeTrip?.riderName}</p>
              <p className="text-xs text-gray-400">{activeTrip?.riderPhone}</p>
            </div>
            <p className="text-xs text-emerald-400 bg-emerald-950/30 p-2 rounded-xl border border-emerald-500/30">
              "Hi! I am in Cart {cart.cartNumber} waiting right outside the gate."
            </p>
            <button
              onClick={() => setSimulatedCallingRider(false)}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

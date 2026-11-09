import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Car, 
  Check, 
  X, 
  Plus, 
  BatteryCharging,
  ShieldAlert,
  BarChart2
} from 'lucide-react';
import { AccessPass } from '../types';

export const AdminView: React.FC = () => {
  const {
    users,
    drivers,
    carts,
    passes,
    rides,
    sosAlerts,
    verifyUser,
    grantPass,
    revokePass,
    toggleCartStatus,
    resolveSosAlert,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verification' | 'passes' | 'fleet' | 'analytics' | 'sos'>('verification');

  // Grant pass form states
  const [selectedStudentId, setSelectedStudentId] = useState(users[0]?.id || '');
  const [passType, setPassType] = useState<AccessPass['passType']>('medical_injury');
  const [passDays, setPassDays] = useState(14);
  const [passReason, setPassReason] = useState('Medical condition: Right leg injury requiring mobility support');
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);

  // Filter pending users
  const pendingUsers = users.filter(u => u.verificationStatus === 'unverified' || u.verificationStatus === 'pending');
  const activeSos = sosAlerts.filter(s => s.status === 'active');

  const handleGrantPassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentId) {
      grantPass(selectedStudentId, passType, passDays, passReason);
      setIsPassModalOpen(false);
    }
  };

  // Compute analytics
  const totalRidesCount = rides.length;
  const completedRidesCount = rides.filter(r => r.status === 'completed').length;
  const totalFareRevenue = rides.filter(r => r.status === 'completed').reduce((acc, r) => acc + r.fare, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Admin Dashboard Header */}
      <div className="p-6 rounded-3xl bg-charcoal-900 border border-charcoal-700/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Transport Administration Office
            </span>
            <span className="text-xs text-gray-400">GreenTech Control Desk</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 font-['Plus_Jakarta_Sans']">
            Fleet & Safety Control Hub
          </h2>
          <p className="text-xs text-gray-400">
            One-time verification gates, priority medical waivers, and live cart telematics.
          </p>
        </div>

        {/* Quick Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPassModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-campus-600 hover:bg-campus-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-campus-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Grant Access Pass
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[11px]">Pending Approvals</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-amber-400 font-['Plus_Jakarta_Sans'] block mt-1">
            {pendingUsers.length}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Students awaiting verification</span>
        </div>

        <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[11px]">Active Passes</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-emerald-400 font-['Plus_Jakarta_Sans'] block mt-1">
            {passes.filter(p => p.status === 'active').length}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Medical, Exam & Monthly</span>
        </div>

        <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[11px]">Active E-Carts</span>
            <Car className="w-4 h-4 text-campus-400" />
          </div>
          <span className="text-2xl font-black text-white font-['Plus_Jakarta_Sans'] block mt-1">
            {carts.filter(c => c.status === 'active').length} / {carts.length}
          </span>
          <span className="text-[10px] text-campus-400 block mt-0.5">3 online drivers deployed</span>
        </div>

        <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-[11px]">Active SOS Alarms</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-2xl font-black text-red-400 font-['Plus_Jakarta_Sans'] block mt-1">
            {activeSos.length}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">Campus security channel</span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex gap-2 p-1.5 rounded-2xl bg-charcoal-900 border border-charcoal-750 overflow-x-auto text-xs font-semibold">
        {[
          { key: 'verification', label: `Verification Queue (${pendingUsers.length})` },
          { key: 'passes', label: `Access Passes (${passes.length})` },
          { key: 'fleet', label: `Fleet & Drivers (${carts.length})` },
          { key: 'analytics', label: 'Transit Analytics' },
          { key: 'sos', label: `SOS Log (${sosAlerts.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-campus-600 text-white shadow'
                : 'text-gray-400 hover:text-white hover:bg-charcoal-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: VERIFICATION QUEUE (Phase 3 Core requirement) */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Pending College ID Verification
            </h3>
            <span className="text-xs text-gray-400">
              Students cannot book rides until approved by admin
            </span>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="p-8 rounded-3xl bg-charcoal-850 border border-charcoal-750 text-center">
              <Check className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h4 className="font-bold text-white text-sm">All Clean! No Pending Verifications</h4>
              <p className="text-xs text-gray-400 mt-1">
                Every registered campus member has been reviewed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map(user => (
                <div
                  key={user.id}
                  className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{user.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                          {user.verificationStatus}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        ID: <strong className="text-gray-200">{user.collegeId}</strong> • Dept: {user.department}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Email: {user.email} • Phone: {user.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => verifyUser(user.id, false)}
                      className="px-3.5 py-2 rounded-xl bg-charcoal-800 hover:bg-charcoal-750 text-red-400 text-xs font-bold flex items-center gap-1 border border-charcoal-700"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => verifyUser(user.id, true)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all hover:scale-[1.02]"
                    >
                      <Check className="w-3.5 h-3.5" /> Verify & Unlock Cart Access
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ACCESS CONDITIONS & PASSES */}
      {activeTab === 'passes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Active & Historic Access Passes
            </h3>
            <button
              onClick={() => setIsPassModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-campus-600 hover:bg-campus-500 text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Issue New Pass
            </button>
          </div>

          <div className="space-y-2.5">
            {passes.map(pass => {
              const today = new Date().toISOString().split('T')[0];
              const isExpired = pass.validUntil < today || pass.status === 'expired';

              return (
                <div
                  key={pass.id}
                  className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{pass.userName}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isExpired
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {isExpired ? 'Expired' : pass.status}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-campus-500/20 text-campus-300">
                        {pass.passType.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-1">Reason: {pass.reason}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Valid: {pass.validFrom} to {pass.validUntil} • Issued by: {pass.issuedBy || 'Admin'}
                    </p>
                  </div>

                  {!isExpired && pass.status === 'active' && (
                    <button
                      onClick={() => revokePass(pass.id)}
                      className="px-3 py-1.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 font-semibold text-xs"
                    >
                      Revoke Pass
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FLEET & DRIVERS */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          {/* Carts */}
          <div>
            <h3 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans'] mb-3">
              Campus Electric Carts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {carts.map(cart => (
                <div key={cart.id} className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-sm">{cart.cartNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      cart.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : cart.status === 'charging'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {cart.status}
                    </span>
                  </div>
                  <p className="text-gray-400">{cart.model}</p>
                  <div className="pt-2 border-t border-charcoal-700/80 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <BatteryCharging className="w-3.5 h-3.5" /> {cart.batteryPercent}%
                    </span>
                    <span className="text-gray-400">Cap: {cart.capacity} seats</span>
                  </div>

                  <div className="pt-1 flex gap-1.5">
                    <button
                      onClick={() => toggleCartStatus(cart.id, 'active')}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold ${
                        cart.status === 'active' ? 'bg-emerald-600 text-white' : 'bg-charcoal-800 text-gray-400'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => toggleCartStatus(cart.id, 'charging')}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold ${
                        cart.status === 'charging' ? 'bg-amber-600 text-white' : 'bg-charcoal-800 text-gray-400'
                      }`}
                    >
                      Charging
                    </button>
                    <button
                      onClick={() => toggleCartStatus(cart.id, 'maintenance')}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold ${
                        cart.status === 'maintenance' ? 'bg-red-600 text-white' : 'bg-charcoal-800 text-gray-400'
                      }`}
                    >
                      Repair
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Drivers */}
          <div>
            <h3 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans'] mb-3">
              Staff Drivers
            </h3>
            <div className="space-y-2">
              {drivers.map(drv => (
                <div
                  key={drv.id}
                  className="p-3.5 rounded-2xl bg-charcoal-850 border border-charcoal-750 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-campus-600/20 text-campus-400 flex items-center justify-center font-bold">
                      {drv.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{drv.name}</h4>
                      <p className="text-gray-400 text-[11px]">
                        License: {drv.licenseNo} • ★ {drv.rating} • {drv.totalRides} trips
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      drv.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'
                    }`}>
                      {drv.status}
                    </span>
                    <span className="block text-[11px] text-gray-400 mt-0.5">Loc: {drv.currentLocation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Campus Transit Telematics & Peak Times
            </h3>
            <span className="text-xs text-emerald-400 font-bold">
              Total Fares Collected: ₹{totalFareRevenue} ({completedRidesCount}/{totalRidesCount} trips)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750">
              <span className="text-gray-400 block text-[11px]">Peak Transit Hours</span>
              <span className="text-lg font-bold text-campus-400 mt-1 block">8:30 AM - 10:15 AM</span>
              <p className="text-gray-400 text-[11px] mt-1">Hostel-to-Class Morning Wave (42% of volume)</p>
            </div>

            <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750">
              <span className="text-gray-400 block text-[11px]">Evening Rush</span>
              <span className="text-lg font-bold text-amber-400 mt-1 block">5:00 PM - 7:30 PM</span>
              <p className="text-gray-400 text-[11px] mt-1">Food Court & Sports Complex Shuttles</p>
            </div>

            <div className="p-4 rounded-2xl bg-charcoal-850 border border-charcoal-750">
              <span className="text-gray-400 block text-[11px]">Most Frequented Route</span>
              <span className="text-sm font-bold text-emerald-400 mt-1 block">Hostel Block A ↔ Central Library</span>
              <p className="text-gray-400 text-[11px] mt-1">Average trip duration: 3.2 minutes</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-charcoal-850 border border-charcoal-750 space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-campus-400" /> Busiest Campus Corridors
            </h4>
            {[
              { route: 'Hostel Block A ➔ Central Library', count: 184, share: '38%' },
              { route: 'Main Campus Gate ➔ Engineering Block', count: 142, share: '30%' },
              { route: 'Food Court ➔ Hostel Block B', count: 96, share: '20%' },
              { route: 'Sports Complex ➔ Admin Hall', count: 58, share: '12%' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{item.route}</span>
                  <span className="font-bold text-white">{item.count} rides ({item.share})</span>
                </div>
                <div className="w-full h-2 rounded-full bg-charcoal-750 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-campus-500 to-violet-500 rounded-full"
                    style={{ width: item.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SOS LOG */}
      {activeTab === 'sos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans']">
              Campus SOS Emergency Beacon Log
            </h3>
            <span className="text-xs text-red-400 font-bold">Priority High Channel</span>
          </div>

          {sosAlerts.length === 0 ? (
            <p className="text-xs text-gray-400">No emergency alarms logged.</p>
          ) : (
            <div className="space-y-3">
              {sosAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ${
                    alert.status === 'active'
                      ? 'bg-red-950/30 border-red-500'
                      : 'bg-charcoal-850 border-charcoal-750'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      <h4 className="font-bold text-white text-sm">{alert.senderName} ({alert.senderRole})</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alert.status === 'active' ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-700 text-gray-400'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                    <p className="text-gray-300 mt-1">Location: <strong>{alert.location}</strong></p>
                    <p className="text-gray-400 mt-0.5">Details: {alert.reason}</p>
                    <span className="text-[10px] text-gray-500 block mt-1">{alert.timestamp}</span>
                  </div>

                  {alert.status === 'active' && (
                    <button
                      onClick={() => resolveSosAlert(alert.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grant Pass Modal Form */}
      {isPassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-charcoal-900 border border-charcoal-700 p-6 shadow-2xl text-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
              <h3 className="font-bold text-base text-white font-['Plus_Jakarta_Sans']">
                Issue Conditional Access Pass
              </h3>
              <button
                onClick={() => setIsPassModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGrantPassSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-400 font-semibold mb-1">Select Student / Staff Member:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-charcoal-800 border border-charcoal-700 text-white"
                >
                  {users.filter(u => u.role !== 'admin').map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.collegeId} - {u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Pass Category:</label>
                <select
                  value={passType}
                  onChange={(e) => setPassType(e.target.value as AccessPass['passType'])}
                  className="w-full p-2.5 rounded-xl bg-charcoal-800 border border-charcoal-700 text-white"
                >
                  <option value="medical_injury">Medical Injury / Health Center Waiver (Free)</option>
                  <option value="accessibility_special">Special Accessibility / Disability Permit (Permanent Free)</option>
                  <option value="late_night_safety">Late-Night Safety Escort Permit</option>
                  <option value="exam_week">Exam Week Fast-Transit Pass</option>
                  <option value="weekly_commuter">Weekly Commuter Pass</option>
                  <option value="unlimited_monthly">Monthly All-Campus Pass</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Validity Duration (Days):</label>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={passDays}
                  onChange={(e) => setPassDays(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-charcoal-800 border border-charcoal-700 text-white"
                />
              </div>

              <div>
                <label className="block text-gray-400 font-semibold mb-1">Approval Reason & Reference:</label>
                <textarea
                  rows={2}
                  value={passReason}
                  onChange={(e) => setPassReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-charcoal-800 border border-charcoal-700 text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsPassModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-charcoal-800 text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-campus-600 hover:bg-campus-500 text-white font-bold"
                >
                  Grant Pass
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

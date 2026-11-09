import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  User, Driver, Cart, CampusLocation, AccessPass, Ride, PaymentTransaction, SosAlert, ToastMessage, ChatMessage
} from '../types';
import {
  CAMPUS_LOCATIONS, INITIAL_USERS, INITIAL_CARTS, INITIAL_DRIVERS, INITIAL_PASSES, INITIAL_RIDES, INITIAL_PAYMENTS, INITIAL_SOS_ALERTS
} from '../data/seedData';

interface AppContextType {
  // Current session
  currentUser: User;
  currentRole: User['role'];
  currentDriverProfile?: Driver;
  setCurrentUserById: (id: string) => void;
  setRole: (role: User['role']) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Data lists
  users: User[];
  drivers: Driver[];
  carts: Cart[];
  passes: AccessPass[];
  rides: Ride[];
  payments: PaymentTransaction[];
  sosAlerts: SosAlert[];
  chatMessages: ChatMessage[];
  campusLocations: CampusLocation[];
  toasts: ToastMessage[];

  // Chat actions
  sendChatMessage: (rideId: string, text: string) => void;

  // Toast actions
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Rider actions
  requestRide: (pickup: string, drop: string) => { success: boolean; error?: string; rideId?: string };
  cancelRide: (rideId: string) => void;
  rateRide: (rideId: string, rating: number, review?: string) => void;
  userActivePass: (userId: string) => AccessPass | undefined;
  checkAccessEligibility: (user: User) => { eligible: boolean; reason: string; pass?: AccessPass };
  topUpWallet: (amount: number, method: string) => void;
  purchasePass: (passType: AccessPass['passType'], price: number, days: number, reason: string) => void;

  // Driver actions
  toggleDriverStatus: (driverId: string) => void;
  acceptRide: (rideId: string, driverId: string) => void;
  declineRide: (rideId: string, driverId?: string) => void;
  updateRideStatus: (rideId: string, status: Ride['status']) => void;

  // Admin actions
  verifyUser: (userId: string, approved: boolean) => void;
  grantPass: (userId: string, passType: AccessPass['passType'], days: number, reason: string) => void;
  revokePass: (passId: string) => void;
  toggleCartStatus: (cartId: string, status: Cart['status']) => void;
  resolveSosAlert: (alertId: string) => void;
  triggerSos: (reason: string, location: string) => void;

  // Demo controls
  resetDemoData: () => void;
  simulateIncomingRequest: () => void;
  isDemoDrawerOpen: boolean;
  setIsDemoDrawerOpen: (open: boolean) => void;
  isPitchDeckOpen: boolean;
  setIsPitchDeckOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'campus_cart_users_v2',
  DRIVERS: 'campus_cart_drivers_v2',
  CARTS: 'campus_cart_carts_v2',
  PASSES: 'campus_cart_passes_v2',
  RIDES: 'campus_cart_rides_v2',
  PAYMENTS: 'campus_cart_payments_v2',
  SOS: 'campus_cart_sos_v2',
  CHAT: 'campus_cart_chat_v2',
  CURRENT_USER_ID: 'campus_cart_cur_user_v2',
  DARK_MODE: 'campus_cart_dark_mode_v2',
};

// Simple web audio synth chime for incoming ride notifications
const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch {
    // Audio context may be restricted by browser until first interaction
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Core entities with local storage initialization
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DRIVERS);
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [carts, setCarts] = useState<Cart[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CARTS);
    return saved ? JSON.parse(saved) : INITIAL_CARTS;
  });

  const [passes, setPasses] = useState<AccessPass[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PASSES);
    return saved ? JSON.parse(saved) : INITIAL_PASSES;
  });

  const [rides, setRides] = useState<Ride[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RIDES);
    return saved ? JSON.parse(saved) : INITIAL_RIDES;
  });

  const [payments, setPayments] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOS);
    return saved ? JSON.parse(saved) : INITIAL_SOS_ALERTS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
    return saved ? JSON.parse(saved) : [];
  });

  // Current session user
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'user-stu-1'; // Default: Aarav Sharma (Verified Student)
  });

  // Modals & UI states
  const [isDemoDrawerOpen, setIsDemoDrawerOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync back to LocalStorage
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers)); }, [drivers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CARTS, JSON.stringify(carts)); }, [carts]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PASSES, JSON.stringify(passes)); }, [passes]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.RIDES, JSON.stringify(rides)); }, [rides]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments)); }, [payments]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SOS, JSON.stringify(sosAlerts)); }, [sosAlerts]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages)); }, [chatMessages]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId); }, [currentUserId]);

  // Cross-tab synchronization via BroadcastChannel
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('campus_cart_realtime_sync');
      channel.onmessage = (event) => {
        const { type, payload } = event.data;
        if (type === 'SYNC_ALL') {
          if (payload.rides) setRides(payload.rides);
          if (payload.drivers) setDrivers(payload.drivers);
          if (payload.users) setUsers(payload.users);
          if (payload.passes) setPasses(payload.passes);
          if (payload.sosAlerts) setSosAlerts(payload.sosAlerts);
        } else if (type === 'TOAST') {
          addToast(payload.title, payload.message, payload.type);
        }
      };
      return () => channel.close();
    }
  }, []);

  const broadcastSync = useCallback((customPayload?: Partial<{ rides: Ride[]; drivers: Driver[]; users: User[]; passes: AccessPass[]; sosAlerts: SosAlert[] }>) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('campus_cart_realtime_sync');
      channel.postMessage({
        type: 'SYNC_ALL',
        payload: {
          rides,
          drivers,
          users,
          passes,
          sosAlerts,
          ...customPayload
        }
      });
      channel.close();
    }
  }, [rides, drivers, users, passes, sosAlerts]);

  // Toast system
  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev.slice(-4), { id, title, message, type, timestamp: Date.now() }]);
    playNotificationSound();
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Current session resolution
  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const currentRole = currentUser.role;
  const currentDriverProfile = drivers.find(d => d.userId === currentUser.id);

  const setCurrentUserById = (id: string) => {
    const target = users.find(u => u.id === id);
    if (target) {
      setCurrentUserId(id);
      addToast('Profile Switched', `Logged in as ${target.name} (${target.role.toUpperCase()})`, 'info');
    }
  };

  const setRole = (role: User['role']) => {
    const target = users.find(u => u.role === role);
    if (target) {
      setCurrentUserId(target.id);
      addToast('Role Switched', `Now acting as ${target.role.toUpperCase()} (${target.name})`, 'info');
    }
  };

  // Check user pass & eligibility
  const userActivePass = useCallback((userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return passes.find(p => p.userId === userId && p.status === 'active' && p.validUntil >= today);
  }, [passes]);

  const checkAccessEligibility = useCallback((user: User) => {
    if (user.verificationStatus === 'unverified') {
      return {
        eligible: false,
        reason: 'Your college ID is unverified. Transport office admin approval is required before requesting rides.'
      };
    }
    if (user.verificationStatus === 'rejected') {
      return {
        eligible: false,
        reason: 'Your account was rejected by the transport office. Please visit Admin Hall Desk 3.'
      };
    }

    const activePass = userActivePass(user.id);
    if (activePass) {
      return { eligible: true, reason: 'Active transit pass', pass: activePass };
    }

    // Check if user has sufficient wallet balance for single ride (Rs 15)
    if (user.walletBalance >= 15) {
      return { eligible: true, reason: 'Pay-per-ride via Wallet Balance' };
    }

    return {
      eligible: false,
      reason: 'No active pass and insufficient wallet balance (₹15 needed). Please top up or purchase a pass.'
    };
  }, [userActivePass]);

  // Request ride logic
  const requestRide = useCallback((pickup: string, drop: string): { success: boolean; error?: string; rideId?: string } => {
    // Check eligibility
    const eligibility = checkAccessEligibility(currentUser);
    if (!eligibility.eligible) {
      addToast('Booking Blocked', eligibility.reason, 'error');
      return { success: false, error: eligibility.reason };
    }

    // Check if rider already has an active ride
    const existingActiveRide = rides.find(
      r => r.riderId === currentUser.id && ['requested', 'accepted', 'arriving', 'in_progress'].includes(r.status)
    );
    if (existingActiveRide) {
      addToast('Ride Already Active', 'You already have a trip underway. Please complete or cancel it first.', 'warning');
      return { success: false, error: 'Active ride in progress', rideId: existingActiveRide.id };
    }

    // Find online drivers
    const onlineDrivers = drivers.filter(d => d.status === 'online');
    if (onlineDrivers.length === 0) {
      addToast('No Drivers Online', 'All campus e-carts are currently offline or busy. Please try again shortly.', 'warning');
      return { success: false, error: 'No drivers available' };
    }

    // Select nearest/first available driver or broadcast
    const chosenDriver = onlineDrivers[0];
    const newRideId = 'ride-' + Math.random().toString(36).substring(2, 8);
    const pass = eligibility.pass;

    const newRide: Ride = {
      id: newRideId,
      riderId: currentUser.id,
      riderName: currentUser.name,
      riderPhone: currentUser.phone,
      driverId: chosenDriver.id,
      driverName: chosenDriver.name,
      cartId: chosenDriver.cartId,
      pickup,
      drop,
      status: 'requested',
      fare: 15,
      paymentStatus: pass ? 'paid' : 'pending',
      paymentMethod: pass ? 'pass' : 'wallet',
      etaMinutes: 3,
      createdAt: new Date().toISOString(),
    };

    const updatedRides = [newRide, ...rides];
    setRides(updatedRides);

    // If using wallet without pass, deduct fare
    if (!pass) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, walletBalance: u.walletBalance - 15 } : u));
    }

    addToast('Ride Requested!', `Broadcasted to driver ${chosenDriver.name} at ${chosenDriver.currentLocation}.`, 'success');
    broadcastSync({ rides: updatedRides });

    return { success: true, rideId: newRideId };
  }, [currentUser, checkAccessEligibility, rides, drivers, broadcastSync, addToast]);

  const cancelRide = useCallback((rideId: string) => {
    const targetRide = rides.find(r => r.id === rideId);
    if (!targetRide) return;

    // Refund if wallet was deducted
    if (targetRide.paymentMethod === 'wallet' && targetRide.fare > 0) {
      setUsers(uList => uList.map(u => u.id === targetRide.riderId ? { ...u, walletBalance: u.walletBalance + targetRide.fare } : u));
    }

    setRides(prev => prev.map(r => r.id === rideId ? { ...r, status: 'cancelled' } : r));

    // Reset driver to online
    if (targetRide.driverId) {
      setDrivers(prev => prev.map(d => d.id === targetRide.driverId ? { ...d, status: 'online' } : d));
    }

    addToast('Ride Cancelled', 'Your e-cart booking was cancelled.', 'info');
    broadcastSync();
  }, [rides, broadcastSync, addToast]);

  const rateRide = useCallback((rideId: string, rating: number, review?: string) => {
    setRides(prev => prev.map(r => r.id === rideId ? { ...r, rating, review } : r));
    addToast('Thank You!', `Rated ${rating} ★. Your feedback keeps campus transit great!`, 'success');
    broadcastSync();
  }, [broadcastSync, addToast]);

  // Driver actions
  const toggleDriverStatus = useCallback((driverId: string) => {
    setDrivers(prev => prev.map(d => {
      if (d.id === driverId) {
        const nextStatus = d.status === 'online' ? 'offline' : 'online';
        addToast('Driver Status', `You are now ${nextStatus.toUpperCase()}`, nextStatus === 'online' ? 'success' : 'info');
        return { ...d, status: nextStatus };
      }
      return d;
    }));
    broadcastSync();
  }, [broadcastSync, addToast]);

  const acceptRide = useCallback((rideId: string, driverId: string) => {
    const targetDriver = drivers.find(d => d.id === driverId);
    setRides(prev => prev.map(r => {
      if (r.id === rideId) {
        return {
          ...r,
          status: 'accepted',
          driverId,
          driverName: targetDriver?.name || 'Assigned Driver',
          cartId: targetDriver?.cartId || 'cart-1',
          acceptedAt: new Date().toISOString()
        };
      }
      return r;
    }));

    setDrivers(prev => prev.map(d => d.id === driverId ? { ...d, status: 'busy' } : d));
    addToast('Ride Accepted', `Navigating to pickup for rider.`, 'success');
    broadcastSync();
  }, [drivers, broadcastSync, addToast]);

  const declineRide = useCallback((rideId: string, driverId?: string) => {
    const currentId = driverId || currentDriverProfile?.id;
    // Find next available online driver
    const otherDrivers = drivers.filter(d => d.status === 'online' && d.id !== currentId);
    if (otherDrivers.length > 0) {
      const nextDrv = otherDrivers[0];
      setRides(prev => prev.map(r => r.id === rideId ? {
        ...r,
        driverId: nextDrv.id,
        driverName: nextDrv.name,
        cartId: nextDrv.cartId,
      } : r));
      addToast('Request Re-routed', `Broadcasted to next driver (${nextDrv.name})`, 'info');
    } else {
      const targetRide = rides.find(r => r.id === rideId);
      if (targetRide && targetRide.paymentMethod === 'wallet' && targetRide.fare > 0) {
        setUsers(uList => uList.map(u => u.id === targetRide.riderId ? { ...u, walletBalance: u.walletBalance + targetRide.fare } : u));
      }
      setRides(prev => prev.map(r => r.id === rideId ? { ...r, status: 'cancelled' } : r));
      addToast('No Other Drivers', 'Ride cancelled due to no available drivers. Wallet refunded if applicable.', 'warning');
    }
    broadcastSync();
  }, [drivers, currentDriverProfile?.id, rides, broadcastSync, addToast]);

  const updateRideStatus = useCallback((rideId: string, status: Ride['status']) => {
    const timestamp = new Date().toISOString();
    setRides(prev => prev.map(r => {
      if (r.id === rideId) {
        const updated = { ...r, status };
        if (status === 'arriving') updated.arrivedAt = timestamp;
        if (status === 'in_progress') updated.startedAt = timestamp;
        if (status === 'completed') {
          updated.completedAt = timestamp;
          updated.paymentStatus = 'paid';
        }
        return updated;
      }
      return r;
    }));

    const targetRide = rides.find(r => r.id === rideId);
    if (status === 'completed' && targetRide?.driverId) {
      // Add driver earnings
      setDrivers(prev => prev.map(d => {
        if (d.id === targetRide.driverId) {
          return {
            ...d,
            status: 'online',
            totalRides: d.totalRides + 1,
            earningsToday: d.earningsToday + targetRide.fare,
            earningsWeek: d.earningsWeek + targetRide.fare
          };
        }
        return d;
      }));
    }

    addToast('Trip Updated', `Status changed to: ${status.replace('_', ' ').toUpperCase()}`, 'info');
    broadcastSync();
  }, [rides, broadcastSync, addToast]);

  // Admin actions
  const verifyUser = useCallback((userId: string, approved: boolean) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          verificationStatus: approved ? 'verified' : 'rejected'
        };
      }
      return u;
    }));
    addToast(
      approved ? 'Student Verified!' : 'Student Rejected',
      `ID status updated for ${users.find(u => u.id === userId)?.name}`,
      approved ? 'success' : 'warning'
    );
    broadcastSync();
  }, [users, broadcastSync, addToast]);

  const grantPass = useCallback((userId: string, passType: AccessPass['passType'], days: number, reason: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const from = new Date();
    const until = new Date();
    until.setDate(until.getDate() + days);

    const newPass: AccessPass = {
      id: 'pass-' + Math.random().toString(36).substring(2, 8),
      userId,
      userName: targetUser.name,
      passType,
      validFrom: from.toISOString().split('T')[0],
      validUntil: until.toISOString().split('T')[0],
      reason,
      status: 'active',
      issuedBy: currentUser.name || 'Transport Admin',
    };

    setPasses(prev => [newPass, ...prev]);
    addToast('Access Pass Granted', `${targetUser.name} now has valid cart access for ${days} days.`, 'success');
    broadcastSync();
  }, [users, currentUser.name, broadcastSync, addToast]);

  const revokePass = useCallback((passId: string) => {
    setPasses(prev => prev.map(p => p.id === passId ? { ...p, status: 'revoked' } : p));
    addToast('Pass Revoked', 'Cart access permit has been deactivated.', 'warning');
    broadcastSync();
  }, [broadcastSync, addToast]);

  const toggleCartStatus = useCallback((cartId: string, status: Cart['status']) => {
    setCarts(prev => prev.map(c => c.id === cartId ? { ...c, status } : c));
    addToast('Fleet Status Changed', `Cart status updated to ${status}.`, 'info');
    broadcastSync();
  }, [broadcastSync, addToast]);

  const resolveSosAlert = useCallback((alertId: string) => {
    setSosAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a));
    addToast('SOS Resolved', 'Emergency alert marked resolved by transport desk.', 'info');
    broadcastSync();
  }, [broadcastSync, addToast]);

  const triggerSos = useCallback((reason: string, location: string) => {
    const newAlert: SosAlert = {
      id: 'sos-' + Math.random().toString(36).substring(2, 7),
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      location,
      reason,
      status: 'active',
      timestamp: new Date().toISOString()
    };
    setSosAlerts(prev => [newAlert, ...prev]);
    addToast('EMERGENCY SOS DISPATCHED', 'Transport office alert sent! Campus security notified.', 'error');
    broadcastSync();
  }, [currentUser, broadcastSync, addToast]);

  // Wallet and pass payments
  const topUpWallet = useCallback((amount: number, method: string) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, walletBalance: u.walletBalance + amount } : u));
    const newTx: PaymentTransaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 8),
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      planType: 'wallet_topup',
      status: 'completed',
      transactionId: 'pay_rzp_' + Math.random().toString(36).substring(2, 10),
      paymentMethod: method,
      createdAt: new Date().toISOString()
    };
    setPayments(prev => [newTx, ...prev]);
    addToast('Wallet Recharged', `₹${amount} added successfully via ${method}.`, 'success');
    broadcastSync();
  }, [currentUser, broadcastSync, addToast]);

  const purchasePass = useCallback((passType: AccessPass['passType'], price: number, days: number, reason: string) => {
    const from = new Date();
    const until = new Date();
    until.setDate(until.getDate() + days);

    const newPass: AccessPass = {
      id: 'pass-' + Math.random().toString(36).substring(2, 8),
      userId: currentUser.id,
      userName: currentUser.name,
      passType,
      validFrom: from.toISOString().split('T')[0],
      validUntil: until.toISOString().split('T')[0],
      reason,
      status: 'active',
      issuedBy: 'Online Razorpay Checkout',
    };

    const newTx: PaymentTransaction = {
      id: 'tx-' + Math.random().toString(36).substring(2, 8),
      userId: currentUser.id,
      userName: currentUser.name,
      amount: price,
      planType: passType === 'unlimited_monthly' ? 'monthly_pass' : 'weekly_pass',
      status: 'completed',
      transactionId: 'pay_rzp_' + Math.random().toString(36).substring(2, 10),
      paymentMethod: 'UPI Razorpay Test Mode',
      createdAt: new Date().toISOString()
    };

    setPasses(prev => [newPass, ...prev]);
    setPayments(prev => [newTx, ...prev]);
    addToast('Pass Activated!', `Unlimited cart access valid until ${newPass.validUntil}.`, 'success');
    broadcastSync();
  }, [currentUser, broadcastSync, addToast]);

  const sendChatMessage = useCallback((rideId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      rideId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, newMsg]);
    playNotificationSound();
  }, [currentUser]);

  // Demo controls
  const resetDemoData = useCallback(() => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setDrivers(INITIAL_DRIVERS);
    setCarts(INITIAL_CARTS);
    setPasses(INITIAL_PASSES);
    setRides(INITIAL_RIDES);
    setPayments(INITIAL_PAYMENTS);
    setSosAlerts(INITIAL_SOS_ALERTS);
    setCurrentUserId('user-stu-1');
    addToast('Data Reset', 'Restored pristine seed database state.', 'info');
  }, [addToast]);

  const simulateIncomingRequest = useCallback(() => {
    const student = users.find(u => u.role === 'student' && u.verificationStatus === 'verified') || users[0];
    const onlineDrv = drivers.find(d => d.status === 'online') || drivers[0];
    const newRide: Ride = {
      id: 'ride-sim-' + Math.random().toString(36).substring(2, 7),
      riderId: student.id,
      riderName: student.name,
      riderPhone: student.phone,
      driverId: onlineDrv.id,
      driverName: onlineDrv.name,
      cartId: onlineDrv.cartId,
      pickup: 'Central Library',
      drop: 'Hostel Block B (Boys)',
      status: 'requested',
      fare: 15,
      paymentStatus: 'paid',
      paymentMethod: 'pass',
      etaMinutes: 2,
      createdAt: new Date().toISOString()
    };
    setRides(prev => [newRide, ...prev]);
    addToast('Incoming Ride Simulated', `From ${student.name}: Central Library -> Hostel Block B`, 'info');
    broadcastSync();
  }, [users, drivers, broadcastSync, addToast]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        currentDriverProfile,
        setCurrentUserById,
        setRole,
        isDarkMode,
        toggleDarkMode,
        users,
        drivers,
        carts,
        passes,
        rides,
        payments,
        sosAlerts,
        chatMessages,
        sendChatMessage,
        campusLocations: CAMPUS_LOCATIONS,
        toasts,
        addToast,
        removeToast,
        requestRide,
        cancelRide,
        rateRide,
        userActivePass,
        checkAccessEligibility,
        topUpWallet,
        purchasePass,
        toggleDriverStatus,
        acceptRide,
        declineRide,
        updateRideStatus,
        verifyUser,
        grantPass,
        revokePass,
        toggleCartStatus,
        resolveSosAlert,
        triggerSos,
        resetDemoData,
        simulateIncomingRequest,
        isDemoDrawerOpen,
        setIsDemoDrawerOpen,
        isPitchDeckOpen,
        setIsPitchDeckOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};


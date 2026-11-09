export type UserRole = 'student' | 'staff' | 'driver' | 'admin';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type RideStatus = 'requested' | 'accepted' | 'arriving' | 'in_progress' | 'completed' | 'cancelled';
export type CartStatus = 'active' | 'maintenance' | 'charging';
export type DriverStatus = 'online' | 'offline' | 'busy';

export interface User {
  id: string;
  name: string;
  email: string;
  collegeId: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  department: string;
  avatar: string;
  phone: string;
  walletBalance: number;
  createdAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  name: string;
  phone: string;
  licenseNo: string;
  rating: number;
  totalRides: number;
  status: DriverStatus;
  cartId: string;
  currentLocation: string;
  earningsToday: number;
  earningsWeek: number;
}

export interface Cart {
  id: string;
  cartNumber: string;
  model: string;
  capacity: number;
  status: CartStatus;
  batteryPercent: number;
  currentDriverId?: string;
  lastMaintenance: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  category: 'gate' | 'hostel' | 'academic' | 'facility' | 'canteen';
  description: string;
  iconName: string;
  coordinates: { x: number; y: number }; // Relative percentage for map visualization
}

export interface AccessPass {
  id: string;
  userId: string;
  userName: string;
  passType: 'unlimited_monthly' | 'weekly_commuter' | 'medical_injury' | 'accessibility_special' | 'late_night_safety' | 'exam_week';
  validFrom: string;
  validUntil: string;
  reason: string;
  status: 'active' | 'expired' | 'revoked';
  issuedBy?: string;
}

export interface Ride {
  id: string;
  riderId: string;
  riderName: string;
  riderPhone: string;
  driverId?: string;
  driverName?: string;
  cartId?: string;
  pickup: string;
  drop: string;
  status: RideStatus;
  fare: number;
  paymentStatus: 'paid' | 'pending' | 'waived';
  paymentMethod: 'wallet' | 'upi' | 'card' | 'pass' | 'cash';
  etaMinutes: number;
  rating?: number;
  review?: string;
  createdAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  planType: 'per_ride' | 'weekly_pass' | 'monthly_pass' | 'wallet_topup' | 'subsidized_free';
  status: 'completed' | 'failed' | 'pending';
  transactionId: string;
  paymentMethod: string;
  createdAt: string;
}

export interface SosAlert {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  location: string;
  reason: string;
  status: 'active' | 'resolved';
  timestamp: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}


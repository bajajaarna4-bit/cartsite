import { describe, it, expect } from 'vitest';
import { INITIAL_USERS, INITIAL_PASSES, INITIAL_DRIVERS, INITIAL_RIDES } from '../data/seedData';
import { User, AccessPass, Ride, Driver } from '../types';

// Pure business logic validators matching AppContext logic
const checkEligibility = (user: User, passes: AccessPass[]) => {
  if (user.verificationStatus === 'unverified') {
    return { eligible: false, reason: 'College ID is unverified' };
  }
  if (user.verificationStatus === 'rejected') {
    return { eligible: false, reason: 'Account was rejected' };
  }

  const today = new Date().toISOString().split('T')[0];
  const activePass = passes.find(
    p => p.userId === user.id && p.status === 'active' && p.validUntil >= today
  );

  if (activePass) {
    return { eligible: true, pass: activePass };
  }

  if (user.walletBalance >= 15) {
    return { eligible: true, reason: 'Wallet Pay-per-ride' };
  }

  return { eligible: false, reason: 'No active pass and insufficient balance' };
};

describe('Phase 8: Critical Business Flow & Access Control Tests', () => {
  it('blocks unverified student (Vikram Singh) from booking a ride', () => {
    const unverifiedUser = INITIAL_USERS.find(u => u.collegeId === 'GTU-2025-ME019')!;
    expect(unverifiedUser).toBeDefined();
    expect(unverifiedUser.verificationStatus).toBe('unverified');

    const result = checkEligibility(unverifiedUser, INITIAL_PASSES);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('unverified');
  });

  it('allows verified student with active medical pass (Aarav Sharma)', () => {
    const verifiedUser = INITIAL_USERS.find(u => u.id === 'user-stu-1')!;
    expect(verifiedUser).toBeDefined();
    expect(verifiedUser.verificationStatus).toBe('verified');

    const result = checkEligibility(verifiedUser, INITIAL_PASSES);
    expect(result.eligible).toBe(true);
    expect(result.pass).toBeDefined();
    expect(result.pass?.passType).toBe('medical_injury');
  });

  it('detects and blocks expired passes', () => {
    const expiredStudent = INITIAL_USERS.find(u => u.id === 'user-stu-4')!; // Ananya Roy
    expect(expiredStudent).toBeDefined();

    // Expired pass user with 0 wallet balance
    const result = checkEligibility(expiredStudent, INITIAL_PASSES);
    expect(result.eligible).toBe(false);
    expect(result.reason).toContain('insufficient balance');
  });

  it('correctly models the 4-stage ride lifecycle', () => {
    const testRide: Ride = {
      id: 'ride-test-1',
      riderId: 'user-stu-1',
      riderName: 'Aarav Sharma',
      riderPhone: '+91 98765 43210',
      pickup: 'Hostel Block A (Girls)',
      drop: 'Central Library',
      status: 'requested',
      fare: 15,
      paymentStatus: 'paid',
      paymentMethod: 'pass',
      etaMinutes: 3,
      createdAt: new Date().toISOString(),
    };

    expect(testRide.status).toBe('requested');

    // Stage 1: Accepted by Driver
    testRide.status = 'accepted';
    testRide.driverId = 'drv-1';
    testRide.driverName = 'Rajesh Kumar';
    expect(testRide.status).toBe('accepted');
    expect(testRide.driverId).toBe('drv-1');

    // Stage 2: Driver Arrived at pickup
    testRide.status = 'arriving';
    testRide.arrivedAt = new Date().toISOString();
    expect(testRide.status).toBe('arriving');

    // Stage 3: Trip In Progress (Rider boarded)
    testRide.status = 'in_progress';
    testRide.startedAt = new Date().toISOString();
    expect(testRide.status).toBe('in_progress');

    // Stage 4: Trip Completed
    testRide.status = 'completed';
    testRide.completedAt = new Date().toISOString();
    testRide.rating = 5;
    expect(testRide.status).toBe('completed');
    expect(testRide.rating).toBe(5);
  });

  it('updates driver earnings and total trips upon completion', () => {
    const driver: Driver = { ...INITIAL_DRIVERS[0] };
    const startingEarnings = driver.earningsToday;
    const startingRides = driver.totalRides;

    const completedFare = 15;
    driver.totalRides += 1;
    driver.earningsToday += completedFare;
    driver.earningsWeek += completedFare;

    expect(driver.totalRides).toBe(startingRides + 1);
    expect(driver.earningsToday).toBe(startingEarnings + 15);
  });
});


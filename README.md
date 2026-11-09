# CampusCart — GreenTech University E-Cart Ride Coordination

An intelligent, real-time electric cart coordination and micro-mobility web app designed for large academic campuses. Built to connect students, staff, e-cart drivers, and the transport office into a synchronized mesh.

---

## 🎯 Phase 1: Product Architecture & Decisions

### 1. Problem Statement
Large university campuses sprawl across 200–800 acres. Students, staff, and visitors frequently experience:
- **Long pedestrian transit delays:** Walking 15–25 minutes between hostels, research laboratories, and academic blocks in harsh weather (rain, heat).
- **Cart utilization blindspots:** Fleet carts often idle at main gates while disabled or injured students remain stranded with no dispatch mechanism.
- **Night-time transit safety hazards:** Students walking unlit paths without real-time tracking or emergency SOS coordination.
- **Unverified access & leakage:** Lack of access control where unauthorized external visitors utilize university-subsidized transport.

### 2. User Roles & Stories

#### 🎓 Role 1: Student / Faculty / Staff (Riders)
- **As a verified student**, I want to view nearest campus pickup hubs, estimated wait times, and request an e-cart so that I can reach my 9:00 AM lecture without walking 20 minutes in the rain.
- **As an injured or disabled student**, I want to receive a medical access pass with priority access and waived fares so that my mobility needs are supported by the university.
- **As an unverified fresher**, I want to be informed of the verification requirements so that I can have the Transport Office verify my college ID.
- **As a night-shift lab researcher**, I want a one-click SOS panic trigger that summons campus security and the nearest active cart.

#### 🛺 Role 2: Cart Driver
- **As an e-cart driver**, I want to toggle between Online/Offline status so that I only receive requests when on duty.
- **As an active driver**, I want to hear an incoming broadcast chime, review the rider's pickup and drop location, and accept or decline.
- **As a driver on a trip**, I want one-tap progression buttons ("Arrived at Pickup", "Start Trip", "End Trip") that instantly update the rider's phone in real time.
- **As a contracted driver**, I want to track my daily and weekly earnings (e.g. ₹380 today, ₹2,650 weekly).

#### 🛡️ Role 3: Transport Office Admin
- **As a transport administrator**, I want a verification queue to review pending student IDs and approve or reject them with a single click.
- **As an admin**, I want to issue conditional access passes (medical injury, disability, late-night safety, exam week) with automated expiry dates.
- **As an admin**, I want fleet visibility over all carts (active, charging, maintenance) and battery percentages.
- **As an admin**, I want analytics on peak transit corridors (e.g., Hostel Block A ➔ Central Library) to optimize cart scheduling.

---

## 🚀 Feature Scope

### MVP Scope (Ready for Live 24-Hour Demo)
- ✅ **Role-Based Portals & Switcher:** Seamless 1-click persona switching (Verified Student, Unverified Fresher, Expired Pass Student, Driver, Admin).
- ✅ **Verification Gate Enforcement:** Strict blocking of unverified users with human-friendly guidance.
- ✅ **Live Ride Lifecycle:** Request ➔ Broadcast ➔ Accept ➔ Arrive ➔ Start ➔ Complete with confetti celebration and emoji ratings.
- ✅ **Real-Time Cross-Tab Synchronization:** Uses `BroadcastChannel` and event synchronization so opening rider and driver tabs side-by-side or in separate windows synchronizes without manual refresh.
- ✅ **Razorpay / UPI Test Mode Payments:** Support for ₹15 per-ride micro-fare, weekly commuter passes (₹99), monthly all-campus passes (₹299), and wallet top-ups.
- ✅ **Conditional Access Passes:** Auto-expiring passes for knee injuries, exam weeks, and faculty grants.
- ✅ **Emergency SOS Dispatch:** Priority distress alert with campus coordinates directly notifying the Transport Office.
- ✅ **Split-Screen Demo Mode:** Allows presenting both Rider and Driver screens side-by-side on a projector or single screen.
- ✅ **Interactive 6-Slide Pitch Deck:** Built directly into the app (Market $2.4B TAM, Business Model, Unit Economics, Traction).

### Future Scope (Post-Hackathon)
- 📡 **Hardware IoT GPS & Telemetry:** ESP32 OBD-II microcontrollers connected directly to cart motor controllers for live battery voltage and speed telemetry.
- 🔋 **Autonomous Dynamic Geo-fencing:** Dynamic speed reduction in heavy pedestrian school zones and automatic dispatch to solar charging docks when battery falls below 20%.
- 🤝 **Multi-Tenant Campus Subdomains:** Enabling multiple universities to deploy their own instances.

---

## 🛠️ Tech Stack Decisions

| Layer | Technology | Decision Rational |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19 + TypeScript + Vite** | Instant HMR, type safety, optimal bundle size |
| **Styling & UI Tokens** | **Tailwind CSS (Dark-First Theme)** | Deep charcoal palette (`#0b0f19`), electric violet and emerald accents, 16–28px rounded corners (Netflix + Canva feel) |
| **Icons** | **Lucide React** | Unified, clean icon set |
| **Realtime Coordination** | **BroadcastChannel + LocalStorage Event Mesh** | Instant multi-tab / multi-device synchronization without requiring third-party cloud keys during local judging |
| **Payment Gateway** | **Simulated Razorpay / UPI Test Sandbox** | QR code scanning, test UPI handles, wallet deduction, and webhook simulation |
| **Audio Synthesis** | **Web Audio API Synth** | Zero-dependency musical chime for incoming driver alerts |

---

## 🏃 Running the Application

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Start the local development server:**
   ```bash
   pnpm dev
   ```
3. **Open the application in your browser:**
   ```
   http://localhost:5173
   ```

---

## 🎭 3-Minute Hackathon Walkthrough Script

1. **0:00 - 0:45 | The Verification Gate:**
   - Switch persona to **Vikram Singh (Unverified Fresher)**.
   - Click *Request E-Cart Ride*. Point out the instant verification gate blocking unauthorized booking.
2. **0:45 - 1:30 | The Transport Admin Desk:**
   - Switch role to **Transport Admin (Controller Deshmukh)**.
   - Go to *Verification Queue* and approve Vikram, or grant an emergency 14-day medical injury pass.
3. **1:30 - 2:15 | Live Rider Booking:**
   - Switch to **Aarav Sharma (Verified Student)** or open **Split-Screen Demo**.
   - Select *Hostel Block A ➔ Engineering Block*. Click *Request E-Cart Ride*.
4. **2:15 - 3:00 | Driver Handoff & Completion:**
   - On the Driver screen, hear the broadcast chime. Click **Accept** ➔ **Arrived** ➔ **Start Trip** ➔ **End Trip**.
   - Watch the rider's screen transition live, trigger celebratory confetti, and prompt for driver rating!

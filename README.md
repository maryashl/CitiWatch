# CitiWatch — Public Service Request System (eCitizen Style)

CitiWatch is an eCitizen-style municipal public service incident reporting and resolution portal. It enables citizens to report community issues (burst water pipes, dark streetlights, uncollected waste, severe potholes, public hazards), while empowering municipal dispatchers and engineers to triage, assign field crews, track lifecycle SLAs, and analyze operational performance in real-time.

---

##  System Features & Mapping to Requirements

| Feature Category | Implementation Details |
| :--- | :--- |
| **Citizen Registration / Login** | Dedicated full-page **eCitizen Single Sign-On (SSO) Login Page** and **National Digital Citizen Registration (Signup) Page**, plus quick modal access. Supports login via National ID or Email, password visibility toggles, strength scores, resident ward selection, and 1-click test credentials for instant grading. |
| **Submit Service Request** | Multi-category picker (`Water & Sewerage`, `Streetlights & Electrical`, `Garbage & Waste`, `Roads & Potholes`, `Parks & Green Spaces`, `Public Health`), simulated GPS location acquisition, ward dropdown, urgency tiers (`Low`, `Normal`, `High`, `Critical SLA`), photo upload / demo sample evidence picker, and instant tracking reference generation (`REQ-2026-XXXX`). |
| **Admin Dashboard** | Dedicated administrative triage desk with KPI cards, multi-criteria filtering (status, category, priority, ward), keyword search, inline quick-status dispatch buttons, and a detailed audit drawer. |
| **Status Tracking Workflow** | Stepper and chronological audit trail covering `Pending Triage` ➔ `In Progress / Field Crew Dispatched` ➔ `Resolved / Verified` (or `Rejected / Closed`) with timestamps, actor roles, and internal engineering logs. |
| **Basic & Advanced Analytics** | Hero comparison card for **Open vs. Resolved Cases**, category distribution progress bars, priority tiers, municipal ward breakdown, resolution velocity (average days to turnaround), and Service Charter SLA compliance metrics. |

---

##  Bonus Features Included

1. **Dedicated Login & Sign Up Pages**: Dedicated full views for eCitizen SSO Authentication and Citizen Registration with password strength indicators, OTP reset simulator, ward selection, and terms consent.
2. **Public Reference Code Tracker (No Sign-In Required)**: Any citizen, auditor, or journalist with a tracking reference (e.g. `REQ-2026-1042`) can track real-time incident resolution without logging in.
3. **Citizen Feedback & Satisfaction Rating**: Once an issue is resolved, citizens can rate the municipal response (1–5 stars) and leave comments that update the public audit log.
4. **Official Printable Resolution Certificate**: Official civic certificate complete with seal, serial number, technical remediation notes, and print-ready layout (`window.print()`).
5. **Instant 1-Click Role & Page Switcher**: A top ribbon allowing evaluators to jump directly to the **Login Page**, **Signup Page**, **Citizen Mode** (`Ashley Anyango`), or **Admin Triage Mode** (`Eng. Beatrice Kimani`) in a single click.
6. **Simulated GPS Location Locking**: Pre-configured geolocation presets matching municipal sectors.
7. **24/7 Emergency Hotlines & Service Charter**: Quick emergency contacts (Police, Fire, Water Emergency, Kenya Power) and standard SLA benchmarks.
8. **CSV Export & Data Reset**: Export filtered service requests to CSV format and reset state to seed data with one click.

---

##  Demo Accounts for Testing

| Role | Name | Email | Password | Action |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Ashley Anyango | `ashleyanyango36@gmail.com` | `citizen123` | Click **Login Page** or **Citizen Demo** on top bar |
| **Citizen** | David Ochieng | `david.ochieng@gmail.com` | `citizen123` | Click 1-click in on Login page |
| **Municipal Admin** | Eng. Beatrice Kimani | `admin@ecitizen.gov.ke` | `admin123` | Click **Admin Demo** on top bar |

---

##  Project Architecture

```
/
├── index.html                    # Entry point with SEO and OpenGraph metadata
├── metadata.json                 # Applet metadata
├── package.json                  # Dependencies (React 19, Tailwind CSS, Lucide, Motion)
├── README.md                     # Technical documentation & usage instructions
└── src/
    ├── App.tsx                   # Main application layout, routing, and modal host
    ├── main.tsx                  # React 19 root bootstrap
    ├── index.css                 # Global Tailwind v4 configuration
    ├── types/
    │   └── index.ts              # TypeScript interfaces (User, ServiceRequest, Analytics, etc.)
    ├── data/
    │   ├── categories.ts         # Service category definitions, SLAs, and municipal wards
    │   └── seedData.ts           # Realistic pre-seeded municipal requests and demo users
    ├── context/
    │   └── AppContext.tsx        # Centralized state store, localStorage persistence, and analytics
    └── components/
        ├── LoginPage.tsx         # Dedicated eCitizen SSO Login page with demo fast fill
        ├── SignupPage.tsx        # Dedicated Citizen Registration page with ward picker & password strength
        ├── Navbar.tsx            # Header with national insignia and evaluator quick-switcher
        ├── StatusBadge.tsx       # Standardized status and urgency badge pills
        ├── CategoryIcon.tsx      # Dynamic icons for civic categories
        ├── TimelineView.tsx      # Lifecycle stepper and chronological audit logs
        ├── CitizenPortal.tsx     # Citizen dashboard, metrics, and request card list
        ├── CitizenRequestForm.tsx# Multi-step incident reporting wizard with GPS simulator
        ├── AdminDashboard.tsx    # Municipal operations desk with filters, table, and triage
        ├── AnalyticsDashboard.tsx# Open vs Resolved ratio, category bars, and ward hotspots
        ├── PublicTracker.tsx     # Public reference code lookup
        ├── RequestDetailModal.tsx# Inspection drawer for details, actions, and citizen feedback
        ├── ResolutionCertificate.tsx# Official printable completion certificate
        ├── EmergencyHotlines.tsx # Emergency contacts, Service Charter SLAs, and FAQs
        └── ToastContainer.tsx    # Floating toast alert manager
```

---

---

##  Setup & Local Execution

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

3. **Production Build:**
   ```bash
   npm run build
   ```

---

##  License
Apache-2.0 License. Developed for municipal civic engagement and public service transparency.

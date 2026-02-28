# MediConnect Frontend

Production-grade React frontend for the MediConnect healthcare SaaS, aligned with the [mediconnect-backend](../mediconnect-backend) API.

## Tech Stack

- **React 18** + **Vite**
- **Tailwind CSS** (primary: blue-600, secondary: teal)
- **React Router v6**
- **Axios** (base URL `/api`, proxy to gateway)
- **Context API** (auth)
- **Lucide React** (icons)
- **Recharts** (charts)
- **React Hook Form** (optional, used where needed)
- **React Hot Toast** (notifications)

## Project Structure

```
src/
  api/           # axios instance, auth API, service APIs
  components/
    ui/          # Button, Input, Card, Badge, Modal, Loader
    layout/      # PublicNavbar, DashboardLayout (sidebar + top bar)
  context/       # AuthContext
  pages/
    public/      # Landing, Login, Register
    patient/     # Dashboard, Appointments, Health Records, etc.
    doctor/      # Dashboard, Prescriptions, Availability, Profile
    pharmacist/  # Dashboard, Inventory
    lab/         # Dashboard, Bookings, Upload report
    admin/       # Dashboard (placeholder)
  routes/        # ProtectedRoute (role-based)
  constants/     # API_BASE, ROLES, DEFAULT_ROUTE_BY_ROLE
```

## Backend Alignment

- **API base**: `/api` (Vite proxy in dev → `http://localhost:8080`).
- **Auth**: `POST /api/auth/login`, `register`, `otp/send`, `otp/verify`, `refresh`. Token response: `accessToken`, `refreshToken`, `userId`, `email`, `roles`.
- **Roles**: `PATIENT`, `DOCTOR`, `PHARMACIST`, `LAB_TECH`, `ADMIN` (matches backend `UserType`).
- **Headers**: `Authorization: Bearer <accessToken>`, `X-User-Id: <userId>` (for /me/* and patient/doctor endpoints).
- **Patient**: Dashboard from `GET /api/patients/me/dashboard`; consent from `/api/patients/me/consent`; appointments from `GET /api/appointments/patient/:id`; orders from `GET /api/pharmacy/orders/patient/:id`.
- **Doctor**: Profile/slots/prescriptions via `GET/POST/PUT /api/doctors/me/*`.
- **Appointments**: `POST /api/appointments/book` (patientUserId, doctorProfileId, slotId, slotDate, …).
- **Pharmacy**: `GET/POST /api/pharmacy/inventory`, `GET /api/pharmacy/orders/patient/:id`, `PATCH /api/pharmacy/orders/:id/status`.
- **Lab**: `POST /api/lab/bookings`, `GET /api/lab/bookings/patient/:id`, `POST /api/lab/reports/upload`.

## Run

1. **Backend**: Start API Gateway and services (see [mediconnect-backend/README.md](../mediconnect-backend/README.md)). Gateway should be at `http://localhost:8080`.

2. **Frontend**:
   ```bash
   npm install
   npm run dev
   ```
   App runs at `http://localhost:5173`. Vite proxies `/api` to `http://localhost:8080`.

3. **Build**:
   ```bash
   npm run build
   npm run preview
   ```
   For production, set the API base (e.g. env `VITE_API_URL`) and point Axios to it instead of `/api` if not using the same origin.

## Environment

- `VITE_API_URL`: optional; if set, `src/constants/index.js` can export `API_BASE = import.meta.env.VITE_API_URL || '/api'` for production.

## Features

- **Public**: Landing, Login (password + OTP), Register (role selection).
- **Auth**: JWT in localStorage; axios interceptor adds `Authorization` and `X-User-Id`; 401 triggers refresh then redirect to login.
- **Role-based routes**: Patient, Doctor, Pharmacist, Lab, Admin dashboards with sidebar and protected routes.
- **Patient**: Dashboard (risk scores, timeline, consents), Appointments (list + book), Health Records (timeline filter), Medicine Orders (from pharmacy API), Risk Assessment (Recharts), Remote Monitoring/Emergency placeholders, Profile.
- **Doctor**: Profile CRUD, Availability slots (load + create), Create prescription (triggers Kafka).
- **Pharmacist**: Inventory (list + add); incoming prescriptions described as Kafka-driven (no list API yet).
- **Lab**: Test bookings (create + list by patient), Upload report (abnormal detection + Kafka event).
- **Admin**: Placeholder for user management and analytics.

## Styling

- Tailwind with `primary` (blue-600) and `secondary` (teal).
- Cards: white, `shadow-md`, `rounded-xl`.
- Transitions: `transition-soft` (200ms).
- Responsive, mobile-first; collapsible sidebar and mobile drawer.

## License

Proprietary – MediConnect.

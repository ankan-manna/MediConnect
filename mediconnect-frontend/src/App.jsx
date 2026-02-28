import { useMemo } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { ROLES } from './constants'

// Layouts
import { PublicNavbar } from './components/layout/PublicNavbar'
import { DashboardLayout } from './components/layout/DashboardLayout'

// Public
import { LandingPage } from './pages/public/LandingPage'
import { LoginPage } from './pages/public/LoginPage'
import { RegisterPage } from './pages/public/RegisterPage'

// Patient
import { PatientDashboard } from './pages/patient/PatientDashboard'
import { PatientAppointments } from './pages/patient/PatientAppointments'
import { PatientHealthRecords } from './pages/patient/PatientHealthRecords'
import { PatientPrescriptions } from './pages/patient/PatientPrescriptions'
import { PatientLabReports } from './pages/patient/PatientLabReports'
import { PatientMedicineOrders } from './pages/patient/PatientMedicineOrders'
import { PatientRiskAssessment } from './pages/patient/PatientRiskAssessment'
import { PatientRemoteMonitoring } from './pages/patient/PatientRemoteMonitoring'
import { PatientEmergency } from './pages/patient/PatientEmergency'
import { PatientProfile } from './pages/patient/PatientProfile'
import { PatientBookAppointment } from './pages/patient/PatientBookAppointment'

// Doctor
import { DoctorDashboard } from './pages/doctor/DoctorDashboard'
import { DoctorAppointments } from './pages/doctor/DoctorAppointments'
import { DoctorPrescriptions } from './pages/doctor/DoctorPrescriptions'
import { DoctorAvailability } from './pages/doctor/DoctorAvailability'
import { DoctorProfile } from './pages/doctor/DoctorProfile'

// Pharmacist
import { PharmacistDashboard } from './pages/pharmacist/PharmacistDashboard'
import { PharmacistInventory } from './pages/pharmacist/PharmacistInventory'

// Lab
import { LabDashboard } from './pages/lab/LabDashboard'
import { LabBookings } from './pages/lab/LabBookings'
import { LabUpload } from './pages/lab/LabUpload'

// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard'

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />
      {children}
    </div>
  )
}

function RoleRedirect() {
  const { getDefaultRoute } = useAuth()
  const to = getDefaultRoute()
  return <Navigate to={to} replace />
}

export default function App() {
  const patientRoles = useMemo(() => [ROLES.PATIENT], [])
  const doctorRoles = useMemo(() => [ROLES.DOCTOR], [])
  const pharmacistRoles = useMemo(() => [ROLES.PHARMACIST], [])
  const labRoles = useMemo(() => [ROLES.LAB_TECH], [])
  const adminRoles = useMemo(() => [ROLES.ADMIN], [])

  return (
    <Routes>
      <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />

      <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

      <Route element={<ProtectedRoute allowedRoles={patientRoles}><DashboardLayout /></ProtectedRoute>}>
        <Route path="patient/dashboard" element={<PatientDashboard />} />
        <Route path="patient/appointments" element={<PatientAppointments />} />
        <Route path="patient/book-appointment" element={<PatientBookAppointment />} />
        <Route path="patient/health-records" element={<PatientHealthRecords />} />
        <Route path="patient/prescriptions" element={<PatientPrescriptions />} />
        <Route path="patient/lab-reports" element={<PatientLabReports />} />
        <Route path="patient/medicine-orders" element={<PatientMedicineOrders />} />
        <Route path="patient/risk-assessment" element={<PatientRiskAssessment />} />
        <Route path="patient/remote-monitoring" element={<PatientRemoteMonitoring />} />
        <Route path="patient/emergency" element={<PatientEmergency />} />
        <Route path="patient/profile" element={<PatientProfile />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={doctorRoles}><DashboardLayout /></ProtectedRoute>}>
        <Route path="doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="doctor/appointments" element={<DoctorAppointments />} />
        <Route path="doctor/patient-records" element={<div className="p-4">Patient Records (placeholder)</div>} />
        <Route path="doctor/prescriptions" element={<DoctorPrescriptions />} />
        <Route path="doctor/availability" element={<DoctorAvailability />} />
        <Route path="doctor/profile" element={<DoctorProfile />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={pharmacistRoles}><DashboardLayout /></ProtectedRoute>}>
        <Route path="pharmacist/dashboard" element={<PharmacistDashboard />} />
        <Route path="pharmacist/prescriptions" element={<PharmacistDashboard />} />
        <Route path="pharmacist/inventory" element={<PharmacistInventory />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={labRoles}><DashboardLayout /></ProtectedRoute>}>
        <Route path="lab/dashboard" element={<LabDashboard />} />
        <Route path="lab/bookings" element={<LabBookings />} />
        <Route path="lab/upload" element={<LabUpload />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={adminRoles}><DashboardLayout /></ProtectedRoute>}>
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/users" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

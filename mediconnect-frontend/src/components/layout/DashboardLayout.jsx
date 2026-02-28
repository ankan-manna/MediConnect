import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  ShoppingCart,
  Activity,
  Radio,
  AlertCircle,
  User,
  Menu,
  X,
  Bell,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import { ROLES, ROLE_LABELS } from '../../constants'

const patientNav = [
  { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
  { to: '/patient/health-records', label: 'Health Records', icon: FileText },
  { to: '/patient/prescriptions', label: 'Prescriptions', icon: Pill },
  { to: '/patient/lab-reports', label: 'Lab Reports', icon: FlaskConical },
  { to: '/patient/medicine-orders', label: 'Medicine Orders', icon: ShoppingCart },
  { to: '/patient/risk-assessment', label: 'Risk Assessment', icon: Activity },
  { to: '/patient/remote-monitoring', label: 'Remote Monitoring', icon: Radio },
  { to: '/patient/emergency', label: 'Emergency', icon: AlertCircle },
  { to: '/patient/profile', label: 'Profile', icon: User },
]

const doctorNav = [
  { to: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
  { to: '/doctor/patient-records', label: 'Patient Records', icon: FileText },
  { to: '/doctor/prescriptions', label: 'Prescriptions', icon: Pill },
  { to: '/doctor/availability', label: 'Availability', icon: Calendar },
  { to: '/doctor/profile', label: 'Profile', icon: User },
]

const pharmacistNav = [
  { to: '/pharmacist/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pharmacist/prescriptions', label: 'Incoming Prescriptions', icon: FileText },
  { to: '/pharmacist/inventory', label: 'Inventory', icon: Pill },
]

const labNav = [
  { to: '/lab/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/lab/bookings', label: 'Test Bookings', icon: Calendar },
  { to: '/lab/upload', label: 'Upload Report', icon: FileText },
]

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'User Management', icon: User },
]

function getNav(role) {
  if (role === ROLES.PATIENT) return patientNav
  if (role === ROLES.DOCTOR) return doctorNav
  if (role === ROLES.PHARMACIST) return pharmacistNav
  if (role === ROLES.LAB_TECH) return labNav
  if (role === ROLES.ADMIN) return adminNav
  return []
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const role = user?.roles?.[0]
  const navItems = getNav(role)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-semibold text-lg">
            <LayoutDashboard className="w-6 h-6" />
            MediConnect
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-soft ${
                  active ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r transform transition-transform lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <span className="font-semibold text-primary-600">Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative" aria-label="Notifications">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100"
              >
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                <span className="text-xs text-gray-500">({ROLE_LABELS[role]})</span>
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-1 w-48 py-1 bg-white rounded-xl shadow-lg border z-20">
                    <Link
                      to={role === ROLES.PATIENT ? '/patient/profile' : role === ROLES.DOCTOR ? '/doctor/profile' : '#'}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={() => { logout(); setProfileOpen(false); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

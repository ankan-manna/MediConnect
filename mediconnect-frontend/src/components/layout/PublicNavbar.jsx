import { Link } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'
import { Button } from '../ui/Button'

export function PublicNavbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-primary-600 font-semibold text-xl">
            <Stethoscope className="w-8 h-8" />
            MediConnect
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Book Appointment</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

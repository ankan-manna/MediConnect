import { Link } from 'react-router-dom'
import { Stethoscope, Calendar, FileText, Shield, Users, Zap } from 'lucide-react'
import { Button } from '../../components/ui/Button'

export function LandingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Your health, <span className="text-primary-600">connected</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Book appointments, manage prescriptions, view lab reports, and track your health—all in one place.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg">Book Appointment</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">Why MediConnect</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Calendar, title: 'Easy booking', text: 'Find doctors and book slots in minutes.' },
              { icon: FileText, title: 'Health records', text: 'Timeline of visits, prescriptions, and lab reports.' },
              { icon: Shield, title: 'Secure & private', text: 'Your data is protected with consent controls.' },
              { icon: Users, title: 'Trusted doctors', text: 'Verified profiles and specialties.' },
              { icon: Zap, title: 'Fast delivery', text: 'Prescriptions to pharmacy, reports to your dashboard.' },
              { icon: Stethoscope, title: 'Remote monitoring', text: 'Track vitals and risk scores at a glance.' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-6 rounded-xl border border-gray-100 bg-gray-50/50 hover:shadow-soft transition-soft">
                <Icon className="w-10 h-10 text-primary-600 mb-3" />
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">Create an account and book your first appointment today.</p>
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-gray-200 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MediConnect. Integrated Digital Healthcare Platform.
      </footer>
    </>
  )
}

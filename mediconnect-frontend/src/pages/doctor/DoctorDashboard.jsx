import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Calendar, User, FileText } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Loader } from '../../components/ui/Loader'
import { doctorApi } from '../../api/services'

export function DoctorDashboard() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    doctorApi
      .getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {
        setProfile(null)
        toast.error('Profile not found. Create your doctor profile first.')
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader size="lg" className="min-h-[40vh]" />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-50">
              <User className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Profile</p>
              <p className="font-semibold">{profile ? 'Active' : 'Not set'}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-50">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Today&apos;s appointments</p>
              <p className="font-semibold">—</p>
              <p className="text-xs text-gray-500">Backend: list by doctor placeholder</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Prescriptions</p>
              <p className="font-semibold">Create from Prescriptions</p>
            </div>
          </div>
        </Card>
      </div>
      {profile && (
        <Card>
          <h3 className="font-semibold mb-2">Your profile</h3>
          <p className="text-sm text-gray-600">{profile.specialization} · {profile.qualification}</p>
          {profile.consultationFee && <p className="text-sm text-gray-500 mt-1">Fee: {profile.consultationFee}</p>}
        </Card>
      )}
    </div>
  )
}

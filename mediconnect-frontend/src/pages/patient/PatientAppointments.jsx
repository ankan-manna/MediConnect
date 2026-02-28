import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Calendar, Plus } from 'lucide-react'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Loader } from '../../components/ui/Loader'
import { appointmentApi } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const STATUS_VARIANTS = {
  SCHEDULED: 'primary',
  CONFIRMED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'default',
  NO_SHOW: 'warning',
  EXPIRED: 'default',
}

export function PatientAppointments() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    appointmentApi
      .getByPatient(user.userId)
      .then((res) => setList(res.data || []))
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false))
  }, [user?.userId])

  if (loading) return <Loader size="lg" className="min-h-[40vh]" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <Link to="/patient/book-appointment">
          <Button>
            <Plus className="w-4 h-4 mr-2 inline" />
            Book appointment
          </Button>
        </Link>
      </div>

      <Card>
        {list.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No appointments yet. Book one from the doctor search.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {list.map((a) => (
              <li key={a.id} className="py-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">Doctor profile #{a.doctorProfileId}</p>
                  <p className="text-sm text-gray-500">
                    {a.slotDate} {a.slotStartTime} – {a.slotEndTime}
                    {a.reason && ` · ${a.reason}`}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANTS[a.status] || 'default'}>{a.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { appointmentApi } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

export function PatientBookAppointment() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [doctorProfileId, setDoctorProfileId] = useState('')
  const [slotId, setSlotId] = useState('')
  const [slotDate, setSlotDate] = useState('')
  const [slotStartTime, setSlotStartTime] = useState('')
  const [slotEndTime, setSlotEndTime] = useState('')
  const [reason, setReason] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user?.userId) return
    const body = {
      patientUserId: user.userId,
      doctorProfileId: Number(doctorProfileId),
      slotId: Number(slotId),
      slotDate,
      slotStartTime: slotStartTime || undefined,
      slotEndTime: slotEndTime || undefined,
      reason: reason || undefined,
    }
    setLoading(true)
    try {
      await appointmentApi.book(body)
      toast.success('Appointment booked')
      navigate('/patient/appointments')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Book appointment</h1>
      <p className="text-gray-600">Backend: GET /api/doctors/me/slots returns doctor slots. Use a known doctor profile ID and slot ID from the doctor service.</p>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <Input label="Doctor profile ID" type="number" value={doctorProfileId} onChange={(e) => setDoctorProfileId(e.target.value)} required />
          <Input label="Slot ID" type="number" value={slotId} onChange={(e) => setSlotId(e.target.value)} required />
          <Input label="Slot date (YYYY-MM-DD)" type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} required />
          <Input label="Start time (HH:mm)" type="time" value={slotStartTime} onChange={(e) => setSlotStartTime(e.target.value)} />
          <Input label="End time (HH:mm)" type="time" value={slotEndTime} onChange={(e) => setSlotEndTime(e.target.value)} />
          <Input label="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <Button type="submit" disabled={loading}>{loading ? 'Booking...' : 'Book'}</Button>
        </form>
      </Card>
    </div>
  )
}

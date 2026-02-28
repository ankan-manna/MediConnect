import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { labApi } from '../../api/services'

export function LabBookings() {
  const [patientUserId, setPatientUserId] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ patientUserId: '', testName: '', testCode: '', bookingDate: '', slotTime: '', status: 'SCHEDULED' })

  const loadBookings = () => {
    if (!patientUserId) return
    setLoading(true)
    labApi
      .getBookingsByPatient(Number(patientUserId))
      .then((res) => setList(res.data || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await labApi.createBooking({
        patientUserId: Number(form.patientUserId),
        testName: form.testName,
        testCode: form.testCode,
        bookingDate: form.bookingDate || undefined,
        slotTime: form.slotTime || undefined,
        status: form.status,
      })
      toast.success('Booking created')
      setForm({ patientUserId: '', testName: '', testCode: '', bookingDate: '', slotTime: '', status: 'SCHEDULED' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Test bookings</h1>
      <Card>
        <h3 className="font-semibold mb-4">Create booking</h3>
        <form onSubmit={handleCreate} className="flex flex-wrap gap-4 items-end">
          <Input label="Patient user ID" type="number" value={form.patientUserId} onChange={(e) => setForm((f) => ({ ...f, patientUserId: e.target.value }))} required />
          <Input label="Test name" value={form.testName} onChange={(e) => setForm((f) => ({ ...f, testName: e.target.value }))} />
          <Input label="Test code" value={form.testCode} onChange={(e) => setForm((f) => ({ ...f, testCode: e.target.value }))} />
          <Input label="Date" type="date" value={form.bookingDate} onChange={(e) => setForm((f) => ({ ...f, bookingDate: e.target.value }))} />
          <Input label="Time" type="time" value={form.slotTime} onChange={(e) => setForm((f) => ({ ...f, slotTime: e.target.value }))} />
          <Button type="submit" disabled={loading}>Create</Button>
        </form>
      </Card>
      <Card>
        <div className="flex gap-2 items-end mb-4">
          <Input label="Patient user ID" type="number" value={patientUserId} onChange={(e) => setPatientUserId(e.target.value)} />
          <Button onClick={loadBookings} disabled={loading}>Load bookings</Button>
        </div>
        {list.length === 0 && !loading && <p className="text-gray-500">Enter patient ID and click Load.</p>}
        {list.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {list.map((b) => (
              <li key={b.id} className="py-2 flex justify-between">
                <span>{b.testName} ({b.testCode}) – {b.bookingDate}</span>
                <span className="text-gray-500">{b.status}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

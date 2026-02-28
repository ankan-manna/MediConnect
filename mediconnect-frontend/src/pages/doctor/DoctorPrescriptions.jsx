import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { doctorApi } from '../../api/services'

export function DoctorPrescriptions() {
  const [patientUserId, setPatientUserId] = useState('')
  const [appointmentId, setAppointmentId] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }])
  const [loading, setLoading] = useState(false)

  const addItem = () => setItems((prev) => [...prev, { medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }])

  const updateItem = (i, field, value) => {
    setItems((prev) => {
      const next = [...prev]
      next[i] = { ...next[i], [field]: value }
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!patientUserId.trim()) {
      toast.error('Patient user ID required')
      return
    }
    setLoading(true)
    try {
      await doctorApi.createPrescription({
        patientUserId: Number(patientUserId),
        appointmentId: appointmentId ? Number(appointmentId) : undefined,
        diagnosis: diagnosis || undefined,
        notes: notes || undefined,
        items: items.filter((x) => x.medicineName.trim()),
      })
      toast.success('Prescription created. Pharmacy will receive it via Kafka.')
      setPatientUserId('')
      setAppointmentId('')
      setDiagnosis('')
      setNotes('')
      setItems([{ medicineName: '', dosage: '', frequency: '', duration: '', instructions: '' }])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create prescription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create prescription</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Patient user ID" type="number" value={patientUserId} onChange={(e) => setPatientUserId(e.target.value)} required />
          <Input label="Appointment ID (optional)" type="number" value={appointmentId} onChange={(e) => setAppointmentId(e.target.value)} />
          <Input label="Diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
          <Input label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Medicines</label>
              <Button type="button" variant="ghost" size="sm" onClick={addItem}>+ Add</Button>
            </div>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                <Input placeholder="Name" value={item.medicineName} onChange={(e) => updateItem(i, 'medicineName', e.target.value)} />
                <Input placeholder="Dosage" value={item.dosage} onChange={(e) => updateItem(i, 'dosage', e.target.value)} />
                <Input placeholder="Frequency" value={item.frequency} onChange={(e) => updateItem(i, 'frequency', e.target.value)} />
                <Input placeholder="Duration" value={item.duration} onChange={(e) => updateItem(i, 'duration', e.target.value)} />
                <Input placeholder="Instructions" value={item.instructions} onChange={(e) => updateItem(i, 'instructions', e.target.value)} />
              </div>
            ))}
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create prescription'}</Button>
        </form>
      </Card>
    </div>
  )
}

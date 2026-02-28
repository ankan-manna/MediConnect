import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Loader } from '../../components/ui/Loader'
import { doctorApi } from '../../api/services'

export function DoctorAvailability() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [creating, setCreating] = useState(false)
  const [slotDate, setSlotDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const loadSlots = useCallback(() => {
    if (!from || !to) return
    setLoading(true)
    doctorApi
      .getSlots(from, to)
      .then((res) => setSlots(res.data || []))
      .catch(() => toast.error('Failed to load slots'))
      .finally(() => setLoading(false))
  }, [from, to])

  useEffect(() => {
    const d = new Date()
    const f = d.toISOString().slice(0, 10)
    d.setDate(d.getDate() + 7)
    const t = d.toISOString().slice(0, 10)
    setFrom(f)
    setTo(t)
  }, [])

  useEffect(() => {
    if (from && to) loadSlots()
  }, [from, to, loadSlots])

  const handleCreateSlot = async (e) => {
    e.preventDefault()
    if (!slotDate || !startTime || !endTime) {
      toast.error('Date and times required')
      return
    }
    setCreating(true)
    try {
      await doctorApi.createSlot({ slotDate, startTime, endTime })
      toast.success('Slot created')
      setSlotDate('')
      setStartTime('')
      setEndTime('')
      loadSlots()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create slot')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
      <Card>
        <div className="flex flex-wrap gap-2 items-end mb-4">
          <Input label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <Input label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          <Button onClick={loadSlots} disabled={loading}>Load slots</Button>
        </div>
        {loading ? <Loader /> : (
          <ul className="divide-y divide-gray-100">
            {slots.length === 0 && <li className="py-4 text-gray-500">No slots in range. Add below.</li>}
            {slots.map((s) => (
              <li key={s.id} className="py-2 flex gap-4">
                <span>{s.slotDate}</span>
                <span>{s.startTime} – {s.endTime}</span>
                <span className="text-gray-500">{s.status}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card>
        <h3 className="font-semibold mb-4">Add slot</h3>
        <form onSubmit={handleCreateSlot} className="flex flex-wrap gap-4 items-end">
          <Input label="Date" type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} required />
          <Input label="Start" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          <Input label="End" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          <Button type="submit" disabled={creating}>{creating ? 'Adding...' : 'Add slot'}</Button>
        </form>
      </Card>
    </div>
  )
}

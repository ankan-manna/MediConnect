import { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { labApi } from '../../api/services'

export function LabUpload() {
  const [loading, setLoading] = useState(false)
  const [body, setBody] = useState({
    patientUserId: '',
    bookingId: '',
    testName: '',
    testCode: '',
    reportUrl: '',
    values: [
      { parameterName: 'Hb', value: '14', unit: 'g/dL', referenceRange: '12-16', abnormal: false },
      { parameterName: 'WBC', value: '12000', unit: '/µL', referenceRange: '4000-11000', abnormal: true },
    ],
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await labApi.uploadReport({
        ...body,
        patientUserId: body.patientUserId ? Number(body.patientUserId) : null,
        bookingId: body.bookingId ? Number(body.bookingId) : null,
      })
      toast.success('Report uploaded. Event published to lab-report-uploaded.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Upload report</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <Input label="Patient user ID" type="number" value={body.patientUserId} onChange={(e) => setBody((b) => ({ ...b, patientUserId: e.target.value }))} />
          <Input label="Booking ID" type="number" value={body.bookingId} onChange={(e) => setBody((b) => ({ ...b, bookingId: e.target.value }))} />
          <Input label="Test name" value={body.testName} onChange={(e) => setBody((b) => ({ ...b, testName: e.target.value }))} />
          <Input label="Test code" value={body.testCode} onChange={(e) => setBody((b) => ({ ...b, testCode: e.target.value }))} />
          <Input label="Report URL" value={body.reportUrl} onChange={(e) => setBody((b) => ({ ...b, reportUrl: e.target.value }))} placeholder="Optional" />
          <p className="text-sm text-gray-500">Values (abnormal flag triggers highlight): pre-filled sample. Backend detects abnormal and publishes event.</p>
          <Button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload report'}</Button>
        </form>
      </Card>
    </div>
  )
}

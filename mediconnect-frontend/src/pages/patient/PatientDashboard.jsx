import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Calendar, Activity, FileText, AlertTriangle } from 'lucide-react'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Loader } from '../../components/ui/Loader'
import { patientApi } from '../../api/services'

export function PatientDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    patientApi
      .getDashboard()
      .then((res) => {
        if (!cancelled) setData(res.data)
      })
      .catch(() => {
        if (!cancelled) toast.error('Failed to load dashboard')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) return <Loader size="lg" className="min-h-[40vh]" />
  if (!data) return <p className="text-gray-500">No data</p>

  const riskScores = data.riskScores || {}
  const recentTimeline = data.recentTimeline || []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-50">
              <Activity className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Risk score (Diabetes)</p>
              <p className="text-xl font-semibold">{((riskScores.DIABETES ?? 0) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Risk score (Heart)</p>
              <p className="text-xl font-semibold">{((riskScores.HEART ?? 0) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Risk score (Hypertension)</p>
              <p className="text-xl font-semibold">{((riskScores.HYPERTENSION ?? 0) * 100).toFixed(0)}%</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-green-50">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Timeline events</p>
              <p className="text-xl font-semibold">{recentTimeline.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Recent health timeline" />
          {recentTimeline.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent events. Appointments and lab reports will appear here.</p>
          ) : (
            <ul className="space-y-3">
              {recentTimeline.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{e.title || e.eventType}</p>
                    <p className="text-xs text-gray-500">{e.eventDate ? new Date(e.eventDate).toLocaleDateString() : ''}</p>
                  </div>
                  <Badge variant="primary">{e.eventType}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card>
          <CardHeader title="Active consents" />
          {(data.activeConsents || []).length === 0 ? (
            <p className="text-gray-500 text-sm">No active consents. Grant access to doctors or labs from Profile.</p>
          ) : (
            <ul className="space-y-2">
              {data.activeConsents.map((c) => (
                <li key={c.id} className="text-sm">
                  <Badge className="mr-2">{c.consentType}</Badge>
                  Granted to ID: {c.grantedToId}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  )
}

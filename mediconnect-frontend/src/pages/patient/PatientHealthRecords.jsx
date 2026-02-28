import { useState, useEffect } from 'react'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Loader } from '../../components/ui/Loader'
import { patientApi } from '../../api/services'

export function PatientHealthRecords() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    patientApi
      .getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader size="lg" className="min-h-[40vh]" />

  const timeline = data?.recentTimeline || []
  const filtered = filter === 'ALL' ? timeline : timeline.filter((e) => e.eventType === filter)
  const types = ['ALL', ...new Set(timeline.map((e) => e.eventType).filter(Boolean))]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
      <div className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-soft ${
              filter === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <Card>
        {filtered.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">No records to show. Timeline events appear after appointments and lab reports.</p>
        ) : (
          <ul className="space-y-4">
            {filtered.map((e) => (
              <li key={e.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{e.title || e.eventType}</p>
                  {e.description && <p className="text-sm text-gray-600 mt-1">{e.description}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {e.eventDate ? new Date(e.eventDate).toLocaleString() : ''} · {e.sourceService || '—'}
                  </p>
                </div>
                <Badge variant="primary">{e.eventType}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

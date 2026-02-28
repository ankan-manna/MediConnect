import { Card } from '../../components/ui/Card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const placeholderData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 118 },
  { name: 'Wed', value: 125 },
  { name: 'Thu', value: 122 },
  { name: 'Fri', value: 119 },
  { name: 'Sat', value: 121 },
  { name: 'Sun', value: 117 },
]

export function PatientRemoteMonitoring() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Remote Monitoring</h1>
      <p className="text-gray-600">Vitals from devices (BP, glucose, etc.) are stored in MongoDB. Backend: patient-service remote_monitoring collection.</p>
      <Card>
        <h3 className="font-semibold mb-4">Sample trend (placeholder)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={placeholderData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Card } from '../../components/ui/Card'
import { Loader } from '../../components/ui/Loader'
import { patientApi } from '../../api/services'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export function PatientRiskAssessment() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    patientApi
      .getDashboard()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader size="lg" className="min-h-[40vh]" />

  const riskScores = data?.riskScores || {}
  const chartData = [
    { name: 'Diabetes', value: (riskScores.DIABETES ?? 0) * 100 },
    { name: 'Heart', value: (riskScores.HEART ?? 0) * 100 },
    { name: 'Hypertension', value: (riskScores.HYPERTENSION ?? 0) * 100 },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Risk Assessment</h1>
      <p className="text-gray-600">Calculated from your remote monitoring data (e.g. glucose, BP). Backend: patient-service risk score logic.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Diabetes</p>
          <p className="text-2xl font-bold text-primary-600">{((riskScores.DIABETES ?? 0) * 100).toFixed(0)}%</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Heart</p>
          <p className="text-2xl font-bold text-amber-600">{((riskScores.HEART ?? 0) * 100).toFixed(0)}%</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Hypertension</p>
          <p className="text-2xl font-bold text-red-600">{((riskScores.HYPERTENSION ?? 0) * 100).toFixed(0)}%</p>
        </Card>
      </div>
      <Card>
        <h3 className="font-semibold mb-4">Score comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

import { Card } from '../../components/ui/Card'

export function LabDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Lab dashboard</h1>
      <Card>
        <p className="text-gray-600">Manage test bookings and upload reports. Use the sidebar: Test Bookings, Upload Report.</p>
      </Card>
    </div>
  )
}

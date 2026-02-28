import { Card } from '../../components/ui/Card'

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin dashboard</h1>
      <Card>
        <p className="text-gray-600">
          User management, profile verification, specialties, commission config, and usage analytics would go here. Backend does not yet expose admin APIs; these are placeholders for future endpoints.
        </p>
      </Card>
    </div>
  )
}

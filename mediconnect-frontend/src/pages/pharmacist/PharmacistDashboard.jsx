import { Card } from '../../components/ui/Card'

export function PharmacistDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pharmacist dashboard</h1>
      <Card>
        <p className="text-gray-600">
          Incoming prescriptions are received via Kafka (topic: prescription-created). The pharmacy service creates orders automatically. Backend does not expose a &quot;list incoming prescriptions&quot; API; orders are listed per patient. For a full pharmacist view, backend could add GET /api/pharmacy/orders (all or by status).
        </p>
      </Card>
    </div>
  )
}

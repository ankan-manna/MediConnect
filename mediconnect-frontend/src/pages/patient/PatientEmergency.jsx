import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { AlertCircle, Phone } from 'lucide-react'

export function PatientEmergency() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Emergency</h1>
      <Card className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Emergency button</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          In production this would trigger the emergency-triggered Kafka event; notification-service would send alerts and optionally contact ambulance.
        </p>
        <Button variant="danger" size="lg">
          <Phone className="w-5 h-5 mr-2 inline" />
          Call for help
        </Button>
      </Card>
      <Card>
        <h3 className="font-semibold mb-2">Nearby hospitals (placeholder)</h3>
        <p className="text-sm text-gray-500">List would be loaded from a location/nearby API.</p>
      </Card>
    </div>
  )
}

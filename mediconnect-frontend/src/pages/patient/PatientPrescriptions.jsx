import { Card } from '../../components/ui/Card'

export function PatientPrescriptions() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
      <Card>
        <p className="text-gray-500 text-center py-12">
          Prescriptions from your doctor visits will appear here. Backend stores them in MongoDB and publishes to pharmacy.
        </p>
      </Card>
    </div>
  )
}

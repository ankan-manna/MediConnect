import { Card } from '../../components/ui/Card'

export function PatientLabReports() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Lab Reports</h1>
      <Card>
        <p className="text-gray-500 text-center py-12">
          Lab reports uploaded by the lab will appear here. Use Lab dashboard to upload; reports are stored in MongoDB.
        </p>
      </Card>
    </div>
  )
}

import { Card } from '../../components/ui/Card'

export function DoctorAppointments() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
      <Card>
        <p className="text-gray-500">
          Backend currently exposes appointments by patient (GET /api/appointments/patient/{'{patientUserId}'}). A future endpoint could return today&apos;s appointments by doctor.
        </p>
      </Card>
    </div>
  )
}

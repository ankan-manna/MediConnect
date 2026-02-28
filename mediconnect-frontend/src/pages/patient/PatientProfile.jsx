import { useAuth } from '../../context/AuthContext'
import { Card } from '../../components/ui/Card'
import { ROLE_LABELS } from '../../constants'

export function PatientProfile() {
  const { user } = useAuth()
  const role = user?.roles?.[0]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <Card>
        <dl className="grid sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="font-medium">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">User ID</dt>
            <dd className="font-medium">{user?.userId}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="font-medium">{ROLE_LABELS[role]}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm text-gray-500">Consent management: use GET/POST/DELETE /api/patients/me/consent from backend.</p>
      </Card>
    </div>
  )
}

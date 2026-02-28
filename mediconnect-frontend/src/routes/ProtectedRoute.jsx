import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../constants'
import { PageLoader } from '../components/ui/Loader'

const ROLE_PATHS = {
  [ROLES.PATIENT]: '/patient',
  [ROLES.DOCTOR]: '/doctor',
  [ROLES.PHARMACIST]: '/pharmacist',
  [ROLES.LAB_TECH]: '/lab',
  [ROLES.ADMIN]: '/admin',
}

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && allowedRoles.length && !allowedRoles.some((r) => user.roles?.includes(r))) {
    const defaultPath = ROLE_PATHS[user.roles?.[0]] || '/login'
    return <Navigate to={defaultPath} replace />
  }

  return children
}

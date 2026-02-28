// Backend API base (Vite proxy forwards /api to gateway at 8080)
export const API_BASE = '/api'

// Backend role names (UserType)
export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  PHARMACIST: 'PHARMACIST',
  LAB_TECH: 'LAB_TECH',
  ADMIN: 'ADMIN',
}

export const ROLE_LABELS = {
  [ROLES.PATIENT]: 'Patient',
  [ROLES.DOCTOR]: 'Doctor',
  [ROLES.PHARMACIST]: 'Pharmacist',
  [ROLES.LAB_TECH]: 'Lab',
  [ROLES.ADMIN]: 'Admin',
}

// Default redirect path after login by role
export const DEFAULT_ROUTE_BY_ROLE = {
  [ROLES.PATIENT]: '/patient/dashboard',
  [ROLES.DOCTOR]: '/doctor/dashboard',
  [ROLES.PHARMACIST]: '/pharmacist/dashboard',
  [ROLES.LAB_TECH]: '/lab/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
}

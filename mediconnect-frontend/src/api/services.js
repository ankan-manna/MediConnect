import api from './axios'

// Patient (backend: X-User-Id for /me/*)
export const patientApi = {
  getDashboard: () => api.get('/patients/me/dashboard'),
  getConsents: () => api.get('/patients/me/consent'),
  grantConsent: (body) => api.post('/patients/me/consent', body),
  revokeConsent: (consentId) => api.delete(`/patients/me/consent/${consentId}`),
}

// Doctor
export const doctorApi = {
  getProfile: () => api.get('/doctors/me/profile'),
  createProfile: (body) => api.post('/doctors/me/profile', body),
  updateProfile: (body) => api.put('/doctors/me/profile', body),
  getSlots: (from, to) => api.get('/doctors/me/slots', { params: { from, to } }),
  createSlot: (body) => api.post('/doctors/me/slots', body),
  createPrescription: (body) => api.post('/doctors/me/prescriptions', body),
}

// Appointments
export const appointmentApi = {
  book: (body) => api.post('/appointments/book', body),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  getByPatient: (patientUserId) => api.get(`/appointments/patient/${patientUserId}`),
}

// Pharmacy
export const pharmacyApi = {
  listInventory: () => api.get('/pharmacy/inventory'),
  addInventory: (body) => api.post('/pharmacy/inventory', body),
  getOrdersByPatient: (patientUserId, size = 20) =>
    api.get(`/pharmacy/orders/patient/${patientUserId}`, { params: { size } }),
  updateOrderStatus: (id, status) => api.patch(`/pharmacy/orders/${id}/status`, { status }),
}

// Lab
export const labApi = {
  createBooking: (body) => api.post('/lab/bookings', body),
  getBookingsByPatient: (patientUserId, size = 20) =>
    api.get(`/lab/bookings/patient/${patientUserId}`, { params: { size } }),
  uploadReport: (body) => api.post('/lab/reports/upload', body),
}

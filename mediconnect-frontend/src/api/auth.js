import api from './axios'

export const authApi = {
  login: (body) => api.post('/auth/login', body),
  register: (body) => api.post('/auth/register', body),
  sendOtp: (body) => api.post('/auth/otp/send', body),
  verifyOtp: (body) => api.post('/auth/otp/verify', body),
  refresh: (body) => api.post('/auth/refresh', body),
  linkAbha: (body) => api.post('/auth/abha/link', body),
}

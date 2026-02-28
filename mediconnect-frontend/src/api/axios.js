import axios from 'axios'
import { API_BASE } from '../constants'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Request: attach JWT and X-User-Id (backend expects X-User-Id for some endpoints when using gateway)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const userId = localStorage.getItem('userId')
    if (userId) {
      config.headers['X-User-Id'] = userId
    }
    return config
  },
  (err) => Promise.reject(err)
)

// Response: 401 → try refresh token, then redirect to login
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refreshToken')
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken: refresh })
          localStorage.setItem('accessToken', data.accessToken)
          if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
          if (data.userId) localStorage.setItem('userId', String(data.userId))
          original.headers.Authorization = `Bearer ${data.accessToken}`
          return api(original)
        } catch (e) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('userId')
          localStorage.removeItem('email')
          localStorage.removeItem('roles')
          window.location.href = '/login'
        }
      } else {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

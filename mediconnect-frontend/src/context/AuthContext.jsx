import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi } from '../api/auth'
import { DEFAULT_ROUTE_BY_ROLE, ROLES } from '../constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadFromStorage = useCallback(() => {
    const accessToken = localStorage.getItem('accessToken')
    const userId = localStorage.getItem('userId')
    const email = localStorage.getItem('email')
    const rolesStr = localStorage.getItem('roles')
    if (accessToken && userId) {
      const roles = rolesStr ? JSON.parse(rolesStr) : []
      setUser({ userId: Number(userId), email, roles, accessToken })
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    loadFromStorage()
    setLoading(false)
  }, [loadFromStorage])

  const login = useCallback(async (emailOrPhone, password) => {
    const { data } = await authApi.login({ emailOrPhone, password })
    const roles = data.roles ? Array.from(data.roles) : []
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('userId', String(data.userId))
    localStorage.setItem('email', data.email || '')
    localStorage.setItem('roles', JSON.stringify(roles))
    setUser({ userId: data.userId, email: data.email, roles, accessToken: data.accessToken })
    return data
  }, [])

  const loginWithOtp = useCallback(async (phoneOrEmail, otp) => {
    const { data } = await authApi.verifyOtp({ phoneOrEmail, otp })
    const roles = data.roles ? Array.from(data.roles) : []
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('userId', String(data.userId))
    localStorage.setItem('email', data.email || '')
    localStorage.setItem('roles', JSON.stringify(roles))
    setUser({ userId: data.userId, email: data.email, roles, accessToken: data.accessToken })
    return data
  }, [])

  const sendOtp = useCallback(async (phoneOrEmail, channel = 'sms') => {
    await authApi.sendOtp({ phoneOrEmail, channel })
  }, [])

  const register = useCallback(async (body) => {
    const { data } = await authApi.register(body)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    localStorage.removeItem('roles')
    setUser(null)
  }, [])

  const getDefaultRoute = useCallback(() => {
    if (!user?.roles?.length) return '/login'
    const role = user.roles[0]
    return DEFAULT_ROUTE_BY_ROLE[role] || '/login'
  }, [user])

  const hasRole = useCallback(
    (role) => user?.roles?.includes(role),
    [user]
  )

  const value = {
    user,
    loading,
    login,
    loginWithOtp,
    sendOtp,
    register,
    logout,
    getDefaultRoute,
    hasRole,
    isAuthenticated: !!user?.userId,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

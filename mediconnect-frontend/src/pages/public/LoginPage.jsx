import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function LoginPage() {
  const [mode, setMode] = useState('password') // 'password' | 'otp'
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, loginWithOtp, sendOtp, getDefaultRoute } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || getDefaultRoute()

  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    if (!emailOrPhone.trim() || !password) {
      toast.error('Enter email/phone and password')
      return
    }
    setLoading(true)
    try {
      await login(emailOrPhone.trim(), password)
      toast.success('Logged in successfully')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!emailOrPhone.trim()) {
      toast.error('Enter email or phone')
      return
    }
    setLoading(true)
    try {
      await sendOtp(emailOrPhone.trim(), 'sms')
      setOtpSent(true)
      toast.success('OTP sent')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpLogin = async (e) => {
    e.preventDefault()
    if (!emailOrPhone.trim() || !otp.trim()) {
      toast.error('Enter email/phone and OTP')
      return
    }
    setLoading(true)
    try {
      await loginWithOtp(emailOrPhone.trim(), otp.trim())
      toast.success('Logged in successfully')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
        <p className="mt-1 text-sm text-gray-600">Use your email or phone to continue.</p>

        <div className="flex rounded-xl bg-gray-100 p-1 mt-6">
          <button
            type="button"
            onClick={() => setMode('password')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-soft ${mode === 'password' ? 'bg-white shadow text-primary-600' : 'text-gray-600'}`}
          >
            Password
          </button>
          <button
            type="button"
            onClick={() => setMode('otp')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-soft ${mode === 'otp' ? 'bg-white shadow text-primary-600' : 'text-gray-600'}`}
          >
            OTP
          </button>
        </div>

        {mode === 'password' ? (
          <form onSubmit={handlePasswordLogin} className="mt-6 space-y-4">
            <Input
              label="Email or phone"
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="you@example.com or +91..."
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <Input
              label="Email or phone"
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="you@example.com or +91..."
              disabled={otpSent}
            />
            {!otpSent ? (
              <Button onClick={handleSendOtp} className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </Button>
            ) : (
              <form onSubmit={handleOtpLogin} className="space-y-4">
                <Input
                  label="OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & sign in'}
                </Button>
                <button type="button" onClick={() => setOtpSent(false)} className="text-sm text-primary-600 hover:underline">
                  Use different number
                </button>
              </form>
            )}
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

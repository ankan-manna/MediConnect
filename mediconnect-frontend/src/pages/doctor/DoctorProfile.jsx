import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Loader } from '../../components/ui/Loader'
import { doctorApi } from '../../api/services'

export function DoctorProfile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ qualification: '', specialization: '', registrationNumber: '', bio: '', consultationFee: '' })

  useEffect(() => {
    doctorApi
      .getProfile()
      .then((res) => {
        setProfile(res.data)
        setForm({
          qualification: res.data.qualification || '',
          specialization: res.data.specialization || '',
          registrationNumber: res.data.registrationNumber || '',
          bio: res.data.bio || '',
          consultationFee: res.data.consultationFee || '',
        })
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (profile?.id) {
        await doctorApi.updateProfile(form)
        toast.success('Profile updated')
      } else {
        await doctorApi.createProfile(form)
        toast.success('Profile created')
      }
      setEditing(false)
      const { data } = await doctorApi.getProfile()
      setProfile(data)
      setForm({
        qualification: data.qualification || '',
        specialization: data.specialization || '',
        registrationNumber: data.registrationNumber || '',
        bio: data.bio || '',
        consultationFee: data.consultationFee || '',
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    }
  }

  if (loading) return <Loader size="lg" className="min-h-[40vh]" />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <Card>
        {!profile && !editing ? (
          <div>
            <p className="text-gray-500 mb-4">You don&apos;t have a doctor profile yet.</p>
            <Button onClick={() => setEditing(true)}>Create profile</Button>
          </div>
        ) : editing ? (
          <form onSubmit={handleSave} className="space-y-4 max-w-md">
            <Input label="Qualification" value={form.qualification} onChange={(e) => setForm((f) => ({ ...f, qualification: e.target.value }))} />
            <Input label="Specialization" value={form.specialization} onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))} />
            <Input label="Registration number" value={form.registrationNumber} onChange={(e) => setForm((f) => ({ ...f, registrationNumber: e.target.value }))} />
            <Input label="Bio" value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
            <Input label="Consultation fee" value={form.consultationFee} onChange={(e) => setForm((f) => ({ ...f, consultationFee: e.target.value }))} />
            <div className="flex gap-2">
              <Button type="submit">Save</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div>
            <dl className="grid sm:grid-cols-2 gap-4">
              <div><dt className="text-sm text-gray-500">Qualification</dt><dd>{profile.qualification || '—'}</dd></div>
              <div><dt className="text-sm text-gray-500">Specialization</dt><dd>{profile.specialization || '—'}</dd></div>
              <div><dt className="text-sm text-gray-500">Registration</dt><dd>{profile.registrationNumber || '—'}</dd></div>
              <div><dt className="text-sm text-gray-500">Consultation fee</dt><dd>{profile.consultationFee || '—'}</dd></div>
            </dl>
            {profile.bio && <p className="mt-4 text-gray-600">{profile.bio}</p>}
            <Button className="mt-4" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
          </div>
        )}
      </Card>
    </div>
  )
}

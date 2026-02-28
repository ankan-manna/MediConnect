import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Loader } from '../../components/ui/Loader'
import { pharmacyApi } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

export function PatientMedicineOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return
    pharmacyApi
      .getOrdersByPatient(user.userId)
      .then((res) => setOrders(res.data || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [user?.userId])

  if (loading) return <Loader size="lg" className="min-h-[40vh]" />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medicine Orders</h1>
      <Card>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No orders yet. Orders are created when a prescription is sent to the pharmacy.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {orders.map((o) => (
              <li key={o.id} className="py-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">Order #{o.id}</p>
                  <p className="text-sm text-gray-500">
                    Prescription: {o.prescriptionId || '—'} · {o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}
                  </p>
                  {o.items?.length > 0 && (
                    <p className="text-xs text-gray-600 mt-1">
                      {o.items.map((i) => i.medicineName).join(', ')}
                    </p>
                  )}
                </div>
                <Badge>{o.status}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

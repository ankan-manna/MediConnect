import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Loader } from '../../components/ui/Loader'
import { pharmacyApi } from '../../api/services'

export function PharmacistInventory() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ medicineSku: '', medicineName: '', quantity: '', unit: '', pricePerUnit: '' })

  useEffect(() => {
    pharmacyApi
      .listInventory()
      .then((res) => setList(res.data || []))
      .catch(() => toast.error('Failed to load inventory'))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setAdding(true)
    try {
      await pharmacyApi.addInventory({
        medicineSku: form.medicineSku.trim(),
        medicineName: form.medicineName.trim(),
        quantity: form.quantity ? Number(form.quantity) : 0,
        unit: form.unit.trim() || undefined,
        pricePerUnit: form.pricePerUnit ? Number(form.pricePerUnit) : undefined,
      })
      toast.success('Item added')
      setForm({ medicineSku: '', medicineName: '', quantity: '', unit: '', pricePerUnit: '' })
      const { data } = await pharmacyApi.listInventory()
      setList(data || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <Loader size="lg" className="min-h-[40vh]" />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
      <Card>
        <h3 className="font-semibold mb-4">Add item</h3>
        <form onSubmit={handleAdd} className="flex flex-wrap gap-4 items-end max-w-3xl">
          <Input label="SKU" value={form.medicineSku} onChange={(e) => setForm((f) => ({ ...f, medicineSku: e.target.value }))} required />
          <Input label="Name" value={form.medicineName} onChange={(e) => setForm((f) => ({ ...f, medicineName: e.target.value }))} />
          <Input label="Quantity" type="number" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))} />
          <Input label="Unit" value={form.unit} onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))} />
          <Input label="Price/unit" type="number" step="0.01" value={form.pricePerUnit} onChange={(e) => setForm((f) => ({ ...f, pricePerUnit: e.target.value }))} />
          <Button type="submit" disabled={adding}>{adding ? 'Adding...' : 'Add'}</Button>
        </form>
      </Card>
      <Card>
        <h3 className="font-semibold mb-4">Current inventory</h3>
        {list.length === 0 ? (
          <p className="text-gray-500">No items. Add above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">SKU</th>
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Qty</th>
                  <th className="text-left py-2">Unit</th>
                  <th className="text-left py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {list.map((i) => (
                  <tr key={i.id} className="border-b border-gray-100">
                    <td className="py-2">{i.medicineSku}</td>
                    <td className="py-2">{i.medicineName}</td>
                    <td className="py-2">{i.quantity}</td>
                    <td className="py-2">{i.unit}</td>
                    <td className="py-2">{i.pricePerUnit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

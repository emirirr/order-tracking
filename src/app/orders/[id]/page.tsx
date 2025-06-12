'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  deliveryDate: string
  deliveryAddress: string
  notes: string
  customer: {
    name: string
    email: string
    phone: string
  }
  items: {
    product: {
      name: string
      category: string
    }
    quantity: number
    price: number
  }[]
  production: {
    status: string
    startTime: string | null
    endTime: string | null
    notes: string | null
  }
}

export default function OrderDetails() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchOrderDetails()
  }, [params.id])

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${params.id}`)
      const data = await response.json()
      setOrder(data)
      setLoading(false)
    } catch (error) {
      console.error('Sipariş detayları alınamadı:', error)
      setLoading(false)
    }
  }

  const updateProductionStatus = async (status: string) => {
    if (!order) return
    
    setUpdating(true)
    try {
      const response = await fetch('/api/production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: order.id,
          status,
          startTime: status === 'IN_PROGRESS' ? new Date().toISOString() : undefined,
          endTime: status === 'COMPLETED' ? new Date().toISOString() : undefined
        })
      })

      if (response.ok) {
        fetchOrderDetails()
      }
    } catch (error) {
      console.error('Üretim durumu güncellenemedi:', error)
    }
    setUpdating(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500'
      case 'CONFIRMED':
        return 'bg-blue-500'
      case 'IN_PRODUCTION':
        return 'bg-purple-500'
      case 'READY_FOR_DELIVERY':
        return 'bg-green-500'
      case 'OUT_FOR_DELIVERY':
        return 'bg-indigo-500'
      case 'DELIVERED':
        return 'bg-gray-500'
      case 'CANCELLED':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-red-500">Sipariş bulunamadı</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sipariş Detayları</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Geri Dön
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{order.orderNumber}</h2>
                  <p className="text-gray-400">{order.customer.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Müşteri Bilgileri</p>
                  <p className="font-bold">{order.customer.name}</p>
                  <p className="text-gray-400">{order.customer.email}</p>
                  <p className="text-gray-400">{order.customer.phone}</p>
                </div>

                <div>
                  <p className="text-gray-400">Teslimat Bilgileri</p>
                  <p className="font-bold">
                    {new Date(order.deliveryDate).toLocaleDateString('tr-TR')}
                  </p>
                  <p className="text-gray-400">{order.deliveryAddress}</p>
                </div>

                {order.notes && (
                  <div>
                    <p className="text-gray-400">Notlar</p>
                    <p className="text-gray-400">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Ürünler</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{item.product.name}</p>
                      <p className="text-sm text-gray-400">
                        {item.price.toLocaleString('tr-TR')} TL x {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold">
                      {(item.price * item.quantity).toLocaleString('tr-TR')} TL
                    </p>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <p className="font-bold">Toplam</p>
                    <p className="font-bold">{order.totalAmount.toLocaleString('tr-TR')} TL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Üretim Durumu</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400">Durum</p>
                  <p className="font-bold">{order.production.status}</p>
                </div>

                {order.production.startTime && (
                  <div>
                    <p className="text-gray-400">Başlangıç</p>
                    <p className="font-bold">
                      {new Date(order.production.startTime).toLocaleString('tr-TR')}
                    </p>
                  </div>
                )}

                {order.production.endTime && (
                  <div>
                    <p className="text-gray-400">Bitiş</p>
                    <p className="font-bold">
                      {new Date(order.production.endTime).toLocaleString('tr-TR')}
                    </p>
                  </div>
                )}

                {order.production.notes && (
                  <div>
                    <p className="text-gray-400">Notlar</p>
                    <p className="text-gray-400">{order.production.notes}</p>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4">
                  <h3 className="font-bold mb-4">Durum Güncelle</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateProductionStatus('IN_PROGRESS')}
                      disabled={updating || order.production.status === 'IN_PROGRESS'}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                      Üretime Başla
                    </button>
                    <button
                      onClick={() => updateProductionStatus('COMPLETED')}
                      disabled={updating || order.production.status === 'COMPLETED'}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                      Üretimi Tamamla
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
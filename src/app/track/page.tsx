'use client'

import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'

interface Order {
  id: string
  customerName: string
  status: string
  createdAt: string
  products: {
    name: string
    quantity: number
  }[]
  estimatedDeliveryTime?: string
  notes?: string
}

const statusSteps = [
  { id: 'PENDING', label: 'Sipariş Alındı' },
  { id: 'IN_PRODUCTION', label: 'Üretimde' },
  { id: 'READY_FOR_DELIVERY', label: 'Teslime Hazır' },
  { id: 'IN_DELIVERY', label: 'Teslimatta' },
  { id: 'DELIVERED', label: 'Teslim Edildi' }
]

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setOrder(null)

    try {
      const q = query(collection(db, 'orders'), where('id', '==', orderId))
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        setError('Sipariş bulunamadı. Lütfen sipariş numaranızı kontrol edin.')
        return
      }

      const orderData = querySnapshot.docs[0].data() as Order
      setOrder(orderData)
    } catch (error) {
      console.error('Error tracking order:', error)
      setError('Sipariş takibi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex(step => step.id === status)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Sipariş Takibi</h1>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleTrack} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="mb-4">
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
                Sipariş Numarası
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Sipariş numaranızı girin"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Aranıyor...' : 'Siparişi Takip Et'}
            </button>

            {error && (
              <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
          </form>

          {order && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Sipariş Detayları</h2>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Sipariş Durumu</h3>
                <div className="relative">
                  <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200"></div>
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, index) => {
                      const isCompleted = index <= getStatusIndex(order.status)
                      return (
                        <div key={step.id} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                          }`}>
                            {isCompleted ? (
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-sm text-gray-600">{index + 1}</span>
                            )}
                          </div>
                          <span className="mt-2 text-sm text-gray-600">{step.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Ürünler</h3>
                <ul className="space-y-2">
                  {order.products.map((product, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{product.name}</span>
                      <span className="text-gray-600">{product.quantity} adet</span>
                    </li>
                  ))}
                </ul>
              </div>

              {order.estimatedDeliveryTime && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Tahmini Teslimat Zamanı</h3>
                  <p className="text-gray-600">
                    {new Date(order.estimatedDeliveryTime).toLocaleString('tr-TR')}
                  </p>
                </div>
              )}

              {order.notes && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Notlar</h3>
                  <p className="text-gray-600">{order.notes}</p>
                </div>
              )}

              <div className="text-sm text-gray-500">
                Sipariş Tarihi: {new Date(order.createdAt).toLocaleDateString('tr-TR')}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface OrderStatus {
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  timestamp: string
  location: string
}

interface OrderDetails {
  trackingNumber: string
  status: OrderStatus
  customerName: string
  items: {
    name: string
    quantity: number
    price: number
  }[]
  estimatedDelivery: string
}

export default function OrderDetails() {
  const params = useParams()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Burada gerçek API çağrısı yapılacak
    const fetchOrderDetails = async () => {
      try {
        // Örnek veri
        const mockOrder: OrderDetails = {
          trackingNumber: params.trackingNumber as string,
          status: {
            status: 'IN_TRANSIT',
            timestamp: new Date().toISOString(),
            location: 'İstanbul, Türkiye'
          },
          customerName: 'John Doe',
          items: [
            { name: 'Ürün 1', quantity: 2, price: 100 },
            { name: 'Ürün 2', quantity: 1, price: 150 }
          ],
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
        
        setOrder(mockOrder)
        setLoading(false)
      } catch (err) {
        setError('Sipariş bilgileri alınamadı')
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [params.trackingNumber])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-red-500">{error}</div>
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
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Sipariş Detayları</h1>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-400">Takip Numarası</p>
                <p className="font-bold">{order.trackingNumber}</p>
              </div>
              <div>
                <p className="text-gray-400">Durum</p>
                <p className="font-bold text-blue-500">{order.status.status}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <p className="text-gray-400">Müşteri</p>
              <p className="font-bold">{order.customerName}</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Sipariş Öğeleri</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-gray-400">Adet: {item.quantity}</p>
                  </div>
                  <p className="font-bold">{item.price} TL</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Teslimat Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Son Konum</p>
                <p className="font-bold">{order.status.location}</p>
              </div>
              <div>
                <p className="text-gray-400">Tahmini Teslimat</p>
                <p className="font-bold">
                  {new Date(order.estimatedDelivery).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
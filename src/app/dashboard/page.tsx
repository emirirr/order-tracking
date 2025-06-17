'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Order {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  deliveryDate: string
  customer: {
    name: string
  }
  items: {
    product: {
      name: string
    }
    quantity: number
  }[]
  production: {
    status: string
  }
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Siparişler alınamadı:', errorData.error || 'Bilinmeyen Hata');
        setOrders([]); // Hata durumunda boş bir dizi ayarlayabiliriz
        setLoading(false);
        return; // İşlemi burada sonlandır
      }
      const data = await response.json()
      setOrders(data)
      setLoading(false)
    } catch (error) {
      console.error('Siparişler alınamadı:', error)
      setLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Sipariş Yönetimi</h1>
          <button
            onClick={() => router.push('/orders/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Yeni Sipariş
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition duration-300 cursor-pointer"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{order.orderNumber}</h2>
                  <p className="text-gray-400">{order.customer.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-gray-400">
                  Teslimat: {new Date(order.deliveryDate).toLocaleDateString('tr-TR')}
                </p>
                <p className="text-gray-400">
                  Toplam: {order.totalAmount.toLocaleString('tr-TR')} TL
                </p>
                <div className="border-t border-gray-700 pt-2">
                  <p className="text-sm text-gray-400">Ürünler:</p>
                  <ul className="mt-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="text-sm">
                        {item.product.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
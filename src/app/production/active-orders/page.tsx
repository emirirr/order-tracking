'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

interface Order {
  id: string
  customerName: string
  status: string
  createdAt: string
  products: {
    name: string
    quantity: number
  }[]
  notes: string
}

export default function ActiveOrders() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'PRODUCTION_MANAGER')) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('status', 'in', ['PENDING', 'IN_PRODUCTION']),
          orderBy('createdAt', 'desc')
        )
        const querySnapshot = await getDocs(q)
        const ordersData: Order[] = []
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() } as Order)
        })
        setOrders(ordersData)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
      setLoadingOrders(false)
    }

    if (user?.role === 'PRODUCTION_MANAGER') {
      fetchOrders()
    }
  }, [user])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Burada Firestore güncelleme işlemi yapılacak
      console.log(`Updating order ${orderId} to ${newStatus}`)
      // Güncelleme sonrası siparişleri yeniden yükle
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
      setOrders(updatedOrders)
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (!user || user.role !== 'PRODUCTION_MANAGER') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Aktif Siparişler</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{order.customerName}</h2>
                  <p className="text-gray-500">
                    Sipariş Tarihi: {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {order.status === 'PENDING' ? 'Beklemede' : 'Üretimde'}
                </span>
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

              {order.notes && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Notlar</h3>
                  <p className="text-gray-600">{order.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'IN_PRODUCTION')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Üretime Al
                  </button>
                )}
                {order.status === 'IN_PRODUCTION' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'READY_FOR_DELIVERY')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Üretimi Tamamla
                  </button>
                )}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">Aktif sipariş bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
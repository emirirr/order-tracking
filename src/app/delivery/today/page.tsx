'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'

interface Delivery {
  id: string
  orderId: string
  customerName: string
  address: string
  status: string
  createdAt: string
  estimatedDeliveryTime: string
  notes: string
}

export default function TodayDeliveries() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [loadingDeliveries, setLoadingDeliveries] = useState(true)

  useEffect(() => {
    if (!loading && (!user || user.role !== 'DELIVERY_DRIVER')) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const q = query(
          collection(db, 'deliveries'),
          where('status', 'in', ['READY_FOR_DELIVERY', 'IN_DELIVERY']),
          where('createdAt', '>=', today.toISOString()),
          orderBy('createdAt', 'asc')
        )
        
        const querySnapshot = await getDocs(q)
        const deliveriesData: Delivery[] = []
        querySnapshot.forEach((doc) => {
          deliveriesData.push({ id: doc.id, ...doc.data() } as Delivery)
        })
        setDeliveries(deliveriesData)
      } catch (error) {
        console.error('Error fetching deliveries:', error)
      }
      setLoadingDeliveries(false)
    }

    if (user?.role === 'DELIVERY_DRIVER') {
      fetchDeliveries()
    }
  }, [user])

  const updateDeliveryStatus = async (deliveryId: string, newStatus: string) => {
    try {
      // Burada Firestore güncelleme işlemi yapılacak
      console.log(`Updating delivery ${deliveryId} to ${newStatus}`)
      // Güncelleme sonrası teslimatları yeniden yükle
      const updatedDeliveries = deliveries.map(delivery => 
        delivery.id === deliveryId ? { ...delivery, status: newStatus } : delivery
      )
      setDeliveries(updatedDeliveries)
    } catch (error) {
      console.error('Error updating delivery:', error)
    }
  }

  if (loading || loadingDeliveries) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (!user || user.role !== 'DELIVERY_DRIVER') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Günlük Teslimatlar</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{delivery.customerName}</h2>
                  <p className="text-gray-500">
                    Sipariş No: {delivery.orderId}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  delivery.status === 'READY_FOR_DELIVERY' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {delivery.status === 'READY_FOR_DELIVERY' ? 'Teslime Hazır' : 'Teslimatta'}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Teslimat Adresi</h3>
                <p className="text-gray-600">{delivery.address}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Tahmini Teslimat Zamanı</h3>
                <p className="text-gray-600">
                  {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString('tr-TR')}
                </p>
              </div>

              {delivery.notes && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Notlar</h3>
                  <p className="text-gray-600">{delivery.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                {delivery.status === 'READY_FOR_DELIVERY' && (
                  <button
                    onClick={() => updateDeliveryStatus(delivery.id, 'IN_DELIVERY')}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Teslimata Başla
                  </button>
                )}
                {delivery.status === 'IN_DELIVERY' && (
                  <button
                    onClick={() => updateDeliveryStatus(delivery.id, 'DELIVERED')}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Teslim Edildi
                  </button>
                )}
              </div>
            </div>
          ))}

          {deliveries.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">Bugün için teslimat bulunmuyor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
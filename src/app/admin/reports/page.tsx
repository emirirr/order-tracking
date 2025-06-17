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
  totalAmount: number
}

export default function AdminReports() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
        const querySnapshot = await getDocs(q)
        const ordersData: Order[] = []
        const statusCount: Record<string, number> = {}
        let total = 0

        querySnapshot.forEach((doc) => {
          const order = doc.data() as Order
          ordersData.push(order)
          total += order.totalAmount
          statusCount[order.status] = (statusCount[order.status] || 0) + 1
        })

        setOrders(ordersData)
        setTotalRevenue(total)
        setStatusCounts(statusCount)
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
      setLoadingOrders(false)
    }

    if (user?.role === 'ADMIN') {
      fetchOrders()
    }
  }, [user])

  if (loading || loadingOrders) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Yükleniyor...</div>
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Raporlar</h1>
        
        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Toplam Gelir</h2>
            <p className="text-3xl font-bold text-blue-600">
              {totalRevenue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Toplam Sipariş</h2>
            <p className="text-3xl font-bold text-green-600">{orders.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Ortalama Sipariş Tutarı</h2>
            <p className="text-3xl font-bold text-purple-600">
              {(totalRevenue / (orders.length || 1)).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </p>
          </div>
        </div>

        {/* Sipariş Durumu Dağılımı */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sipariş Durumu Dağılımı</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">{status}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Son Siparişler */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold p-6 border-b">Son Siparişler</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.slice(0, 10).map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 
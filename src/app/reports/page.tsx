'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

interface Order {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  items: {
    product: {
      name: string
    }
    quantity: number
  }[]
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF8042']

export default function Reports() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      setOrders(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // Günlük sipariş sayısı (son 7 gün)
  const dailyOrders = () => {
    const days: { [date: string]: number } = {}
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const key = d.toLocaleDateString('tr-TR')
      days[key] = 0
    }
    orders.forEach(order => {
      const key = new Date(order.createdAt).toLocaleDateString('tr-TR')
      if (days[key] !== undefined) days[key]++
    })
    return Object.entries(days).map(([date, count]) => ({ date, count }))
  }

  // Üretim durumu dağılımı
  const statusDistribution = () => {
    const statusMap: { [status: string]: number } = {}
    orders.forEach(order => {
      statusMap[order.status] = (statusMap[order.status] || 0) + 1
    })
    return Object.entries(statusMap).map(([status, value]) => ({ name: status, value }))
  }

  // Toplam ciro
  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  // En çok sipariş edilen ürünler
  const productMap: { [name: string]: number } = {}
  orders.forEach(order => {
    order.items.forEach(item => {
      productMap[item.product.name] = (productMap[item.product.name] || 0) + item.quantity
    })
  })
  const topProducts = Object.entries(productMap)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)

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
        <h1 className="text-3xl font-bold mb-8">Raporlar & Grafikler</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Günlük Sipariş Sayısı (Son 7 Gün)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyOrders()}>
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Üretim Durumu Dağılımı</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusDistribution()} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusDistribution().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Toplam Ciro</h2>
            <p className="text-3xl font-bold text-green-400">{totalRevenue.toLocaleString('tr-TR')} TL</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">En Çok Sipariş Edilen Ürünler</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProducts} layout="vertical">
                <XAxis type="number" stroke="#fff" allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#fff" />
                <Tooltip />
                <Bar dataKey="quantity" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
} 
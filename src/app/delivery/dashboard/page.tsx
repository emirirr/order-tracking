'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function DeliveryDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'DELIVERY_DRIVER')) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
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
        <h1 className="text-3xl font-bold mb-8">Teslimat Paneli</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Günlük Teslimatlar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Günlük Teslimatlar</h2>
            <p className="text-gray-600 mb-4">Bugünkü teslimat listesini görüntüleyin.</p>
            <button 
              onClick={() => router.push('/delivery/today')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Teslimatları Görüntüle
            </button>
          </div>

          {/* Teslimat Geçmişi */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Teslimat Geçmişi</h2>
            <p className="text-gray-600 mb-4">Geçmiş teslimatları görüntüleyin.</p>
            <button 
              onClick={() => router.push('/delivery/history')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Geçmişi Görüntüle
            </button>
          </div>

          {/* Rota Planlaması */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Rota Planlaması</h2>
            <p className="text-gray-600 mb-4">Teslimat rotalarını planlayın ve görüntüleyin.</p>
            <button 
              onClick={() => router.push('/delivery/routes')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Rotaları Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function ProductionDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'PRODUCTION_MANAGER')) {
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

  if (!user || user.role !== 'PRODUCTION_MANAGER') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Üretim Yönetimi Paneli</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Aktif Siparişler */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Aktif Siparişler</h2>
            <p className="text-gray-600 mb-4">Üretimde olan siparişleri görüntüleyin ve yönetin.</p>
            <button 
              onClick={() => router.push('/production/active-orders')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Siparişleri Görüntüle
            </button>
          </div>

          {/* Üretim Durumu */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Üretim Durumu</h2>
            <p className="text-gray-600 mb-4">Günlük üretim durumunu ve istatistikleri görüntüleyin.</p>
            <button 
              onClick={() => router.push('/production/status')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Durumu Görüntüle
            </button>
          </div>

          {/* Üretim Planlaması */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Üretim Planlaması</h2>
            <p className="text-gray-600 mb-4">Gelecek siparişler için üretim planlaması yapın.</p>
            <button 
              onClick={() => router.push('/production/planning')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Planlamayı Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
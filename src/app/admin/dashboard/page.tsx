'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
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

  if (!user || user.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kullanıcı Yönetimi */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Kullanıcı Yönetimi</h2>
            <p className="text-gray-600 mb-4">Sistemdeki tüm kullanıcıları görüntüleyin ve yönetin.</p>
            <button 
              onClick={() => router.push('/admin/users')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Kullanıcıları Görüntüle
            </button>
          </div>

          {/* Sipariş Yönetimi */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Sipariş Yönetimi</h2>
            <p className="text-gray-600 mb-4">Tüm siparişleri görüntüleyin ve yönetin.</p>
            <button 
              onClick={() => router.push('/admin/orders')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Siparişleri Görüntüle
            </button>
          </div>

          {/* Raporlar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Raporlar</h2>
            <p className="text-gray-600 mb-4">Sistem raporlarını görüntüleyin.</p>
            <button 
              onClick={() => router.push('/admin/reports')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Raporları Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 
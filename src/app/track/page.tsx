'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TrackOrder() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber) {
      router.push(`/track/${trackingNumber}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Sipariş Takip</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="trackingNumber" className="block text-sm font-medium mb-2">
                Takip Numarası
              </label>
              <input
                type="text"
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Takip numaranızı girin"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
            >
              Siparişi Takip Et
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 
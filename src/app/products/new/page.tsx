'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewProduct() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, price: parseFloat(price), category })
      })
      if (response.ok) {
        router.push('/products')
      } else {
        const data = await response.json()
        setError(data.error || 'Bir hata oluştu')
      }
    } catch {
      setError('Bir hata oluştu')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Yeni Ürün Ekle</h1>
          {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Ürün Adı</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Açıklama</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fiyat</label>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required min="0" step="0.01" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300" disabled={loading}>
              Ürün Ekle
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 
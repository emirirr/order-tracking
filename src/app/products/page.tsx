'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: string
  isAvailable: boolean
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch {
      // Hata yönetimi
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Ürünler</h1>
          <button
            onClick={() => router.push('/products/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Yeni Ürün
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400">Hiç ürün yok.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-gray-800 rounded-lg p-6 shadow hover:bg-gray-700 transition duration-300">
                <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                <p className="text-gray-400 mb-2">{product.category}</p>
                <p className="mb-2">{product.description}</p>
                <p className="font-bold text-blue-400 mb-2">{product.price.toLocaleString('tr-TR')} TL</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs ${product.isAvailable ? 'bg-green-600' : 'bg-red-600'}`}>
                  {product.isAvailable ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
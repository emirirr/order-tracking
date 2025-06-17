'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

interface Product {
  id: string
  name: string
  price: number
  category: string
}

interface OrderItem {
  productId: string
  quantity: number
  price: number
}

export default function NewOrder() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<OrderItem[]>([])
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error('Ürünler alınamadı:', error)
      setLoading(false)
    }
  }

  const addProduct = (product: Product) => {
    const existingItem = selectedProducts.find(item => item.productId === product.id)
    if (existingItem) {
      setSelectedProducts(selectedProducts.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setSelectedProducts([...selectedProducts, {
        productId: product.id,
        quantity: 1,
        price: product.price
      }])
    }
  }

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(item => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setSelectedProducts(selectedProducts.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    ))
  }

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: '1', // Bu kısmı gerçek kullanıcı kimlik doğrulaması ile değiştirin
          items: selectedProducts,
          totalAmount: calculateTotal(),
          deliveryDate,
          deliveryAddress,
          notes
        })
      })

      if (response.ok) {
        const order = await response.json()
        // Firestore'a da yedekle
        await addDoc(collection(db, 'orders'), {
          ...order,
          createdAt: new Date()
        })
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Sipariş oluşturulamadı:', error)
    }
  }

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
        <h1 className="text-3xl font-bold mb-8">Yeni Sipariş</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition duration-300"
                  onClick={() => addProduct(product)}
                >
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-gray-400">{product.price.toLocaleString('tr-TR')} TL</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Sipariş Detayları</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Teslimat Tarihi
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Teslimat Adresi
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Notlar
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  rows={3}
                />
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h3 className="font-bold mb-4">Seçilen Ürünler</h3>
                {selectedProducts.map((item) => {
                  const product = products.find(p => p.id === item.productId)
                  return (
                    <div key={item.productId} className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold">{product?.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.price.toLocaleString('tr-TR')} TL x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeProduct(item.productId)}
                          className="px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  )
                })}

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xl font-bold">
                    Toplam: {calculateTotal().toLocaleString('tr-TR')} TL
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                disabled={selectedProducts.length === 0}
              >
                Siparişi Oluştur
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 
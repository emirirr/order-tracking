import { NextResponse } from 'next/server'
import { collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface OrderItem {
  productId: string
  quantity: number
  price: number
}

interface ProductFirestoreData {
  name: string
  category: string
  price: number
  imageUrl?: string | null
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

interface OrderItemWithProductDetails extends OrderItem {
  product: { name: string; category: string; }
}

interface OrderFirestoreData {
  customerId: string
  items: OrderItemWithProductDetails[]
  production: {
    status: string
    startTime: string | null
    endTime: string | null
    notes: string | null
  }
  orderNumber: string
  totalAmount: number
  deliveryDate: string
  deliveryAddress: string
  notes: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export async function GET() {
  try {
    const ordersCollection = collection(db, 'orders')
    const orderSnapshot = await getDocs(ordersCollection)
    const orders = await Promise.all(orderSnapshot.docs.map(async docSnapshot => {
      const orderData = { id: docSnapshot.id, ...docSnapshot.data() as OrderFirestoreData }

      // Fetch related customer data (assuming 'users' collection for customers)
      let customerData: { name?: string; email?: string; phone?: string } = {}
      if (orderData.customerId) {
        const customerDocRef = doc(db, 'users', orderData.customerId)
        const customerDoc = await getDoc(customerDocRef)
        if (customerDoc.exists()) {
          customerData = customerDoc.data() as { name?: string; email?: string; phone?: string }
        }
      }

      // Denormalize product name for each item for dashboard display
      const itemsWithProductNames = await Promise.all(orderData.items.map(async (item: OrderItemWithProductDetails) => {
        const productDocRef = doc(db, 'products', item.productId)
        const productDoc = await getDoc(productDocRef)
        const productName = productDoc.exists() ? (productDoc.data() as ProductFirestoreData).name : 'Unknown Product'
        return {
          ...item,
          product: { name: productName, category: item.product.category }
        }
      }))

      return {
        ...orderData,
        customer: customerData,
        items: itemsWithProductNames,
        production: orderData.production || { status: 'UNKNOWN', startTime: null, endTime: null, notes: null }
      }
    }))

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Siparişler alınamadı:', error)
    return NextResponse.json({ error: 'Siparişler alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { customerId, items, totalAmount, deliveryDate, deliveryAddress, notes } = body

    // Generate order number
    const date = new Date()
    const year = date.getFullYear()
    const ordersCollection = collection(db, 'orders')
    const lastOrderQuery = query(ordersCollection, orderBy('orderNumber', 'desc'), limit(1))
    const lastOrderSnapshot = await getDocs(lastOrderQuery)
    let orderNumber = `ORD-${year}-001`
    if (!lastOrderSnapshot.empty) {
      const lastOrderDoc = lastOrderSnapshot.docs[0]
      const lastOrderNum = (lastOrderDoc.data() as OrderFirestoreData).orderNumber
      const lastNumber = parseInt(lastOrderNum.split('-')[2])
      orderNumber = `ORD-${year}-${String(lastNumber + 1).padStart(3, '0')}`
    }

    // Prepare items with product details for embedding (denormalization)
    const itemsWithDetails = await Promise.all(items.map(async (item: OrderItem) => {
      const productDocRef = doc(db, 'products', item.productId)
      const productDoc = await getDoc(productDocRef)
      if (productDoc.exists()) {
        const productData = productDoc.data() as ProductFirestoreData
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          product: { // Denormalize product info directly into the order item
            name: productData.name,
            category: productData.category
          }
        }
      }
      return { // Fallback if product not found
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        product: { name: 'Unknown Product', category: 'Unknown' }
      }
    }))

    const orderData: OrderFirestoreData = {
      orderNumber,
      customerId,
      totalAmount,
      deliveryDate: new Date(deliveryDate).toISOString(),
      deliveryAddress,
      notes: notes || null,
      status: 'PENDING', // Default status for new orders
      items: itemsWithDetails, // Embed items directly
      production: { // Embed initial production status
        status: 'SCHEDULED',
        startTime: null,
        endTime: null,
        notes: null
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const docRef = await addDoc(ordersCollection, orderData)

    // Create notification
    await addDoc(collection(db, 'notifications'), {
      message: `Yeni sipariş oluşturuldu: ${orderNumber}`,
      type: 'ORDER_STATUS',
      userId: customerId, // Assuming customerId is the userId for notifications
      orderId: docRef.id,
      createdAt: new Date().toISOString(),
      read: false
    })

    return NextResponse.json({ id: docRef.id, ...orderData })
  } catch (error) {
    console.error('Sipariş oluşturulamadı:', error)
    return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 })
  }
} 
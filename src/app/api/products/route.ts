import { NextResponse } from 'next/server'
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET() {
  try {
    const productsCollection = collection(db, 'products')
    const q = query(productsCollection, where('isAvailable', '==', true))
    const productSnapshot = await getDocs(q)
    const products = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return NextResponse.json(products)
<<<<<<< HEAD
  } catch (error) {
    console.error('Ürünler alınamadı:', error)
=======
  } catch {
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
    return NextResponse.json({ error: 'Ürünler alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
<<<<<<< HEAD
    const { name, description, price, category, imageUrl } = body

    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      category,
      imageUrl: imageUrl || null,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const docRef = await addDoc(collection(db, 'products'), productData)
    return NextResponse.json({ id: docRef.id, ...productData })
  } catch (error) {
    console.error('Ürün oluşturulamadı:', error)
    return NextResponse.json({ error: 'Ürün oluşturulamadı' }, { status: 500 })
=======
    const { name, description, price, category } = body
    if (!name || !price || !category) {
      return NextResponse.json({ error: 'Zorunlu alanlar eksik' }, { status: 400 })
    }
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        category,
        isAvailable: true
      }
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Ürün eklenemedi:', error)
    return NextResponse.json({ error: 'Ürün eklenemedi' }, { status: 500 })
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
  }
} 
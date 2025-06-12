import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isAvailable: true
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Ürünler alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        imageUrl: body.imageUrl,
        isAvailable: true
      }
    })
    // Firestore'a da yedekle (sadece client ortamında çalışır, burada örnek olarak bırakıldı)
    /*
    await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: new Date()
    })
    */
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Ürün oluşturulamadı' }, { status: 500 })
  }
} 
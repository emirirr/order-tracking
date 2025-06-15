import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isAvailable: true
      }
    })
    return NextResponse.json(products)
  } catch {
    return NextResponse.json({ error: 'Ürünler alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
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
  }
} 
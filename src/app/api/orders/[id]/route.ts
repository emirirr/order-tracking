import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// API handler
export async function GET(
  request: Request,
  context: { params: { id: string } }  // ✅ Doğru tip burada
) {
  const { id } = context.params

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
                category: true
              }
            }
          }
        },
        production: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Sipariş detayları alınamadı:', error)
    return NextResponse.json(
      { error: 'Sipariş detayları alınamadı' },
      { status: 500 }
    )
  }
}

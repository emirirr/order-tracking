import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        },
        production: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(orders)
  } catch {
    return NextResponse.json({ error: 'Siparişler alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Sipariş numarası oluştur (örn: ORD-2024-001)
    const date = new Date()
    const year = date.getFullYear()
    const lastOrder = await prisma.order.findFirst({
      orderBy: {
        orderNumber: 'desc'
      }
    })
    let orderNumber = 'ORD-2024-001'
    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderNumber.split('-')[2])
      orderNumber = `ORD-${year}-${String(lastNumber + 1).padStart(3, '0')}`
    }
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: body.customerId,
        totalAmount: body.totalAmount,
        deliveryDate: new Date(body.deliveryDate),
        deliveryAddress: body.deliveryAddress,
        notes: body.notes,
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        },
        production: {
          create: {
            status: 'SCHEDULED'
          }
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        production: true
      }
    })
    await prisma.notification.create({
      data: {
        message: `Yeni sipariş oluşturuldu: ${orderNumber}`,
        type: 'ORDER_STATUS',
        userId: body.customerId,
        orderId: order.id
      }
    })
    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: 'Sipariş oluşturulamadı' }, { status: 500 })
  }
} 
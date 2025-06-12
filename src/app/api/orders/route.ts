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
  } catch (error) {
    return NextResponse.json({ error: 'Siparişler alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, items } = body;

    if (!customerId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Müşteri ID ve ürünler belirtilmeli' },
        { status: 400 }
      );
    }

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
        customerId,
        items: {
          create: items.map((item: { productId: string; quantity: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
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

    // Bildirim oluştur
    await prisma.notification.create({
      data: {
        message: `Yeni sipariş oluşturuldu: ${orderNumber}`,
        type: 'ORDER_STATUS',
        userId: body.customerId,
        orderId: order.id
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Sipariş oluşturulamadı:', error);
    return NextResponse.json(
      { error: 'Sipariş oluşturulamadı' },
      { status: 500 }
    );
  }
}
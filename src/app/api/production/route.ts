import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const productions = await prisma.production.findMany({
      include: {
        order: {
          include: {
            customer: true,
            items: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(productions)
  } catch {
    return NextResponse.json({ error: 'Üretim bilgileri alınamadı' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const production = await prisma.production.update({
      where: {
        orderId: body.orderId
      },
      data: {
        status: body.status,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        notes: body.notes
      },
      include: {
        order: {
          include: {
            customer: true,
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })
    // Sipariş durumunu güncelle
    let orderStatus = 'PENDING'
    switch (body.status) {
      case 'IN_PROGRESS':
        orderStatus = 'IN_PRODUCTION'
        break
      case 'COMPLETED':
        orderStatus = 'READY_FOR_DELIVERY'
        break
      case 'CANCELLED':
        orderStatus = 'CANCELLED'
        break
    }
    await prisma.order.update({
      where: {
        id: body.orderId
      },
      data: {
        status: orderStatus
      }
    })
    await prisma.notification.create({
      data: {
        message: `Üretim durumu güncellendi: ${body.status}`,
        type: 'PRODUCTION_UPDATE',
        userId: production.order.customerId,
        orderId: body.orderId
      }
    })
    return NextResponse.json(production)
  } catch {
    return NextResponse.json({ error: 'Üretim güncellenemedi' }, { status: 500 })
  }
} 
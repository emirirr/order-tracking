import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: params.id
      },
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
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
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

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Sipariş durumu belirtilmedi' },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Sipariş durumu güncellenemedi:', error);
    return NextResponse.json(
      { error: 'Sipariş durumu güncellenemedi' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Ürün ID ve miktar belirtilmeli' },
        { status: 400 }
      );
    }

    const orderItem = await prisma.orderItem.create({
      data: {
        orderId: params.id,
        productId,
        quantity,
      },
    });

    return NextResponse.json(orderItem);
  } catch (error) {
    console.error('Siparişe ürün eklenemedi:', error);
    return NextResponse.json(
      { error: 'Siparişe ürün eklenemedi' },
      { status: 500 }
    );
  }
}
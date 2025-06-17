import { NextResponse } from 'next/server'
import { doc, getDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface OrderItemFirestore {
  productId: string;
  quantity: number;
  price: number;
  product: { name: string; category: string; };
}

interface OrderFirestoreData {
  customerId: string;
  items: OrderItemFirestore[];
  production: {
    status: string;
    startTime: string | null;
    endTime: string | null;
    notes: string | null;
  };
  orderNumber: string;
  totalAmount: number;
  deliveryDate: string;
  deliveryAddress: string;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UserFirestoreData {
  name?: string;
  email?: string;
  phone?: string;
}

export async function GET(request: Request) {
  try {
<<<<<<< HEAD
    const orderDocRef = doc(db, 'orders', params.id);
    const orderDoc = await getDoc(orderDocRef);
=======
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Extract id from the URL
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
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14

    if (!orderDoc.exists()) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      );
    }

    const orderData = { id: orderDoc.id, ...orderDoc.data() as OrderFirestoreData };

    let customerData: UserFirestoreData = {};
    if (orderData.customerId) {
      const customerDocRef = doc(db, 'users', orderData.customerId);
      const customerDoc = await getDoc(customerDocRef);
      if (customerDoc.exists()) {
        customerData = customerDoc.data() as UserFirestoreData;
      }
    }

    // Items are already denormalized in orderData.items
    // Production data is also denormalized in orderData.production

    return NextResponse.json({
      ...orderData,
      customer: customerData,
    });
  } catch (error) {
    console.error('Sipariş detayları alınamadı:', error);
    return NextResponse.json(
      { error: 'Sipariş detayları alınamadı' },
      { status: 500 }
    );
  }
} 
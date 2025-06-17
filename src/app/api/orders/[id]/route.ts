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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderDocRef = doc(db, 'orders', params.id);
    const orderDoc = await getDoc(orderDocRef);

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
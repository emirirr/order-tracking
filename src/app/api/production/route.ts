import { NextResponse } from 'next/server'
<<<<<<< HEAD
import { collection, getDocs, doc, getDoc, updateDoc, query, where, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
=======
import { PrismaClient, OrderStatus } from '@prisma/client'
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14

interface ProductionFirestoreData {
  orderId: string;
  status: string;
  startTime: string | null;
  endTime: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderItemFirestore {
  productId: string;
  quantity: number;
  price: number;
  product: { name: string; category: string; };
}

interface UserFirestoreData {
  name?: string;
  email?: string;
  phone?: string;
}

interface OrderFirestoreData {
  id?: string;
  customerId?: string;
  items?: OrderItemFirestore[];
  production?: {
    status: string;
    startTime: string | null;
    endTime: string | null;
    notes: string | null;
  };
  orderNumber?: string;
  totalAmount?: number;
  deliveryDate?: string;
  deliveryAddress?: string;
  notes?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  customer?: UserFirestoreData;
}

export async function GET() {
  try {
    const productionsCollection = collection(db, 'production');
    const productionSnapshot = await getDocs(productionsCollection);
    const productions = await Promise.all(productionSnapshot.docs.map(async prodDocSnapshot => {
      const productionData = { id: prodDocSnapshot.id, ...prodDocSnapshot.data() as ProductionFirestoreData };

      let orderData: OrderFirestoreData | null = null;
      if (productionData.orderId) {
        const orderDocRef = doc(db, 'orders', productionData.orderId);
        const orderDoc = await getDoc(orderDocRef);
        if (orderDoc.exists()) {
          const rawOrderData = orderDoc.data();
          orderData = {
              id: orderDoc.id,
              customerId: rawOrderData.customerId,
              items: rawOrderData.items || [],
              production: rawOrderData.production || { status: 'UNKNOWN', startTime: null, endTime: null, notes: null },
              orderNumber: rawOrderData.orderNumber,
              totalAmount: rawOrderData.totalAmount,
              deliveryDate: rawOrderData.deliveryDate,
              deliveryAddress: rawOrderData.deliveryAddress,
              notes: rawOrderData.notes,
              status: rawOrderData.status,
              createdAt: rawOrderData.createdAt,
              updatedAt: rawOrderData.updatedAt,
          } as OrderFirestoreData;

          let customerData: UserFirestoreData = {};
          if (orderData.customerId) {
            const customerDocRef = doc(db, 'users', orderData.customerId);
            const customerDoc = await getDoc(customerDocRef);
            if (customerDoc.exists()) {
              customerData = customerDoc.data() as UserFirestoreData;
            }
          }

          const itemsWithProductNames = await Promise.all((orderData.items || []).map(async (item: OrderItemFirestore) => {
            const productDocRef = doc(db, 'products', item.productId);
            const productDoc = await getDoc(productDocRef);
            const productName = productDoc.exists() ? (productDoc.data() as any).name : 'Unknown Product';
            const productCategory = productDoc.exists() ? (productDoc.data() as any).category : 'Unknown Category';
            return {
              ...item,
              product: { name: productName, category: productCategory }
            };
          }));

          orderData = { ...orderData, customer: customerData, items: itemsWithProductNames };
        }
      }
<<<<<<< HEAD

      return {
        ...productionData,
        order: orderData
      };
    }));

    return NextResponse.json(productions);
  } catch (error) {
    console.error('Üretim bilgileri alınamadı:', error);
    return NextResponse.json({ error: 'Üretim bilgileri alınamadı' }, { status: 500 });
=======
    })
    return NextResponse.json(productions)
  } catch {
    return NextResponse.json({ error: 'Üretim bilgileri alınamadı' }, { status: 500 })
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
  }
}

export async function POST(request: Request) {
  try {
<<<<<<< HEAD
    const body = await request.json();
    const { orderId, status, startTime, endTime, notes } = body;

    const productionDocRef = doc(db, 'production', orderId);
    await updateDoc(productionDocRef, {
      status,
      startTime: startTime ? new Date(startTime).toISOString() : null,
      endTime: endTime ? new Date(endTime).toISOString() : null,
      notes: notes || null,
      updatedAt: new Date().toISOString()
    });

    const orderDocRef = doc(db, 'orders', orderId);
    let orderStatus = 'PENDING';
    switch (status) {
      case 'IN_PROGRESS':
        orderStatus = 'IN_PRODUCTION';
        break;
      case 'COMPLETED':
        orderStatus = 'READY_FOR_DELIVERY';
        break;
      case 'OUT_FOR_DELIVERY':
        orderStatus = 'OUT_FOR_DELIVERY';
        break;
      case 'DELIVERED':
        orderStatus = 'DELIVERED';
        break;
      case 'CANCELLED':
        orderStatus = 'CANCELLED';
        break;
      default:
        orderStatus = 'PENDING';
    }

    await updateDoc(orderDocRef, { status: orderStatus });

    const updatedProductionDoc = await getDoc(productionDocRef);
    const updatedOrderDoc = await getDoc(orderDocRef);

    let productionData = null;
    if (updatedProductionDoc.exists()) {
      productionData = { id: updatedProductionDoc.id, ...updatedProductionDoc.data() as ProductionFirestoreData };
    }

    let orderResponseData: OrderFirestoreData | null = null;
    if (updatedOrderDoc.exists()) {
      orderResponseData = { id: updatedOrderDoc.id, ...updatedOrderDoc.data() as OrderFirestoreData };
    }

    if (orderResponseData && orderResponseData.customerId) {
      await addDoc(collection(db, 'notifications'), {
        message: `Üretim durumu güncellendi: ${status}`,
        type: 'PRODUCTION_UPDATE',
        userId: orderResponseData.customerId,
        orderId: orderId,
        createdAt: new Date().toISOString(),
        read: false
      });
    }

    return NextResponse.json(productionData);
  } catch (error) {
    console.error('Üretim güncellenemedi:', error);
    return NextResponse.json({ error: 'Üretim güncellenemedi' }, { status: 500 });
=======
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
    let orderStatus: OrderStatus = OrderStatus.PENDING
    switch (body.status) {
      case 'IN_PROGRESS':
        orderStatus = OrderStatus.IN_PRODUCTION
        break
      case 'COMPLETED':
        orderStatus = OrderStatus.READY_FOR_DELIVERY
        break
      case 'CANCELLED':
        orderStatus = OrderStatus.CANCELLED
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
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
  }
} 
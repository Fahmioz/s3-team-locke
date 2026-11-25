import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase.js'

export async function placeOrders(user, cart, details) {
  const byVendor = new Map()
  for (const line of cart) {
    const lines = byVendor.get(line.item.vendorId) ?? []
    byVendor.set(line.item.vendorId, [...lines, line])
  }

  const batch = writeBatch(db)
  for (const [vendorId, lines] of byVendor) {
    const orderRef = doc(collection(db, 'orders'))
    batch.set(orderRef, {
      studentUid: user.uid,
      studentName: details.name,
      mahallah: details.mahallah,
      pickupTime: details.pickupTime,
      vendorId,
      vendorName: lines[0].item.vendorName,
      items: lines.map(({ item, qty }) => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        qty,
      })),
      total: lines.reduce((sum, { item, qty }) => sum + item.price * qty, 0),
      status: 'Received',
      createdAt: serverTimestamp(),
    })
  }

  await batch.commit()
}

export function subscribeToMyOrders(uid, onData, onError) {
  const ordersQuery = query(collection(db, 'orders'), where('studentUid', '==', uid))
  return onSnapshot(ordersQuery, (snapshot) => {
    const orders = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    orders.sort((a, b) => (
      (b.createdAt?.toMillis?.() ?? Date.now()) - (a.createdAt?.toMillis?.() ?? Date.now())
    ))
    onData(orders)
  }, onError)
}

export function changePickupTime(orderId, pickupTime) {
  return updateDoc(doc(db, 'orders', orderId), { pickupTime })
}

export function cancelOrder(orderId) {
  return deleteDoc(doc(db, 'orders', orderId))
}

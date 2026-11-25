import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase.js'

export function subscribeToVendors(onData, onError) {
  return onSnapshot(collection(db, 'vendors'), (snapshot) => {
    const vendors = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    vendors.sort((a, b) => a.name.localeCompare(b.name))
    onData(vendors)
  }, onError)
}

export function subscribeToVendor(vendorId, onData, onError) {
  return onSnapshot(doc(db, 'vendors', vendorId), (snapshot) => {
    onData(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null)
  }, onError)
}

export function subscribeToMenu(vendorId, category, onData, onError) {
  const menuRef = collection(db, 'vendors', vendorId, 'menu')
  const menuQuery = category ? query(menuRef, where('category', '==', category)) : menuRef

  return onSnapshot(menuQuery, (snapshot) => {
    onData(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
  }, onError)
}

export async function seedDemoData(data) {
  const vendors = Array.isArray(data) ? data : data.vendors
  if (!Array.isArray(vendors)) throw new Error('Vendor data must be an array.')

  const batch = writeBatch(db)
  vendors.forEach((vendor) => {
    const { menu, id, ...vendorData } = vendor
    const vendorRef = doc(db, 'vendors', id)
    batch.set(vendorRef, vendorData)
    if (!Array.isArray(menu)) throw new Error(`Vendor "${id}" has no menu array.`)

    menu.forEach((item) => {
      const { id: itemId, ...itemData } = item
      batch.set(doc(vendorRef, 'menu', itemId), itemData)
    })
  })

  await batch.commit()
  return vendors.length
}

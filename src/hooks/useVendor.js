import { useEffect, useState } from 'react'
import { subscribeToMenu, subscribeToVendor } from '../services/vendors.js'

export function useVendor(vendorId, category) {
  const [vendor, setVendor] = useState(undefined)
  const [menu, setMenu] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    async function reset() {
      await Promise.resolve()
      setVendor(undefined)
      setMenu([])
      setCategories([])
      setError(null)
    }
    reset()

    const handleError = (err) => setError(err.message)
    const stopVendor = subscribeToVendor(vendorId, setVendor, handleError)
    const stopMenu = subscribeToMenu(vendorId, category, setMenu, handleError)
    const stopAllMenu = subscribeToMenu(vendorId, '', (items) => {
      setCategories([...new Set(items.map((item) => item.category))].sort())
    }, handleError)

    return () => {
      stopVendor()
      stopMenu()
      stopAllMenu()
    }
  }, [category, vendorId])

  return {
    vendor,
    menu,
    categories,
    loading: vendor === undefined && !error,
    error,
  }
}

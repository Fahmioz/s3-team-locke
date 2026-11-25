import { useEffect, useState } from 'react'
import { subscribeToVendors } from '../services/vendors.js'

export function useVendors() {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    return subscribeToVendors(
      (data) => {
        setVendors(data)
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )
  }, [reloadKey])

  const reload = () => setReloadKey((k) => k + 1)

  return { vendors, loading, error, reload }
}

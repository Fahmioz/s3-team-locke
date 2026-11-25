import { useEffect, useState } from 'react'
import { subscribeToMyOrders } from '../services/orders.js'

export function useMyOrders(uid) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function reset() {
      await Promise.resolve()
      setOrders([])
      setLoading(true)
      setError(null)
    }
    reset()

    return subscribeToMyOrders(uid, (data) => {
      setOrders(data)
      setLoading(false)
    }, (err) => {
      setError(err.message)
      setLoading(false)
    })
  }, [uid])

  return { orders, loading, error }
}

import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { useMyOrders } from '../hooks/useMyOrders.js'
import { Loading, ErrorMessage } from '../components/Status.jsx'
import OrderStatus from '../components/OrderStatus.jsx'
import OrderActions from '../components/OrderActions.jsx'

function OrdersPage() {
  const { user } = useAuth()
  const { orders, loading, error } = useMyOrders(user.uid)

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={() => window.location.reload()} />
  if (orders.length === 0) {
    return <p className="muted">No orders yet. <Link to="/">Browse vendors</Link></p>
  }

  return (
    <section>
      <h2 className="section-title">My orders</h2>
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order.id} className="card">
            <p className="cart-name">{order.vendorName} · Pickup {order.pickupTime}</p>
            <p className="muted">
              {order.items.map((item) => `${item.qty}× ${item.name}`).join(', ')}
            </p>
            <p className="muted">
              Placed {order.createdAt ? order.createdAt.toDate().toLocaleString('en-MY') : 'just now'}
            </p>
            <p className="price">RM {order.total.toFixed(2)}</p>
            <OrderStatus status={order.status} />
            {order.status === 'Received' && <OrderActions order={order} />}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default OrdersPage

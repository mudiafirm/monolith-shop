import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function MyOrders({ token }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load orders')
        }

        setOrders(data.orders || [])
      } catch (error) {
        console.error('Orders error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [token])

  if (!token) {
    return (
      <section className="section">
        <div className="container">
          <p className="section-label">MY ORDERS</p>

          <h2>Login Required</h2>

          <p>
            Please log in to view your order history.
          </p>

          <Link to="/login" className="product-button">
            Login
          </Link>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="section-label">MY ORDERS</p>
          <h2>My Orders</h2>
          <p>Loading your orders...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <p className="section-label">MY ORDERS</p>

          <h2>Unable to Load Orders</h2>

          <p className="form-error">{error}</p>

          <Link to="/" className="product-button">
            Return to NadiaFirm
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <p className="section-label">MY ORDERS</p>

        <h2>My Orders</h2>

        <p className="section-intro">
          View your NadiaFirm order history and current order status.
        </p>

        {orders.length === 0 ? (
          <div className="cart-summary">
            <p>You have not placed any orders yet.</p>

            <Link to="/#products" className="product-button">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="cart-summary">
            {orders.map((order) => (
              <div className="order-card" key={order.id}>
                <h3>Order #{order.id}</h3>

                <p>
                  Status:{' '}
                  <strong>{order.status}</strong>
                </p>

                <p>
                  Total: ₦
                  {Number(order.total_amount).toLocaleString('en-NG')}
                </p>

                <p>
                  Date:{' '}
                  {new Date(order.created_at).toLocaleString('en-NG')}
                </p>
              </div>
            ))}
          </div>
        )}

        <p>
          <Link to="/" className="product-button">
            Return to NadiaFirm
          </Link>
        </p>
      </div>
    </section>
  )
}

export default MyOrders

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const token = localStorage.getItem('token')

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/admin/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load orders')
      }

      setOrders(data.orders || [])
    } catch (error) {
      console.error('Load orders error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const viewOrder = async (orderId) => {
    try {
      setError('')

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load order')
      }

      setSelectedOrder(data.order)
    } catch (error) {
      console.error('View order error:', error)
      setError(error.message)
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId)
      setError('')
      setSuccess('')

      const response = await fetch(
        `/api/admin/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update order status')
      }

      setSuccess(`Order #${orderId} status updated to ${status}.`)

      await loadOrders()

      if (selectedOrder && selectedOrder.id === orderId) {
        await viewOrder(orderId)
      }
    } catch (error) {
      console.error('Update order status error:', error)
      setError(error.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const formatDate = (date) => {
    if (!date) {
      return '—'
    }

    return new Date(date).toLocaleString('en-NG')
  }

  const formatMoney = (amount) => {
    return `₦${Number(amount || 0).toLocaleString('en-NG', {
      minimumFractionDigits: 2,
    })}`
  }

  return (
  <section className="section admin-orders-page">
    <div className="container">

      <div className="admin-page-header">

        <div>
          <p className="section-label">
            NADIAFIRM ADMINISTRATION
          </p>

          <h1>Order Management</h1>

          <p className="section-intro">
            View customer orders and manage their current status.
          </p>
        </div>

        <div className="admin-header-actions">
          <Link
            to="/admin"
            className="admin-button admin-dashboard-button"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>

        {error && (
          <div className="admin-message admin-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-message admin-success">
            {success}
          </div>
        )}

        {loading && <p>Loading orders...</p>}

        {!loading && orders.length === 0 && (
          <div className="admin-form-card">
            <h3>No orders found</h3>
            <p>
              There are currently no customer orders in the system.
            </p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="admin-orders-section">

            <div className="admin-section-header">
              <div>
                <p className="section-label">CUSTOMER ORDERS</p>
                <h3>Orders</h3>
              </div>

              <span className="admin-product-count">
                {orders.length} order
                {orders.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>

                      <td>
                        <strong>#{order.id}</strong>
                      </td>

                      <td>
                        {order.customer_name ||
                          order.customer_email ||
                          order.user_email ||
                          'Customer'}
                      </td>

                      <td>
                        {formatMoney(order.total_amount)}
                      </td>

                      <td>
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(event) =>
                            updateStatus(
                              order.id,
                              event.target.value
                            )
                          }
                          className={`admin-order-status status-${order.status}`}
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="processing">
                            Processing
                          </option>

                          <option value="shipped">
                            Shipped
                          </option>

                          <option value="delivered">
                            Delivered
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>
                        </select>
                      </td>

                      <td>
                        {formatDate(order.created_at)}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={() => viewOrder(order.id)}
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedOrder && (
          <div className="admin-order-details">

            <div className="admin-section-header">
              <div>
                <p className="section-label">
                  ORDER DETAILS
                </p>

                <h3>
                  Order #{selectedOrder.id}
                </h3>
              </div>

              <button
                type="button"
                className="admin-cancel-button"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>

            <div className="admin-order-summary">

              <div>
                <strong>Customer</strong>
                <p>
                  {selectedOrder.customer_name ||
                    selectedOrder.customer_email ||
                    selectedOrder.user_email ||
                    'Customer'}
                </p>
              </div>

              <div>
                <strong>Status</strong>
                <p>{selectedOrder.status}</p>
              </div>

              <div>
                <strong>Total</strong>
                <p>
                  {formatMoney(selectedOrder.total_amount)}
                </p>
              </div>

              <div>
                <strong>Date</strong>
                <p>
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>

            </div>

            {selectedOrder.items && (
              <div className="admin-order-items">

                <h4>Order Items</h4>

                <div className="admin-table-wrapper">
                  <table className="admin-products-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>

                    <tbody>
  {selectedOrder.items.map((item, index) => (
    <tr key={item.id || index}>
      <td>
        {item.product_name || 'Product'}
      </td>

      <td>
        {item.quantity}
      </td>

      <td>
        {formatMoney(item.unit_price)}
      </td>

      <td>
        {formatMoney(item.subtotal)}
      </td>
    </tr>
  ))}
</tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        )}

        <div className="admin-footer-links">

          <Link
            to="/admin"
            className="product-button"
          >
            Back to Dashboard
          </Link>

          <Link
            to="/"
            className="btn btn-secondary"
          >
            View Website
          </Link>

        </div>

      </div>
    </section>
  )
}

export default AdminOrders

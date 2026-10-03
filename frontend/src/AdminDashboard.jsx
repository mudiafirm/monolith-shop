
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function AdminDashboard({ token }) {
  const navigate = useNavigate()

  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const loadDashboard = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 401 || response.status === 403) {
          throw new Error('You do not have administrator access.')
        }

        if (!response.ok) {
          throw new Error('Failed to load dashboard.')
        }

        const data = await response.json()

        setSummary(data.summary)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [token, navigate])

  if (loading) {
    return (
      <section className="section admin-page">
        <div className="container">
          <p>Loading admin dashboard...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section admin-page">
        <div className="container">
          <p className="section-label">NADIAFIRM ADMINISTRATION</p>

          <h1>Admin Dashboard</h1>

          <p className="admin-error">{error}</p>

          <Link to="/" className="admin-button">
            Return to Website
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section admin-page">
      <div className="container">

        <p className="section-label">NADIAFIRM ADMINISTRATION</p>

        <h1>Admin Dashboard</h1>

        <p className="section-intro">
          Manage products, orders, customers and business activity
          from one place.
        </p>

        {/* Dashboard Summary */}
        <div className="admin-grid">

          <div className="info-card">
            <h3>Total Products</h3>
            <p>{summary.totalProducts}</p>
          </div>

          <div className="info-card">
            <h3>Total Orders</h3>
            <p>{summary.totalOrders}</p>
          </div>

          <div className="info-card">
            <h3>Pending Orders</h3>
            <p>{summary.pendingOrders}</p>
          </div>

          <div className="info-card">
            <h3>Processing Orders</h3>
            <p>{summary.processingOrders}</p>
          </div>

          <div className="info-card">
            <h3>Total Customers</h3>
            <p>{summary.totalCustomers}</p>
          </div>

          <div className="info-card">
            <h3>Total Revenue</h3>
            <p>
              ₦{Number(summary.totalRevenue).toLocaleString('en-NG')}
            </p>
          </div>

        </div>

        {/* Management Navigation */}
        <section className="admin-management">

          <div className="admin-section-header">
            <div>
              <p className="section-label">MANAGEMENT</p>
              <h2>Administration Tools</h2>
            </div>
          </div>

          <div className="admin-management-grid">

            <Link
              to="/admin/products"
              className="admin-management-card"
            >
              <div className="admin-management-icon">
                📦
              </div>

              <h3>Product Management</h3>

              <p>
                Add, edit, review and remove products from the
                NadiaFirm catalogue.
              </p>

              <span>Manage Products →</span>
            </Link>

            <Link
              to="/admin/orders"
              className="admin-management-card"
            >
              <div className="admin-management-icon">
                🛒
              </div>

              <h3>Order Management</h3>

              <p>
                Review customer orders and update order status
                as they progress.
              </p>

              <span>Manage Orders →</span>
            </Link>

            <Link
              to="/admin/customers"
              className="admin-management-card"
            >
              <div className="admin-management-icon">
                👥
              </div>

              <h3>Customer Management</h3>

              <p>
                View registered customers, order history and
                customer spending.
              </p>

              <span>Manage Customers →</span>
            </Link>

          </div>

          <Link
  to="/admin/payments"
  className="admin-tool-card"
>
  <div className="admin-tool-card-icon">
    ₦
  </div>

  <div>
    <h3>Payment Management</h3>

    <p>
      Review customer payments, transaction references,
      payment methods, and payment status.
    </p>
  </div>
</Link>          


        </section>

        {/* Quick Actions */}
        <div className="admin-actions">

          <Link to="/admin/products" className="admin-button">
            Manage Products
          </Link>

          <Link to="/admin/orders" className="admin-button">
            Manage Orders
          </Link>

          <Link to="/admin/customers" className="admin-button">
            Manage Customers
          </Link>

          <Link
            to="/"
            className="admin-button admin-button-secondary"
          >
            View Website
          </Link>

        </div>

      </div>
    </section>
  )
}

export default AdminDashboard

import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Profile({ token, setToken }) {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await fetch('/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load profile')
        }

        setUser(data.user)
      } catch (error) {
        console.error('Profile error:', error)
        setError(error.message)

        if (
          error.message.toLowerCase().includes('token') ||
          error.message.toLowerCase().includes('unauthorized')
        ) {
          localStorage.removeItem('token')
          setToken('')
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [token, navigate, setToken])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
    navigate('/login')
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading your account...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <p className="form-error">{error}</p>
          <Link to="/login">Return to Login</Link>
        </div>
      </section>
    )
  }

  if (!user) {
    return null
  }

  return (
    <section className="section">
      <div className="container">
        <p className="section-label">CUSTOMER ACCOUNT</p>

        <h2>My Account</h2>

        <p className="section-intro">
          Manage your NadiaFirm customer account and access your orders.
        </p>

        <div className="account-layout">
          <div className="account-card">
            <div className="account-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <h3>{user.name}</h3>

            <p className="account-email">
              {user.email}
            </p>

            <div className="account-details">
              <div>
                <span>Customer ID</span>
                <strong>#{user.id}</strong>
              </div>

              <div>
                <span>Account Name</span>
                <strong>{user.name}</strong>
              </div>

              <div>
                <span>Email Address</span>
                <strong>{user.email}</strong>
              </div>

              {user.created_at && (
                <div>
                  <span>Member Since</span>
                  <strong>
                    {new Date(user.created_at).toLocaleDateString('en-NG')}
                  </strong>
                </div>
              )}
            </div>
          </div>

          <div className="account-actions">
            <h3>Account Services</h3>

            <Link to="/orders" className="account-action">
              <strong>My Orders</strong>
              <span>View your order history and order status.</span>
            </Link>

            <Link to="/#products" className="account-action">
              <strong>Continue Shopping</strong>
              <span>Browse NadiaFirm products and solutions.</span>
            </Link>

            <button
              type="button"
              className="account-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="account-footer">
          <Link to="/">Return to NadiaFirm</Link>
        </div>
      </div>
    </section>
  )
}

export default Profile

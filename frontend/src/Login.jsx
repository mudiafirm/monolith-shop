import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login({ setToken }) {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      setToken(data.token)

      localStorage.setItem('token', data.token)

      navigate('/checkout')
    } catch (error) {
      console.error('Login error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <p className="section-label">CUSTOMER LOGIN</p>

        <h2>Login to Your Account</h2>

        <p className="section-intro">
          Sign in to continue to checkout.
        </p>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="checkout-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <button
            type="submit"
            className="product-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>
          Don't have an account?{' '}
          <Link to="/register">
            Create an account
          </Link>
        </p>

        <Link to="/cart" className="product-button">
          Back to Cart
        </Link>
      </div>
    </section>
  )
}

export default Login

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setSuccess(
        'Your NadiaFirm account has been created successfully.'
      )

      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <p className="section-label">CUSTOMER REGISTRATION</p>

        <h2>Create Your NadiaFirm Account</h2>

        <p className="section-intro">
          Create an account to place orders and view your order history.
        </p>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        {success && (
          <p className="form-success">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="checkout-form">
          <label>
            Full Name

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              autoComplete="name"
              placeholder="Enter your full name"
            />
          </label>

          <label>
            Email Address

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              placeholder="Enter your email address"
            />
          </label>

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength="6"
              autoComplete="new-password"
              placeholder="Create a password"
            />
          </label>

          <label>
            Confirm Password

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              required
              minLength="6"
              autoComplete="new-password"
              placeholder="Confirm your password"
            />
          </label>

          <button
            type="submit"
            className="product-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p>
          Already have an account?{' '}
          <Link to="/login">
            Login here
          </Link>
        </p>

        <Link to="/" className="product-button">
          Return to NadiaFirm
        </Link>
      </div>
    </section>
  )
}

export default Register

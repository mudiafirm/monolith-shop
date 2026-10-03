import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Checkout({ cart, token, setCart }) {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)

  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  )

  const handlePlaceOrder = async () => {
    setError('')

    if (!token) {
      navigate('/login')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to place order')
      }

      setOrder(data.order)
      setCart([])
    } catch (error) {
      console.error('Place order error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0 && !order) {
    return (
      <section className="section">
        <div className="container">
          <p className="section-label">CHECKOUT</p>

          <h2>Your Cart Is Empty</h2>

          <p>Add a product before proceeding to checkout.</p>

          <Link to="/#products" className="product-button">
            Continue Shopping
          </Link>
        </div>
      </section>
    )
  }

  if (order) {
    return (
      <section className="section">
        <div className="container">
          <p className="section-label">ORDER CONFIRMED</p>

          <h2>Thank You for Your Order</h2>

          <p className="section-intro">
            Your NadiaFirm order has been created successfully.
          </p>

          <div className="cart-summary">
            <h3>Order #{order.id}</h3>

            <p>
              Status: <strong>{order.status}</strong>
            </p>

            <h3>
              Total: ₦
              {Number(order.totalAmount).toLocaleString('en-NG')}
            </h3>

            <p>
              We have recorded your order and will process it according to
              the order status and payment workflow.
            </p>

            <Link to="/" className="product-button">
              Return to NadiaFirm
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <p className="section-label">CHECKOUT</p>

        <h2>Checkout</h2>

        <p className="section-intro">
          Review your order before completing your purchase.
        </p>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <div className="cart-summary">
          {cart.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>

              <p>
                Quantity: {item.quantity}
              </p>

              <p>
                Subtotal: ₦
                {(
                  Number(item.price) * item.quantity
                ).toLocaleString('en-NG')}
              </p>
            </div>
          ))}

          <h2>
            Order Total: ₦{cartTotal.toLocaleString('en-NG')}
          </h2>

          {!token && (
            <p>
              You must be logged in before placing an order.
            </p>
          )}

          <div>
            <Link to="/cart" className="product-button">
              Back to Cart
            </Link>

            {!token ? (
              <Link to="/login" className="product-button">
                Login to Continue
              </Link>
            ) : (
              <button
                type="button"
                className="product-button"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Checkout

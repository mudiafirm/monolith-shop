import { Link } from 'react-router-dom'

function Cart({ cart, setCart }) {
  const updateQuantity = (productId, change) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Math.max(1, item.quantity + change),
              }
            : item
        )
    )
  }

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    )
  }

  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  )

  return (
    <section className="section">
      <div className="container">
        <p className="section-label">SHOPPING CART</p>

        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <div>
            <p>Your cart is currently empty.</p>

            <Link to="/#products" className="product-button">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div>
                    <h3>{item.name}</h3>

                    <p>{item.description}</p>

                    <p className="product-price">
                      ₦{Number(item.price).toLocaleString('en-NG')}
                    </p>
                  </div>

                  <div className="cart-controls">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      +
                    </button>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <p>
                    Subtotal: ₦
                    {(
                      Number(item.price) * item.quantity
                    ).toLocaleString('en-NG')}
                  </p>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>
                Cart Total: ₦{cartTotal.toLocaleString('en-NG')}
              </h3>

              <Link to="/#products" className="product-button">
                Continue Shopping
              </Link>

              <Link to="/checkout" className="product-button">
  Proceed to Checkout
</Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Cart

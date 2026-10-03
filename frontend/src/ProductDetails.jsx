import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function ProductDetails({ addToCart }) {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/products/${id}`)

        if (!response.ok) {
          throw new Error('Product not found')
        }

        const data = await response.json()
        setProduct(data.product)
      } catch (error) {
        console.error('Product details error:', error)
        setError('Unable to load this product.')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p>Loading product details...</p>
        </div>
      </section>
    )
  }

  if (error || !product) {
    return (
      <section className="section">
        <div className="container">
          <p>{error || 'Product not found.'}</p>

          <Link to="/#products">
            Back to Products
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <p className="section-label">PRODUCT DETAILS</p>

        <h2>{product.name}</h2>

        <p className="section-intro">
          {product.description}
        </p>

        <div className="product-card">
          <div className="product-placeholder">⚡</div>

          <h3>{product.name}</h3>

          <p>{product.description}</p>

          <p className="product-price">
            ₦{Number(product.price).toLocaleString('en-NG')}
          </p>

          <p>
  {product.stock > 0
    ? `${product.stock} available`
    : 'Out of stock'}
</p>

<button
  type="button"
  disabled={product.stock <= 0}
  onClick={() => addToCart(product)}
>
  Add to Cart
</button>

<Link to="/#products">
  Back to Products
</Link>
        </div>
      </div>
    </section>
  )
}

export default ProductDetails

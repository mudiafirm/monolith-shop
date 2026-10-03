import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  })

  const token = localStorage.getItem('token')

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/admin/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load products')
      }

      setProducts(data.products || [])
    } catch (error) {
      console.error('Load products error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      stock: '',
    })

    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const url = editingId
        ? `/api/admin/products/${editingId}`
        : '/api/admin/products'

      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save product')
      }

      setSuccess(
        editingId
          ? 'Product updated successfully.'
          : 'Product created successfully.'
      )

      resetForm()

      await loadProducts()
    } catch (error) {
      console.error('Save product error:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setError('')
    setSuccess('')

    setEditingId(product.id)

    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      setSuccess('')

      const response = await fetch(
        `/api/admin/products/${product.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product')
      }

      setSuccess('Product deleted successfully.')

      await loadProducts()
    } catch (error) {
      console.error('Delete product error:', error)
      setError(error.message)
    }
  }

  return (
  <section className="section admin-products-page">
    <div className="container">

      <div className="admin-page-header">

        <div>
          <p className="section-label">
            NADIAFIRM ADMINISTRATION
          </p>

          <h1>Product Management</h1>

          <p className="section-intro">
            Add, edit, review and manage products in the
            NadiaFirm catalogue.
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

        <p className="section-intro">
          Add, update and manage products available through
          NadiaFirm Systems & Services.
        </p>

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

        {/* Product Form */}
        <div className="admin-form-card">

          <h3>
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h3>

          <form onSubmit={handleSubmit} className="admin-product-form">

            <label>
              Product Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Solar Panel 550W"
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the product"
                rows="4"
              />
            </label>

            <div className="admin-form-row">

              <label>
                Price (₦)
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="185000"
                  required
                />
              </label>

              <label>
                Stock
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="10"
                  required
                />
              </label>

            </div>

            <div className="admin-form-actions">

              <button
                type="submit"
                className="product-button"
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Product'
                    : 'Add Product'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>
        </div>

        {/* Product List */}
        <div className="admin-products-section">

          <div className="admin-section-header">
            <div>
              <p className="section-label">INVENTORY</p>
              <h3>Products</h3>
            </div>

            <span className="admin-product-count">
              {products.length} product
              {products.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading && (
            <p>Loading products...</p>
          )}

          {!loading && products.length === 0 && (
            <p>No products found.</p>
          )}

          {!loading && products.length > 0 && (
            <div className="admin-table-wrapper">

              <table className="admin-products-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {products.map((product) => (
                    <tr key={product.id}>

                      <td>#{product.id}</td>

                      <td>
                        <strong>{product.name}</strong>
                      </td>

                      <td>
                        {product.description || '—'}
                      </td>

                      <td>
                        ₦{Number(product.price).toLocaleString('en-NG')}
                      </td>

                      <td>
                        <span
                          className={
                            product.stock === 0
                              ? 'stock-out'
                              : product.stock <= 3
                                ? 'stock-low'
                                : 'stock-good'
                          }
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td>
                        <div className="admin-table-actions">

                          <button
                            type="button"
                            className="admin-edit-button"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() => handleDelete(product)}
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

        <div className="admin-footer-links">
          <Link to="/admin" className="product-button">
            Back to Dashboard
          </Link>

          <Link to="/" className="btn btn-secondary">
            View Website
          </Link>
        </div>

      </div>
    </section>
  )
}

export default AdminProducts

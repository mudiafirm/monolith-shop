import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPayment, setSelectedPayment] = useState(null)

  const token = localStorage.getItem('token')


  async function fetchPayments() {
    try {
      setLoading(true)
      setError('')

      const response = await fetch('/api/admin/payments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load payments'
        )
      }

      setPayments(data.payments || [])

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchPayments()
  }, [])


  function formatCurrency(value) {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(Number(value))
  }


  function formatDate(value) {
    return new Date(value).toLocaleDateString(
      'en-NG',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )
  }


  function getStatusClass(status) {
    return `payment-status payment-status-${status}`
  }


  return (
    <section className="section admin-payments-page">
      <div className="container">

        <div className="admin-page-header">

          <div>
            <p className="section-label">
              NADIAFIRM ADMINISTRATION
            </p>

            <h1>Payment Management</h1>

            <p className="section-intro">
              View customer payments, transaction references,
              payment methods, amounts, and payment status.
            </p>
          </div>

          <div className="admin-header-actions">

            <Link
              to="/admin"
              className="admin-button admin-dashboard-button"
            >
              ← Back to Dashboard
            </Link>

            <button
              className="admin-button"
              onClick={fetchPayments}
            >
              Refresh
            </button>

          </div>

        </div>


        {error && (
          <div className="admin-message admin-error">
            {error}
          </div>
        )}


        {loading ? (
          <div className="admin-loading">
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div className="admin-empty-state">
            <h2>No payments found</h2>
            <p>
              Customer payments will appear here when
              transactions are recorded.
            </p>
          </div>
        ) : (

          <div className="admin-table-card">

            <div className="admin-table-header">
              <div>
                <h2>Payments</h2>
                <p>
                  {payments.length}{' '}
                  {payments.length === 1
                    ? 'payment'
                    : 'payments'}
                </p>
              </div>
            </div>


            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Payment</th>
                    <th>Customer</th>
                    <th>Order</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>


                <tbody>

                  {payments.map((payment) => (

                    <tr key={payment.id}>

                      <td>
                        <strong>
                          #{payment.id}
                        </strong>

                        <div className="payment-reference">
                          {payment.transaction_reference}
                        </div>
                      </td>


                      <td>
                        <strong>
                          {payment.customer_name}
                        </strong>

                        <div className="admin-table-subtext">
                          {payment.customer_email}
                        </div>
                      </td>


                      <td>
                        #{payment.order_id}
                      </td>


                      <td>
                        <strong>
                          {formatCurrency(payment.amount)}
                        </strong>
                      </td>


                      <td>
                        {payment.payment_method}
                      </td>


                      <td>
                        <span
                          className={getStatusClass(
                            payment.status
                          )}
                        >
                          {payment.status}
                        </span>
                      </td>


                      <td>
                        {formatDate(payment.created_at)}
                      </td>


                      <td>

                        <button
                          className="admin-button admin-small-button"
                          onClick={() =>
                            setSelectedPayment(payment)
                          }
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


        {selectedPayment && (

          <div className="admin-modal-overlay">

            <div className="admin-modal">

              <div className="admin-modal-header">

                <div>
                  <p className="section-label">
                    PAYMENT DETAILS
                  </p>

                  <h2>
                    Payment #{selectedPayment.id}
                  </h2>
                </div>

                <button
                  className="admin-modal-close"
                  onClick={() =>
                    setSelectedPayment(null)
                  }
                >
                  ×
                </button>

              </div>


              <div className="payment-details">

                <div className="payment-detail-item">
                  <span>Customer</span>
                  <strong>
                    {selectedPayment.customer_name}
                  </strong>
                </div>


                <div className="payment-detail-item">
                  <span>Email</span>
                  <strong>
                    {selectedPayment.customer_email}
                  </strong>
                </div>


                <div className="payment-detail-item">
                  <span>Order</span>
                  <strong>
                    #{selectedPayment.order_id}
                  </strong>
                </div>


                <div className="payment-detail-item">
                  <span>Amount</span>
                  <strong>
                    {formatCurrency(
                      selectedPayment.amount
                    )}
                  </strong>
                </div>


                <div className="payment-detail-item">
                  <span>Payment Method</span>
                  <strong>
                    {selectedPayment.payment_method}
                  </strong>
                </div>


                <div className="payment-detail-item">
                  <span>Status</span>

                  <span
                    className={getStatusClass(
                      selectedPayment.status
                    )}
                  >
                    {selectedPayment.status}
                  </span>
                </div>


                <div className="payment-detail-item payment-detail-full">
                  <span>
                    Transaction Reference
                  </span>

                  <strong className="payment-reference-full">
                    {selectedPayment.transaction_reference}
                  </strong>
                </div>


                <div className="payment-detail-item">
                  <span>Date</span>

                  <strong>
                    {formatDate(
                      selectedPayment.created_at
                    )}
                  </strong>
                </div>

              </div>


              <div className="admin-modal-footer">

                <button
                  className="admin-button"
                  onClick={() =>
                    setSelectedPayment(null)
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </section>
  )
}


export default AdminPayments

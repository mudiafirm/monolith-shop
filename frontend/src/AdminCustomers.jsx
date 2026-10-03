import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function AdminCustomers() {
  const token = localStorage.getItem('token');

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState('');

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/admin/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load customers');
      }

      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const viewCustomer = async (id) => {
    try {
      setDetailsLoading(true);
      setError('');

      const response = await fetch(`/api/admin/customers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load customer details');
      }

      const data = await response.json();
      setSelectedCustomer(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <main className="admin-customers-page">
        <div className="container">
          <p>Loading customers...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-customers-page">
      <div className="container">

        <div className="admin-page-header">

  <div>
    <p className="section-label">NADIAFIRM ADMINISTRATION</p>

    <h1>Customer Management</h1>

    <p className="section-intro">
      Manage registered customers, review their orders,
      and view customer spending information.
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
      onClick={fetchCustomers}
    >
      Refresh
    </button>

  </div>

</div>

        {error && (
          <div className="admin-message admin-message-error">
            {error}
          </div>
        )}

        <section className="admin-customers-section">

          <div className="admin-section-header">
            <h3>Customers</h3>
            <span className="admin-product-count">
              {customers.length} customer{customers.length !== 1 ? 's' : ''}
            </span>
          </div>

          {customers.length === 0 ? (
            <p>No customers found.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-products-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{formatDate(customer.created_at)}</td>
                      <td>{customer.order_count}</td>
                      <td>{formatMoney(customer.total_spent)}</td>
                      <td>
                        <button
                          className="admin-edit-button"
                          onClick={() => viewCustomer(customer.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </section>

        {detailsLoading && (
          <section className="admin-customer-details">
            <p>Loading customer details...</p>
          </section>
        )}

        {selectedCustomer && !detailsLoading && (
          <section className="admin-customer-details">

            <div className="admin-section-header">
              <h3>Customer Details</h3>

              <button
                className="admin-cancel-button"
                onClick={() => setSelectedCustomer(null)}
              >
                Close
              </button>
            </div>

            <div className="admin-customer-summary">

              <div>
                <span>Name</span>
                <strong>{selectedCustomer.customer.name}</strong>
              </div>

              <div>
                <span>Email</span>
                <strong>{selectedCustomer.customer.email}</strong>
              </div>

              <div>
                <span>Joined</span>
                <strong>
                  {formatDate(selectedCustomer.customer.created_at)}
                </strong>
              </div>

            </div>

            <h4>Order History</h4>

            {selectedCustomer.orders.length === 0 ? (
              <p>This customer has no orders.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-products-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedCustomer.orders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>
                          <span
                            className={`admin-order-status status-${order.status}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>{formatMoney(order.total_amount)}</td>
                        <td>{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </section>
        )}

      </div>
    </main>
  );
}

export default AdminCustomers;

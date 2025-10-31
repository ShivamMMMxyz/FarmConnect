import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { clearToken, clearUserData } from '../utils/storage';
import './Orders.css';

function Orders({ user, setUser }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    clearUserData();
    setUser(null);
    navigate('/');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return colors[status] || 'status-pending';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2>🌾 FarmConnect</h2>
        </div>
        <div className="nav-links">
          <Link to="/customer/dashboard">Dashboard</Link>
          <Link to="/customer/browse-products">Browse Products</Link>
          <Link to="/customer/browse-tools">Browse Tools</Link>
          <Link to="/customer/cart">Cart</Link>
          <Link to="/customer/orders">My Orders</Link>
        </div>
        <div className="nav-user">
          <span>👤 {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="orders-content">
        <div className="page-header">
          <h1>My Orders 📦</h1>
          <p>Track and manage your orders</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping for fresh products and tools!</p>
            <div className="empty-actions">
              <Link to="/customer/browse-products" className="btn btn-primary">
                Browse Products
              </Link>
              <Link to="/customer/browse-tools" className="btn btn-secondary">
                Browse Tools
              </Link>
            </div>
          </div>
        ) : (
          <div className="orders-list-page">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>
                      {order.orderType === 'purchase' ? '📦 Purchase Order' : '🚜 Tool Rental'}
                    </h3>
                    <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`status ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-body">
                  <div className="order-item-details">
                    {order.productId ? (
                      <>
                        <div className="item-info">
                          <h4>{order.productId.name}</h4>
                          <p>{order.productId.category} • {order.quantity} {order.productId.unit}</p>
                          <p className="farmer-info">👨‍🌾 Farmer: {order.productId.farmer?.name}</p>
                        </div>
                      </>
                    ) : order.toolId ? (
                      <>
                        <div className="item-info">
                          <h4>{order.toolId.name}</h4>
                          <p>{order.toolId.category.replace('_', ' ')} • {order.rentalDays} days</p>
                          <p className="farmer-info">👨‍🌾 Owner: {order.toolId.farmer?.name}</p>
                        </div>
                      </>
                    ) : (
                      <div className="item-info">
                        <h4>Item information unavailable</h4>
                      </div>
                    )}
                  </div>

                  <div className="order-total">
                    <span className="total-label">Total Amount</span>
                    <span className="total-amount">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {order.orderType === 'rental' && order.status === 'confirmed' && (
                  <div className="rental-info">
                    <p>📅 Rental Period: {order.rentalDays} days</p>
                    <p>💡 Please coordinate with the farmer for pickup and return</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;

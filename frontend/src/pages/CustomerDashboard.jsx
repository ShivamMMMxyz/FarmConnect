import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { clearToken, clearUserData } from '../utils/storage';
import './CustomerDashboard.css';

function CustomerDashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      
      if (response.data.success) {
        const orders = response.data.orders;
        setStats({
          totalOrders: orders.length,
          recentOrders: orders.slice(0, 5)
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const getOrderTypeDisplay = (type) => {
    return type === 'purchase' ? '📦 Purchase' : '🚜 Rental';
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

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

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
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}! 🛒</h1>
          <p className="subtitle">Discover fresh farm products and tools</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-info">
              <h3>{user?.email}</h3>
              <p>Email</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📱</div>
            <div className="stat-info">
              <h3>{user?.phone}</h3>
              <p>Phone</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-info">
              <h3>{user?.address?.city || 'Not Set'}</h3>
              <p>City</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/customer/browse-products" className="action-card">
              <div className="action-icon">🥬</div>
              <h3>Browse Products</h3>
              <p>Fresh fruits and vegetables</p>
            </Link>

            <Link to="/customer/browse-tools" className="action-card">
              <div className="action-icon">🚜</div>
              <h3>Browse Tools</h3>
              <p>Rent farming equipment</p>
            </Link>

            <Link to="/customer/cart" className="action-card">
              <div className="action-icon">🛒</div>
              <h3>View Cart</h3>
              <p>Check your cart items</p>
            </Link>

            <Link to="/customer/orders" className="action-card">
              <div className="action-icon">📋</div>
              <h3>My Orders</h3>
              <p>Track your orders</p>
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-section">
          <h2>Recent Orders</h2>
          {stats.recentOrders.length > 0 ? (
            <div className="orders-list">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-info">
                    <h4>{order.productId?.name || order.toolId?.name || 'Item'}</h4>
                    <p>
                      {getOrderTypeDisplay(order.orderType)} • ₹{order.totalAmount} • 
                      <span className="order-date">
                        {' '}{new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <span className={`status ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-small">
              <p>No orders yet. Start shopping for fresh produce!</p>
              <Link to="/customer/browse-products" className="btn btn-primary">
                Browse Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;

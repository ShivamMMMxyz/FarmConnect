import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, toolAPI } from '../services/api';
import { clearToken, clearUserData } from '../utils/storage';
import './FarmerDashboard.css';

function FarmerDashboard({ user, setUser }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalTools: 0,
    recentProducts: [],
    recentTools: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, toolsRes] = await Promise.all([
        productAPI.getMyProducts(),
        toolAPI.getMyTools()
      ]);

      if (productsRes.data.success && toolsRes.data.success) {
        const products = productsRes.data.products;
        const tools = toolsRes.data.tools;

        setStats({
          totalProducts: products.length,
          totalTools: tools.length,
          recentProducts: products.slice(0, 3),
          recentTools: tools.slice(0, 3)
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
          <Link to="/farmer/dashboard">Dashboard</Link>
          <Link to="/farmer/products">My Products</Link>
          <Link to="/farmer/tools">My Tools</Link>
        </div>
        <div className="nav-user">
          <span>👤 {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name}! 🚜</h1>
          <p className="subtitle">Here's what's happening with your farm today</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚜</div>
            <div className="stat-info">
              <h3>{stats.totalTools}</h3>
              <p>Total Tools</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-info">
              <h3>{user?.farmLocation}</h3>
              <p>Farm Location</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📏</div>
            <div className="stat-info">
              <h3>{user?.farmSize}</h3>
              <p>Farm Size</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/farmer/add-product" className="action-card">
              <div className="action-icon">➕</div>
              <h3>Add Product</h3>
              <p>List a new product for sale</p>
            </Link>

            <Link to="/farmer/add-tool" className="action-card">
              <div className="action-icon">🛠️</div>
              <h3>Add Tool</h3>
              <p>List a tool for rent</p>
            </Link>

            <Link to="/farmer/products" className="action-card">
              <div className="action-icon">📋</div>
              <h3>View Products</h3>
              <p>Manage your products</p>
            </Link>

            <Link to="/farmer/tools" className="action-card">
              <div className="action-icon">🔧</div>
              <h3>View Tools</h3>
              <p>Manage your tools</p>
            </Link>
          </div>
        </div>

        {/* Recent Items */}
        <div className="recent-section">
          <div className="recent-group">
            <h2>Recent Products</h2>
            {stats.recentProducts.length > 0 ? (
              <div className="recent-list">
                {stats.recentProducts.map((product) => (
                  <div key={product._id} className="recent-item">
                    <div className="item-info">
                      <h4>{product.name}</h4>
                      <p>{product.category} • ₹{product.price}/{product.unit}</p>
                    </div>
                    <span className={`status ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No products yet. Add your first product!</p>
            )}
          </div>

          <div className="recent-group">
            <h2>Recent Tools</h2>
            {stats.recentTools.length > 0 ? (
              <div className="recent-list">
                {stats.recentTools.map((tool) => (
                  <div key={tool._id} className="recent-item">
                    <div className="item-info">
                      <h4>{tool.name}</h4>
                      <p>{tool.category} • ₹{tool.rentalPrice.perDay}/day</p>
                    </div>
                    <span className={`status ${tool.available ? 'in-stock' : 'out-stock'}`}>
                      {tool.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No tools yet. Add your first tool!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerDashboard;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toolAPI } from '../services/api';
import { clearToken, clearUserData } from '../utils/storage';
import './MyProducts.css';

function MyTools({ user, setUser }) {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await toolAPI.getMyTools();
      
      if (response.data.success) {
        setTools(response.data.tools);
      }
    } catch (err) {
      setError('Failed to load tools');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (toolId) => {
    if (!window.confirm('Are you sure you want to delete this tool?')) {
      return;
    }

    try {
      const response = await toolAPI.deleteTool(toolId);
      
      if (response.data.success) {
        setTools(tools.filter(t => t._id !== toolId));
      }
    } catch (err) {
      alert('Failed to delete tool');
      console.error(err);
    }
  };

  const handleLogout = () => {
    clearToken();
    clearUserData();
    setUser(null);
    navigate('/');
  };

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
      <div className="my-products-content">
        <div className="page-header">
          <div>
            <h1>My Tools 🚜</h1>
            <p>Manage your listed tools for rent</p>
          </div>
          <Link to="/farmer/add-tool" className="btn btn-primary">
            ➕ Add New Tool
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading tools...</div>
        ) : tools.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚜</div>
            <h3>No tools yet</h3>
            <p>Start by adding your first tool for rent!</p>
            <Link to="/farmer/add-tool" className="btn btn-primary">
              Add Tool
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {tools.map((tool) => (
              <div key={tool._id} className="product-card">
                {tool.image && (
                  <div className="product-image">
                    <img src={tool.image} alt={tool.name} />
                  </div>
                )}
                
                <div className="product-body">
                  <div className="product-header">
                    <h3>{tool.name}</h3>
                    <span className={`badge ${tool.available ? 'badge-success' : 'badge-danger'}`}>
                      {tool.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>

                  {tool.description && (
                    <p className="product-description">{tool.description}</p>
                  )}

                  <div className="product-details">
                    <div className="detail-item">
                      <span className="label">Category:</span>
                      <span className="value">{tool.category.replace('_', ' ')}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Per Day:</span>
                      <span className="value price">₹{tool.rentalPrice.perDay}</span>
                    </div>
                    {tool.rentalPrice.perWeek && (
                      <div className="detail-item">
                        <span className="label">Per Week:</span>
                        <span className="value">₹{tool.rentalPrice.perWeek}</span>
                      </div>
                    )}
                    {tool.rentalPrice.perMonth && (
                      <div className="detail-item">
                        <span className="label">Per Month:</span>
                        <span className="value">₹{tool.rentalPrice.perMonth}</span>
                      </div>
                    )}
                  </div>

                  <div className="product-actions">
                    <button
                      onClick={() => handleDelete(tool._id)}
                      className="btn btn-danger btn-small"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyTools;

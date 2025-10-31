import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toolAPI } from '../services/api';
import { clearToken, clearUserData } from '../utils/storage';
import './BrowseProducts.css';

function BrowseTools({ user, setUser }) {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  const categories = ['all', 'tractor', 'plough', 'thresher', 'spray_machine', 'harvester', 'other'];

  useEffect(() => {
    fetchTools();
    loadCart();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredTools(tools);
    } else {
      setFilteredTools(tools.filter(t => t.category === selectedCategory));
    }
  }, [selectedCategory, tools]);

  const fetchTools = async () => {
    try {
      const response = await toolAPI.getAllTools();
      
      if (response.data.success) {
        setTools(response.data.tools.filter(t => t.available));
        setFilteredTools(response.data.tools.filter(t => t.available));
      }
    } catch (err) {
      setError('Failed to load tools');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const addToCart = (tool) => {
    const existingItem = cart.find(item => item._id === tool._id && item.type === 'tool');
    
    if (existingItem) {
      alert('Tool already in cart!');
      return;
    }

    const newCart = [...cart, { ...tool, type: 'tool', rentalDays: 1 }];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert('Added to cart! 🛒');
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
          <Link to="/customer/dashboard">Dashboard</Link>
          <Link to="/customer/browse-products">Browse Products</Link>
          <Link to="/customer/browse-tools">Browse Tools</Link>
          <Link to="/customer/cart">Cart ({cart.length})</Link>
          <Link to="/customer/orders">My Orders</Link>
        </div>
        <div className="nav-user">
          <span>👤 {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="browse-content">
        <div className="page-header">
          <h1>Browse Tools 🚜</h1>
          <p>Rent farming equipment from local farmers</p>
        </div>

        {/* Category Filter */}
        <div className="filter-section">
          <h3>Filter by Category:</h3>
          <div className="category-pills">
            {categories.map(cat => (
              <button
                key={cat}
                className={`pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading tools...</div>
        ) : filteredTools.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🚜</div>
            <h3>No tools available</h3>
            <p>Check back later for available tools!</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredTools.map((tool) => (
              <div key={tool._id} className="product-card">
                {tool.image && (
                  <div className="product-image">
                    <img src={tool.image} alt={tool.name} />
                  </div>
                )}
                
                <div className="product-body">
                  <h3>{tool.name}</h3>
                  {tool.description && (
                    <p className="product-description">{tool.description}</p>
                  )}

                  <div className="product-meta">
                    <span className="category-badge">{tool.category.replace('_', ' ')}</span>
                    <span className="farmer-name">👨‍🌾 {tool.farmer?.name}</span>
                  </div>

                  <div className="rental-pricing">
                    <div className="price-row">
                      <span className="label">Per Day:</span>
                      <span className="price">₹{tool.rentalPrice.perDay}</span>
                    </div>
                    {tool.rentalPrice.perWeek && (
                      <div className="price-row">
                        <span className="label">Per Week:</span>
                        <span className="price">₹{tool.rentalPrice.perWeek}</span>
                      </div>
                    )}
                    {tool.rentalPrice.perMonth && (
                      <div className="price-row">
                        <span className="label">Per Month:</span>
                        <span className="price">₹{tool.rentalPrice.perMonth}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(tool)}
                    className="btn btn-primary btn-full"
                  >
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseTools;

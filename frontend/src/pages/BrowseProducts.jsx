import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { clearToken, clearUserData } from '../utils/storage';
import './BrowseProducts.css';

function BrowseProducts({ user, setUser }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  const categories = ['all', 'vegetables', 'fruits', 'grains', 'dairy', 'other'];

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAllProducts();
      
      if (response.data.success) {
        setProducts(response.data.products.filter(p => p.inStock));
        setFilteredProducts(response.data.products.filter(p => p.inStock));
      }
    } catch (err) {
      setError('Failed to load products');
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

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id && item.type === 'product');
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item._id === product._id && item.type === 'product'
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, type: 'product', quantity: 1 }];
    }

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
          <h1>Browse Products 🥬</h1>
          <p>Fresh farm produce delivered to your door</p>
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
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products available</h3>
            <p>Check back later for fresh products!</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                {product.image && (
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                )}
                
                <div className="product-body">
                  <h3>{product.name}</h3>
                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}

                  <div className="product-meta">
                    <span className="category-badge">{product.category}</span>
                    <span className="farmer-name">👨‍🌾 {product.farmer?.name}</span>
                  </div>

                  <div className="product-price">
                    <span className="price">₹{product.price}</span>
                    <span className="unit">/{product.unit}</span>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
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

export default BrowseProducts;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { clearToken, clearUserData } from '../utils/storage';
import './MyProducts.css';

function MyProducts({ user, setUser }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getMyProducts();
      
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await productAPI.deleteProduct(productId);
      
      if (response.data.success) {
        setProducts(products.filter(p => p._id !== productId));
      }
    } catch (err) {
      alert('Failed to delete product');
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
            <h1>My Products 📦</h1>
            <p>Manage your listed products</p>
          </div>
          <Link to="/farmer/add-product" className="btn btn-primary">
            ➕ Add New Product
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products yet</h3>
            <p>Start by adding your first product!</p>
            <Link to="/farmer/add-product" className="btn btn-primary">
              Add Product
            </Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                {product.image && (
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                )}
                
                <div className="product-body">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span className={`badge ${product.inStock ? 'badge-success' : 'badge-danger'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}

                  <div className="product-details">
                    <div className="detail-item">
                      <span className="label">Category:</span>
                      <span className="value">{product.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Price:</span>
                      <span className="value price">₹{product.price}/{product.unit}</span>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      onClick={() => handleDelete(product._id)}
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

export default MyProducts;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { clearToken, clearUserData } from '../utils/storage';
import './AddProduct.css';

function AddProduct({ user, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'vegetables',
    price: '',
    unit: 'kg',
    inStock: true,
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['vegetables', 'fruits', 'grains', 'dairy', 'other'];
  const units = ['kg', 'gram', 'liter', 'piece', 'dozen', 'quintal'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.price) {
      setError('Please fill all required fields');
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      const response = await productAPI.createProduct(formData);
      
      if (response.data.success) {
        setSuccess('Product added successfully! 🎉');
        setTimeout(() => {
          navigate('/farmer/products');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
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
      <div className="add-product-content">
        <div className="page-header">
          <h1>Add New Product 📦</h1>
          <p>List a new product for customers to buy</p>
        </div>

        <div className="form-container">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Fresh Tomatoes"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange}>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Unit *</label>
                  <select name="unit" value={formData.unit} onChange={handleChange}>
                    {units.map(unit => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Pricing & Availability</h3>
              
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                  />
                  <span>Product is in stock</span>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Product Image (Optional)</h3>
              
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                <small>Provide a URL to an image of your product</small>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/farmer/products')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;

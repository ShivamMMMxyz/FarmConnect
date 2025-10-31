import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toolAPI } from '../services/api';
import { clearToken, clearUserData } from '../utils/storage';
import './AddProduct.css';

function AddTool({ user, setUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'tractor',
    rentalPrice: {
      perDay: '',
      perWeek: '',
      perMonth: ''
    },
    available: true,
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['tractor', 'plough', 'thresher', 'spray_machine', 'harvester', 'other'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('rentalPrice.')) {
      const priceField = name.split('.')[1];
      setFormData({
        ...formData,
        rentalPrice: {
          ...formData.rentalPrice,
          [priceField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.rentalPrice.perDay) {
      setError('Please fill all required fields');
      return;
    }

    if (parseFloat(formData.rentalPrice.perDay) <= 0) {
      setError('Rental price must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      const response = await toolAPI.createTool(formData);
      
      if (response.data.success) {
        setSuccess('Tool added successfully! 🎉');
        setTimeout(() => {
          navigate('/farmer/tools');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tool. Please try again.');
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
          <h1>Add New Tool 🚜</h1>
          <p>List a new tool for customers to rent</p>
        </div>

        <div className="form-container">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label>Tool Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., John Deere Tractor"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your tool..."
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Rental Pricing</h3>
              
              <div className="form-group">
                <label>Price per Day (₹) *</label>
                <input
                  type="number"
                  name="rentalPrice.perDay"
                  value={formData.rentalPrice.perDay}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price per Week (₹)</label>
                  <input
                    type="number"
                    name="rentalPrice.perWeek"
                    value={formData.rentalPrice.perWeek}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                  />
                </div>

                <div className="form-group">
                  <label>Price per Month (₹)</label>
                  <input
                    type="number"
                    name="rentalPrice.perMonth"
                    value={formData.rentalPrice.perMonth}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                  />
                  <span>Tool is available for rent</span>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Tool Image (Optional)</h3>
              
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
                <small>Provide a URL to an image of your tool</small>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => navigate('/farmer/tools')}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding Tool...' : 'Add Tool'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTool;

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authAPI } from '../services/api';
import { storeToken, storeUserData } from '../utils/storage';
import './Auth.css';

function Register({ setUser }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'customer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: roleFromUrl,
    farmLocation: '',
    farmSize: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(prev => ({ ...prev, role: roleFromUrl }));
  }, [roleFromUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.role === 'farmer' && (!formData.farmLocation || !formData.farmSize)) {
      setError('Please provide farm location and size');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      
      if (response.data.success) {
        storeToken(response.data.token);
        storeUserData(response.data.user);
        setUser(response.data.user);
        
        // Navigate based on role
        if (response.data.user.role === 'farmer') {
          navigate('/farmer/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box auth-box-large">
        <h1 className="auth-title">
          Register as {formData.role === 'farmer' ? 'Farmer 🚜' : 'Customer 🛒'}
        </h1>
        <p className="auth-subtitle">Create your account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min. 6 characters"
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="1234567890"
              />
            </div>
          </div>

          {formData.role === 'farmer' ? (
            <div className="form-row">
              <div className="form-group">
                <label>Farm Location *</label>
                <input
                  type="text"
                  name="farmLocation"
                  value={formData.farmLocation}
                  onChange={handleChange}
                  required
                  placeholder="City, State"
                />
              </div>

              <div className="form-group">
                <label>Farm Size *</label>
                <input
                  type="text"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 10 acres"
                />
              </div>
            </div>
          ) : (
            <>
              <h3 className="section-title">Delivery Address (Optional)</h3>
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="123 Main St"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="City"
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="State"
                  />
                </div>

                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    placeholder="123456"
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;

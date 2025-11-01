import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="farmer-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Farmer Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
          {user?.farmLocation && user?.farmSize && (
            <div className="farm-info">
              <p><strong>📍 Farm Location:</strong> {user.farmLocation}</p>
              <p><strong>📏 Farm Size:</strong> {user.farmSize}</p>
            </div>
          )}
        </div>

        <div className="dashboard-grid">
          <Link to="/farmer/products" className="dashboard-card">
            <div className="card-icon">🌾</div>
            <h3>My Products</h3>
            <p>Manage your products and listings</p>
          </Link>

          <Link to="/farmer/tools" className="dashboard-card">
            <div className="card-icon">🚜</div>
            <h3>My Tools</h3>
            <p>List and manage your tools</p>
          </Link>

          <Link to="/farmer/crop-recommendation" className="dashboard-card">
            <div className="card-icon">🧠</div>
            <h3>Crop Recommendation</h3>
            <p>Get AI-powered crop suggestions</p>
          </Link>

          <Link to="/farmer/orders" className="dashboard-card">
            <div className="card-icon">📦</div>
            <h3>Orders</h3>
            <p>View and manage your orders</p>
          </Link>

          <Link to="/farmer/add-product" className="dashboard-card">
            <div className="card-icon">➕</div>
            <h3>Add Product</h3>
            <p>List a new product for sale</p>
          </Link>

          <Link to="/farmer/add-tool" className="dashboard-card">
            <div className="card-icon">🔧</div>
            <h3>Add Tool</h3>
            <p>List a new tool for rent</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;

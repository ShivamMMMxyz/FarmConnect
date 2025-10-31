import { Link } from 'react-router-dom';
import './Welcome.css';

function Welcome() {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <h1 className="logo-text">🌾 FarmConnect</h1>
          <p className="tagline">Connecting Farmers with Customers</p>
          <p className="subtitle">Buy fresh produce & rent farm equipment</p>
        </div>

        <div className="action-section">
          <Link to="/login" className="btn btn-primary btn-large">
            Login to Your Account
          </Link>

          <div className="divider">
            <span>New here? Register as:</span>
          </div>

          <div className="role-cards">
            <Link to="/register?role=farmer" className="role-card farmer-card">
              <div className="role-icon">🚜</div>
              <h3>Farmer</h3>
              <p>Sell your produce and rent out equipment</p>
            </Link>

            <Link to="/register?role=customer" className="role-card customer-card">
              <div className="role-icon">🛒</div>
              <h3>Customer</h3>
              <p>Buy fresh products and rent farm tools</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to FarmConnect</h1>
            <p className="hero-subtitle">
              Connecting farmers directly with customers for fresh, quality produce
            </p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary btn-large">
                Browse Products
              </Link>
              <Link to="/register" className="btn btn-secondary btn-large">
                Join as Farmer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose FarmConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌾</div>
              <h3>Fresh Produce</h3>
              <p>Get farm-fresh vegetables and fruits directly from farmers</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚜</div>
              <h3>Quality Tools</h3>
              <p>Browse and rent agricultural tools and equipment</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Direct Connection</h3>
              <p>Connect directly with farmers, no middlemen</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI Recommendations</h3>
              <p>Get crop recommendations using ML technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up as a customer or farmer</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Browse Products</h3>
              <p>Explore fresh produce and tools</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Place Order</h3>
              <p>Add to cart and checkout easily</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Receive Fresh</h3>
              <p>Get farm-fresh products at your door</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of farmers and customers already using FarmConnect</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

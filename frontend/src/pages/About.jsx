import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-hero">
          <h1>About FarmConnect</h1>
          <p className="hero-subtitle">Connecting Farmers Directly with Customers</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              FarmConnect is dedicated to bridging the gap between farmers and consumers by providing
              a direct marketplace platform. We empower farmers to sell their produce directly to
              customers, eliminating middlemen and ensuring fair prices for both parties.
            </p>
          </section>

          <section className="about-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🌾</div>
                <h3>Fresh Produce</h3>
                <p>Direct from farms to your doorstep, ensuring maximum freshness and quality.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🤝</div>
                <h3>Fair Trade</h3>
                <p>Farmers get fair prices for their hard work, and customers get the best value.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3>Smart Farming</h3>
                <p>AI-powered crop recommendations help farmers make informed decisions.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📦</div>
                <h3>Easy Ordering</h3>
                <p>Simple and secure platform for browsing and ordering farm products.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Values</h2>
            <ul className="values-list">
              <li><strong>Sustainability:</strong> Supporting local farmers and reducing carbon footprint</li>
              <li><strong>Transparency:</strong> Complete visibility in pricing and product sourcing</li>
              <li><strong>Quality:</strong> Ensuring only the best produce reaches customers</li>
              <li><strong>Innovation:</strong> Leveraging technology to improve farming practices</li>
              <li><strong>Community:</strong> Building strong relationships between farmers and customers</li>
            </ul>
          </section>

          <section className="about-section cta-section">
            <h2>Join Us Today</h2>
            <p>Whether you're a farmer looking to reach more customers or a consumer seeking fresh, quality produce, FarmConnect is here for you.</p>
            <div className="cta-buttons">
              <a href="/register" className="btn btn-primary">Get Started</a>
              <a href="/contact" className="btn btn-outline">Contact Us</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;

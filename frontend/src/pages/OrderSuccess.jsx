import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/shop');
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="order-success-page">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className="success-message">
            Thank you for your order. Your order has been placed successfully.
          </p>

          <div className="order-details">
            <div className="detail-row">
              <span className="label">Order ID:</span>
              <span className="value">{order.orderId}</span>
            </div>
            <div className="detail-row">
              <span className="label">Order Date:</span>
              <span className="value">
                {new Date(order.orderDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Payment Method:</span>
              <span className="value payment-method">
                {order.paymentMethod === 'card' && '💳 Card Payment'}
                {order.paymentMethod === 'upi' && '📱 UPI Payment'}
                {order.paymentMethod === 'cod' && '💵 Cash on Delivery'}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Total Amount:</span>
              <span className="value amount">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="shipping-info">
            <h3>Delivery Address</h3>
            <p>
              {order.shippingInfo.fullName}<br />
              {order.shippingInfo.address}<br />
              {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}<br />
              Phone: {order.shippingInfo.phone}
            </p>
          </div>

          <div className="order-items">
            <h3>Ordered Items ({order.items.length})</h3>
            <div className="items-list">
              {order.items.map(item => (
                <div key={item._id} className="order-item">
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="placeholder">🌾</div>
                    )}
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.cartQuantity} {item.unit}</p>
                  </div>
                  <div className="item-price">
                    ₹{(item.price * item.cartQuantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="success-actions">
            <button
              onClick={() => navigate('/my-orders')}
              className="btn btn-primary"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="btn btn-secondary"
            >
              Continue Shopping
            </button>
          </div>

          <div className="success-note">
            <p>📧 Order confirmation has been sent to {order.shippingInfo.email}</p>
            <p>🚚 Expected delivery: 3-5 business days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

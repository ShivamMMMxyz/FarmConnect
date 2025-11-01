import { useState, useEffect } from 'react';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    // Get orders from localStorage (dummy data)
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders.reverse()); // Show newest first
    setLoading(false);
  };

  const getStatusColor = (status) => {
    return '#10b981'; // Green for all orders in dummy mode
  };

  const getPaymentLabel = (method) => {
    if (method === 'card') return '💳 Card Payment';
    if (method === 'upi') return '📱 UPI Payment';
    if (method === 'cod') return '💵 Cash on Delivery';
    return method;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to place your first order!</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => (
              <div key={order.orderId || index} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order.orderId}</h3>
                    <p className="order-date">
                      Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <span
                    className="order-status"
                    style={{ background: getStatusColor('delivered') }}
                  >
                    CONFIRMED
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="placeholder">🌾</div>
                        )}
                      </div>
                      <div className="item-info">
                        <span className="item-name">{item.name || 'Product'}</span>
                        <span className="item-quantity">x {item.cartQuantity}</span>
                      </div>
                      <span className="item-price">₹{(item.price * item.cartQuantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-info">
                    <div className="info-row">
                      <span className="info-label">Payment:</span>
                      <span className="info-value">{getPaymentLabel(order.paymentMethod)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Address:</span>
                      <span className="info-value">
                        {order.shippingInfo.address}, {order.shippingInfo.city}
                      </span>
                    </div>
                  </div>
                  <div className="order-total">
                    <span>Total:</span>
                    <span className="total-amount">₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

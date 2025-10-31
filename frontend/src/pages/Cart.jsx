import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { clearToken, clearUserData } from '../utils/storage';
import './Cart.css';

function Cart({ user, setUser }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateRentalDays = (index, days) => {
    if (days < 1) return;
    
    const newCart = [...cart];
    newCart[index].rentalDays = days;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      if (item.type === 'product') {
        return total + (item.price * item.quantity);
      } else {
        return total + (item.rentalPrice.perDay * item.rentalDays);
      }
    }, 0);
  };

  const placeOrders = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    setLoading(true);

    try {
      const orderPromises = cart.map(item => {
        const orderData = {
          orderType: item.type === 'product' ? 'purchase' : 'rental',
          totalAmount: item.type === 'product' 
            ? item.price * item.quantity 
            : item.rentalPrice.perDay * item.rentalDays
        };

        if (item.type === 'product') {
          orderData.productId = item._id;
          orderData.quantity = item.quantity;
        } else {
          orderData.toolId = item._id;
          orderData.rentalDays = item.rentalDays;
        }

        return orderAPI.createOrder(orderData);
      });

      await Promise.all(orderPromises);
      
      // Clear cart
      setCart([]);
      localStorage.removeItem('cart');
      
      alert('Orders placed successfully! 🎉');
      navigate('/customer/orders');
    } catch (error) {
      console.error('Error placing orders:', error);
      alert('Failed to place orders. Please try again.');
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
          <Link to="/customer/dashboard">Dashboard</Link>
          <Link to="/customer/browse-products">Browse Products</Link>
          <Link to="/customer/browse-tools">Browse Tools</Link>
          <Link to="/customer/cart">Cart ({cart.length})</Link>
          <Link to="/customer/orders">My Orders</Link>
        </div>
        <div className="nav-user">
          <span>👤 {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="cart-content">
        <div className="page-header">
          <h1>Shopping Cart 🛒</h1>
          <p>Review your items before checkout</p>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Start shopping for fresh products and tools!</p>
            <div className="empty-actions">
              <Link to="/customer/browse-products" className="btn btn-primary">
                Browse Products
              </Link>
              <Link to="/customer/browse-tools" className="btn btn-secondary">
                Browse Tools
              </Link>
            </div>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item, index) => (
                <div key={index} className="cart-item">
                  {item.image && (
                    <div className="item-image">
                      <img src={item.image} alt={item.name} />
                    </div>
                  )}
                  
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-type">
                      {item.type === 'product' ? '📦 Product' : '🚜 Tool Rental'}
                    </p>
                    <p className="item-farmer">Farmer: {item.farmer?.name}</p>
                    
                    {item.type === 'product' ? (
                      <div className="quantity-control">
                        <label>Quantity:</label>
                        <button onClick={() => updateQuantity(index, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                        <span className="unit-price">₹{item.price}/{item.unit}</span>
                      </div>
                    ) : (
                      <div className="quantity-control">
                        <label>Rental Days:</label>
                        <button onClick={() => updateRentalDays(index, item.rentalDays - 1)}>-</button>
                        <span>{item.rentalDays}</span>
                        <button onClick={() => updateRentalDays(index, item.rentalDays + 1)}>+</button>
                        <span className="unit-price">₹{item.rentalPrice.perDay}/day</span>
                      </div>
                    )}
                  </div>

                  <div className="item-actions">
                    <div className="item-total">
                      ₹{item.type === 'product' 
                        ? (item.price * item.quantity).toFixed(2)
                        : (item.rentalPrice.perDay * item.rentalDays).toFixed(2)
                      }
                    </div>
                    <button onClick={() => removeFromCart(index)} className="btn-remove">
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items:</span>
                <span>{cart.length}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
              <button 
                onClick={placeOrders} 
                className="btn btn-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Placing Orders...' : 'Place Orders'}
              </button>
              <Link to="/customer/browse-products" className="continue-shopping">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;

import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Your Cart is Empty</h2>
            <p>Add some products to get started!</p>
            <button onClick={() => navigate('/shop')} className="btn btn-primary">
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder">🌾</div>
                  )}
                </div>

                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-farmer">By: {item.farmer?.name || 'Unknown'}</p>
                </div>

                <div className="item-price">
                  <p>₹{item.price} / {item.unit}</p>
                </div>

                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item._id, item.cartQuantity - 1)}
                    disabled={item.cartQuantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.cartQuantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.cartQuantity + 1)}
                    disabled={item.cartQuantity >= item.quantity}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  <p>₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="btn-remove"
                  title="Remove from cart"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Items ({cart.length}):</span>
              <span>₹{getCartTotal().toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Delivery:</span>
              <span>₹50.00</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row summary-total">
              <span>Total:</span>
              <span>₹{(getCartTotal() + 50).toFixed(2)}</span>
            </div>

            <button onClick={handleCheckout} className="btn btn-primary btn-block">
              Proceed to Checkout
            </button>

            <button onClick={clearCart} className="btn btn-secondary btn-block">
              Clear Cart
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="btn btn-outline btn-block"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

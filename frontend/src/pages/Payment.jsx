import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Payment.css';

const Payment = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Get shipping info from session storage
    const savedShipping = sessionStorage.getItem('shippingInfo');
    if (!savedShipping) {
      navigate('/checkout');
      return;
    }
    setShippingInfo(JSON.parse(savedShipping));
  }, [navigate]);

  const subtotal = getCartTotal();
  const deliveryCharge = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryCharge + tax;

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.replace(/\s/g, '').length > 16) return;
    }
    if (name === 'cvv' && value.length > 3) return;
    if ((name === 'expiryMonth' || name === 'expiryYear') && !/^\d*$/.test(value)) return;
    if (name === 'expiryMonth' && value.length > 2) return;
    if (name === 'expiryYear' && value.length > 4) return;

    setCardDetails(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateCardPayment = () => {
    const newErrors = {};
    const cardNum = cardDetails.cardNumber.replace(/\s/g, '');

    if (!cardDetails.cardHolder.trim()) newErrors.cardHolder = 'Cardholder name is required';
    if (!cardNum) newErrors.cardNumber = 'Card number is required';
    else if (cardNum.length !== 16) newErrors.cardNumber = 'Invalid card number';
    if (!cardDetails.expiryMonth) newErrors.expiryMonth = 'Required';
    else if (parseInt(cardDetails.expiryMonth) > 12 || parseInt(cardDetails.expiryMonth) < 1) {
      newErrors.expiryMonth = 'Invalid';
    }
    if (!cardDetails.expiryYear) newErrors.expiryYear = 'Required';
    else if (cardDetails.expiryYear.length !== 4 || parseInt(cardDetails.expiryYear) < new Date().getFullYear()) {
      newErrors.expiryYear = 'Invalid';
    }
    if (!cardDetails.cvv) newErrors.cvv = 'Required';
    else if (cardDetails.cvv.length !== 3) newErrors.cvv = 'Invalid';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateUpiPayment = () => {
    const newErrors = {};
    const upiRegex = /^[\w.-]+@[\w.-]+$/;

    if (!upiId.trim()) newErrors.upiId = 'UPI ID is required';
    else if (!upiRegex.test(upiId)) newErrors.upiId = 'Invalid UPI ID format';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    let isValid = false;
    if (paymentMethod === 'card') {
      isValid = validateCardPayment();
    } else if (paymentMethod === 'upi') {
      isValid = validateUpiPayment();
    } else if (paymentMethod === 'cod') {
      isValid = true;
    }

    if (!isValid) return;

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderData = {
        items: cart,
        shippingInfo,
        paymentMethod,
        totalAmount: total,
        orderId: 'ORD' + Date.now(),
        orderDate: new Date().toISOString()
      };

      // Store order in localStorage (dummy - in real app this would be saved to backend)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart and shipping info
      clearCart();
      sessionStorage.removeItem('shippingInfo');

      setProcessing(false);
      
      // Navigate to order success page
      navigate('/order-success', { state: { order: orderData } });
    }, 2000);
  };

  if (!shippingInfo) {
    return (
      <div className="payment-page">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="container">
        <h1>Payment</h1>

        <div className="payment-layout">
          {/* Payment Methods */}
          <div className="payment-section">
            <div className="section-card">
              <h2>Select Payment Method</h2>

              <div className="payment-methods">
                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-icon">💳</span>
                    <span className="option-label">Credit/Debit Card</span>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-icon">📱</span>
                    <span className="option-label">UPI Payment</span>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-icon">💵</span>
                    <span className="option-label">Cash on Delivery</span>
                  </div>
                </label>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <form onSubmit={handlePayment} className="payment-form">
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={handleCardInputChange}
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name *</label>
                    <input
                      type="text"
                      name="cardHolder"
                      value={cardDetails.cardHolder}
                      onChange={handleCardInputChange}
                      placeholder="Name on card"
                      className={errors.cardHolder ? 'error' : ''}
                    />
                    {errors.cardHolder && <span className="error-text">{errors.cardHolder}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Month *</label>
                      <input
                        type="text"
                        name="expiryMonth"
                        value={cardDetails.expiryMonth}
                        onChange={handleCardInputChange}
                        placeholder="MM"
                        className={errors.expiryMonth ? 'error' : ''}
                      />
                      {errors.expiryMonth && <span className="error-text">{errors.expiryMonth}</span>}
                    </div>

                    <div className="form-group">
                      <label>Expiry Year *</label>
                      <input
                        type="text"
                        name="expiryYear"
                        value={cardDetails.expiryYear}
                        onChange={handleCardInputChange}
                        placeholder="YYYY"
                        className={errors.expiryYear ? 'error' : ''}
                      />
                      {errors.expiryYear && <span className="error-text">{errors.expiryYear}</span>}
                    </div>

                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="password"
                        name="cvv"
                        value={cardDetails.cvv}
                        onChange={handleCardInputChange}
                        placeholder="123"
                        className={errors.cvv ? 'error' : ''}
                      />
                      {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" disabled={processing}>
                    {processing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
                  </button>
                </form>
              )}

              {/* UPI Payment Form */}
              {paymentMethod === 'upi' && (
                <form onSubmit={handlePayment} className="payment-form">
                  <div className="form-group">
                    <label>UPI ID *</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        if (errors.upiId) setErrors(prev => ({ ...prev, upiId: '' }));
                      }}
                      placeholder="yourname@upi"
                      className={errors.upiId ? 'error' : ''}
                    />
                    {errors.upiId && <span className="error-text">{errors.upiId}</span>}
                  </div>

                  <div className="upi-apps">
                    <p>Or pay using:</p>
                    <div className="app-icons">
                      <div className="app-icon">GPay</div>
                      <div className="app-icon">PhonePe</div>
                      <div className="app-icon">Paytm</div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" disabled={processing}>
                    {processing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
                  </button>
                </form>
              )}

              {/* COD Confirmation */}
              {paymentMethod === 'cod' && (
                <div className="payment-form">
                  <div className="cod-info">
                    <p>✓ Cash on Delivery selected</p>
                    <p className="cod-note">
                      Please keep exact change of ₹{total.toFixed(2)} ready for delivery.
                    </p>
                  </div>

                  <button
                    onClick={handlePayment}
                    className="btn btn-primary btn-full"
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="payment-summary">
            <div className="section-card">
              <h2>Order Summary</h2>

              <div className="summary-section">
                <h3>Shipping Address</h3>
                <p className="address-text">
                  {shippingInfo.fullName}<br />
                  {shippingInfo.address}<br />
                  {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}<br />
                  Phone: {shippingInfo.phone}
                </p>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-section">
                <h3>Items ({cart.length})</h3>
                {cart.slice(0, 3).map(item => (
                  <div key={item._id} className="summary-item">
                    <span>{item.name} x {item.cartQuantity}</span>
                    <span>₹{(item.price * item.cartQuantity).toFixed(2)}</span>
                  </div>
                ))}
                {cart.length > 3 && (
                  <p className="more-items">+{cart.length - 3} more items</p>
                )}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-calculations">
                <div className="calc-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="calc-row">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}</span>
                </div>
                <div className="calc-row">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total Amount</span>
                <span className="total-amount">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

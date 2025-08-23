import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkoutAPI, selfAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import momoPaymentAPI from '../../utils/momoPaymentAPI';
import MomoPayment from '../MomoPayment/MomoPayment';
import './Checkout.css';
import OptimizedImage from '../../utils/OptimizedImage';
import { createPlaceholderUrl } from '../../utils/imageUtils';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, getCurrentUser } = useAuth();
  
  // Get data from Cart component
  const { selectedItems = [], total = 0, count = 0 } = location.state || {};
  
  const [userInfo, setUserInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [shippingMethod, setShippingMethod] = useState('fast');
  const [note, setNote] = useState('');
  const [vouchers, setVouchers] = useState({
    shop: '',
    platform: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMomoPayment, setShowMomoPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Load user info and redirect if no items selected
  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Load user info if authenticated
    const loadProfile = async () => {
      if (isAuthenticated()) {
        try {
          const resp = await selfAPI.getMe();
          const currentUser = resp?.data?.user || getCurrentUser();
          if (currentUser) {
            setUserInfo({
              name: currentUser.fullName || currentUser.username || '',
              phone: currentUser.phoneNumber || '',
              address: currentUser.address || ''
            });
          }
        } catch (e) {
          // fallback to local user
          const currentUser = getCurrentUser();
          if (currentUser) {
            setUserInfo({
              name: currentUser.fullName || currentUser.username || '',
              phone: currentUser.phoneNumber || '',
              address: currentUser.address || ''
            });
          }
        }
      }
    };
    loadProfile();
  }, [selectedItems, navigate, isAuthenticated, getCurrentUser]);

  const currencyVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const shippingFee = 1000;
  const totalWithShipping = total + shippingFee;

  const handlePlaceOrder = async () => {
    if (!isAuthenticated()) {
      alert('Please login to place order!');
      navigate('/login');
      return;
    }

    // Kiểm tra token có hợp lệ không
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Login session has expired. Please login again!');
      navigate('/login');
      return;
    }

    if (!userInfo.address || !userInfo.name || !userInfo.phone) {
      setError('Please fill in complete shipping address information!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('=== CHECKOUT DEBUG ===');
      console.log('selectedItems:', selectedItems);
      console.log('userInfo:', userInfo);
      console.log('paymentMethod:', paymentMethod);
      console.log('totalWithShipping:', totalWithShipping);
      
      // Prepare order data
      const orderData = {
        total: totalWithShipping,
        shippingAddress: `${userInfo.name} - ${userInfo.phone} - ${userInfo.address}`,
        paymentMethod: paymentMethod,
        items: selectedItems.map(item => {
          console.log('Processing item:', item);
          return {
            productID: item.id,
            quantity: item.quantity,
            unitPrice: item.price,
            discount: 0
          };
        }),
        note: note
      };
      
      console.log('Final orderData:', orderData);

      // Create order
      const orderResponse = await checkoutAPI.createOrder(orderData);
      
      if (orderResponse.success) {
        // Store order data for MoMo payment
        setCurrentOrder({
          orderID: orderResponse.order._id,
          orderNumber: orderResponse.order.orderNumber || orderResponse.order._id,
          amount: totalWithShipping,
          items: selectedItems
        });

        // Handle different payment methods
        if (paymentMethod === 'momo') {
          // Show MoMo payment component
          setShowMomoPayment(true);
        } else if (paymentMethod === 'cash') {
          // Cash on delivery - navigate to success page
          navigate('/payment/cash-success', { 
            state: { 
              orderData: {
                orderID: orderResponse.order._id,
                orderNumber: orderResponse.order.orderNumber || orderResponse.order._id,
                amount: totalWithShipping,
                items: selectedItems
              }
            }
          });
        }
      } else {
        setError('An error occurred while placing order. Please try again!');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while placing order. Please try again!';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedItems || selectedItems.length === 0) {
    return null;
  }

  // Show MoMo Payment component if payment method is MoMo and order is created
  if (showMomoPayment && currentOrder) {
    return (
      <MomoPayment 
        orderData={currentOrder}
        onBack={() => setShowMomoPayment(false)}
      />
    );
  }

  return (
    <div className="checkout-page">
      
      <div className="checkout-container">
        <div className="checkout-breadcrumb">
          <span className="page-title">Checkout</span>
        </div>
        <div className="checkout-content">
          {/* Delivery Address Section */}
          <div className="checkout-section address-section">
            <div className="section-header">
              <span className="location-icon">📍</span>
              <span className="section-title">Shipping Address</span>
            </div>
            <div className="address-content">
              <div className="user-info" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    placeholder="Full name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo((u) => ({ ...u, name: e.target.value }))}
                    className="note-input"
                    style={{ maxWidth: 260 }}
                  />
                  <input 
                    type="text" 
                    placeholder="Phone number"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo((u) => ({ ...u, phone: e.target.value }))}
                    className="note-input"
                    style={{ maxWidth: 200 }}
                  />
                  <input 
                    type="text" 
                    placeholder="Shipping address"
                    value={userInfo.address}
                    onChange={(e) => setUserInfo((u) => ({ ...u, address: e.target.value }))}
                    className="note-input"
                    style={{ minWidth: 320, flex: 1 }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    className="change-btn"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const payload = { fullName: userInfo.name, phoneNumber: userInfo.phone, address: userInfo.address };
                        const resp = await selfAPI.updateMe(payload);
                        // Refresh local state from server
                        const me = await selfAPI.getMe();
                        const updated = me?.data?.user;
                        if (updated) {
                          setUserInfo({
                            name: updated.fullName || updated.username || '',
                            phone: updated.phoneNumber || '',
                            address: updated.address || ''
                          });
                        }
                        alert('Address has been saved to account');
                      } catch (e) {
                        console.error('Save address failed:', e);
                        const msg = e?.response?.data?.message || e?.message || 'Failed to save address';
                        alert(msg);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="checkout-section products-section">
            <div className="products-header">
              <div className="header-row">
                <span className="col-product">Product</span>
                <span className="col-price">Unit Price</span>
                <span className="col-quantity">Quantity</span>
                                  <span className="col-total">Total</span>
              </div>
            </div>



            {/* Product Items */}
            {selectedItems.map((item, index) => (
              <div key={index} className="product-row">
                <div className="product-info">
                  <OptimizedImage
                    src={item.image}
                    alt={item.name}
                    className="product-image"
                    fallbackUrl={createPlaceholderUrl(80,80,'')}
                    onLoad={() => {}}
                    onError={() => {}}
                  />
                  <div className="product-details">
                    <div className="product-name">{item.name}</div>
                    <div className="product-variant">
                      Type: {item.variant || item.size || 'Pink'}
                    </div>
                  </div>
                </div>
                <div className="product-price">
                  {currencyVND(item.price)}
                </div>
                <div className="product-quantity">{item.quantity}</div>
                <div className="product-total">
                  {currencyVND(item.price * item.quantity)}
                </div>
              </div>
            ))}

            {/* Insurance Option */}
            <div className="insurance-row">
              <label className="insurance-checkbox">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <span className="insurance-text">Mobile Device Insurance</span>
              </label>
              <div className="insurance-price">{currencyVND(415999)}</div>
              <div className="insurance-quantity">1</div>
              <div className="insurance-total">{currencyVND(415999)}</div>
            </div>
            <div className="insurance-description">
                              Protect your mobile device from damage due to accidents, liquid exposure, and theft/loss.
                <span className="learn-more">Learn more</span>
            </div>
          </div>

          {/* Voucher Section */}
          <div className="checkout-section voucher-section">
            <div className="voucher-header">
              <span className="voucher-icon">🎫</span>
                              <span className="voucher-title">Electronic Invoice 💡</span>
                <span className="voucher-request">Request Now</span>
            </div>
            
            <div className="voucher-options">
              <div className="voucher-row">
                <span className="voucher-label">🎫 Shop Voucher</span>
                <button className="voucher-select">Select Voucher</button>
              </div>
              
              <div className="voucher-row">
                <span className="voucher-label">🛒 Platform Voucher</span>
                <button className="voucher-select">Select Voucher</button>
              </div>
              
              <div className="voucher-row">
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="checkout-section payment-section">
                          <div className="section-title payment-title">Payment Method</div>
            
            <div className="payment-options">
              <div className="payment-tabs">
                <button 
                  className={`payment-tab ${paymentMethod === 'cash' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('cash')}
                >
                  💵 Cash
                </button>

                <button 
                  className={`payment-tab ${paymentMethod === 'momo' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('momo')}
                >
                  📱 MoMo Wallet
                </button>
              </div>
              
              {/* Remove the old bank transfer section */}
              {/* <div className="payment-method-detail">
                <div className="bank-transfer-option">Bank Transfer</div>
              </div> */}













              {paymentMethod === 'cash' && (
                <div className="payment-options-detail">
                  <div className="cash-payment-info">
                    <div className="cash-payment-description">
                                      <p>💵 Pay with cash when receiving goods</p>
                <div className="cash-payment-benefits">
                  <span>✓ No card or bank account needed</span>
                  <span>✓ Pay directly with delivery staff</span>
                  <span>✓ Safe and convenient</span>
                </div>
                <div className="cash-payment-note">
                  <strong>Note:</strong> Please prepare enough cash to pay when receiving goods.
                </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'momo' && (
                <div className="payment-options-detail">
                  <div className="momo-payment-info">
                    <div className="momo-payment-description">
                                      <p>📱 Fast and secure payment with MoMo Wallet</p>
                <div className="momo-payment-benefits">
                  <span>✓ Scan QR code to pay</span>
                  <span>✓ No card or bank account needed</span>
                  <span>✓ Instant payment confirmation</span>
                  <span>✓ Absolute information security</span>
                </div>
                <div className="momo-payment-note">
                  <strong>Note:</strong> Please open the MoMo app and scan the QR code to complete payment.
                </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Merged: Order details inside payment section */}
              {/* Order Note */}
              <div className="order-note">
                <label htmlFor="note">Message:</label>
                <input
                  id="note"
                  type="text"
                  placeholder="Note for Seller..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="note-input"
                />
              </div>

              {/* Total Summary */}
              <div className="total-summary">
                <div className="total-row">
                  <span className="total-label">Subtotal</span>
                  <span className="total-value">{currencyVND(total)}</span>
                </div>
                <div className="total-row">
                  <span className="total-label">Shipping fee</span>
                  <span className="total-value">{currencyVND(shippingFee)}</span>
                </div>
                <div className="total-row final-total">
                  <span className="total-label">Total payment</span>
                  <span className="total-value final-amount">{currencyVND(totalWithShipping)}</span>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              {/* Terms Agreement */}
              <div className="terms-agreement">
                Clicking "Place Order" means you agree to follow our{' '}
                <span className="terms-link">Terms and Conditions</span>
              </div>

              {/* Place Order Button */}
              <button 
                className="place-order-btn" 
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
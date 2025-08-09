import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { checkoutAPI, selfAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import './Checkout.css';

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
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingMethod, setShippingMethod] = useState('fast');
  const [note, setNote] = useState('');
  const [vouchers, setVouchers] = useState({
    shop: '',
    platform: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      alert('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login');
      return;
    }

    if (!userInfo.address || !userInfo.name || !userInfo.phone) {
      setError('Vui lòng điền đầy đủ thông tin địa chỉ giao hàng!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare order data
      const orderData = {
        total: totalWithShipping,
        shippingAddress: `${userInfo.name} - ${userInfo.phone} - ${userInfo.address}`,
        paymentMethod: paymentMethod,
        items: selectedItems.map(item => ({
          productID: item.id,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: 0
        })),
        note: note
      };

      // Create order
      const orderResponse = await checkoutAPI.createOrder(orderData);
      
      if (orderResponse.success) {
        // Process payment if needed (only for non-COD methods)
        if (paymentMethod !== 'cod') {
          try {
            const paymentData = {
              orderID: orderResponse.order._id,
              amount: totalWithShipping,
              paymentMethod: paymentMethod
            };
            
            await checkoutAPI.processPayment(paymentData);
          } catch (paymentError) {
            console.error('Payment processing failed:', paymentError);
            // Payment failure shouldn't stop the order creation
            // We can handle this differently based on business logic
          }
        }

        alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
        navigate('/');
      } else {
        setError('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedItems || selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="checkout-page">
      <Header />
      
      <div className="checkout-container">
        {/* Breadcrumb */}
        <div className="checkout-breadcrumb">
          <span className="page-title">Thanh Toán</span>
        </div>

        <div className="checkout-content">
          {/* Delivery Address Section */}
          <div className="checkout-section address-section">
            <div className="section-header">
              <span className="location-icon">📍</span>
              <span className="section-title">Địa Chỉ Nhận Hàng</span>
            </div>
            <div className="address-content">
              <div className="user-info" style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    placeholder="Họ và tên"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo((u) => ({ ...u, name: e.target.value }))}
                    className="note-input"
                    style={{ maxWidth: 260 }}
                  />
                  <input 
                    type="text" 
                    placeholder="Số điện thoại"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo((u) => ({ ...u, phone: e.target.value }))}
                    className="note-input"
                    style={{ maxWidth: 200 }}
                  />
                  <input 
                    type="text" 
                    placeholder="Địa chỉ nhận hàng"
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
                        alert('Đã lưu địa chỉ vào tài khoản');
                      } catch (e) {
                        console.error('Save address failed:', e);
                        const msg = e?.response?.data?.message || e?.message || 'Lưu địa chỉ thất bại';
                        alert(msg);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Lưu địa chỉ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="checkout-section products-section">
            <div className="products-header">
              <div className="header-row">
                <span className="col-product">Sản phẩm</span>
                <span className="col-price">Đơn giá</span>
                <span className="col-quantity">Số lượng</span>
                <span className="col-total">Thành tiền</span>
              </div>
            </div>

            {/* Store Header */}
            <div className="store-header">
              <span className="store-badge">Mall</span>
              <span className="store-name">Viettel Store - AAR</span>
              <span className="chat-btn">💬 Chat ngay</span>
            </div>

            {/* Product Items */}
            {selectedItems.map((item, index) => (
              <div key={index} className="product-row">
                <div className="product-info">
                  <img 
                    src={item.image && item.image.startsWith('http') ? item.image : `http://localhost:8080${item.image || '/images/default-product.jpg'}`} 
                    alt={item.name}
                    className="product-image"
                    onError={(e) => {
                      if (e.target && e.target['src']) {
                        e.target['src'] = '/images/default-product.jpg';
                      }
                    }}
                  />
                  <div className="product-details">
                    <div className="product-name">{item.name}</div>
                    <div className="product-variant">
                      Loại: {item.variant || item.size || 'Pink'}
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
                <span className="insurance-text">Bảo hiểm Thiết bị di động</span>
              </label>
              <div className="insurance-price">{currencyVND(415999)}</div>
              <div className="insurance-quantity">1</div>
              <div className="insurance-total">{currencyVND(415999)}</div>
            </div>
            <div className="insurance-description">
              Bảo vệ thiết bị di động của bạn trước những thiệt hại do sự cố, tiếp xúc với chất lỏng và mất cắp/mất trộm. 
              <span className="learn-more">Tìm hiểu thêm</span>
            </div>
          </div>

          {/* Voucher Section */}
          <div className="checkout-section voucher-section">
            <div className="voucher-header">
              <span className="voucher-icon">🎫</span>
              <span className="voucher-title">Hóa đơn điện tử 💡</span>
              <span className="voucher-request">Yêu Cầu Ngay</span>
            </div>
            
            <div className="voucher-options">
              <div className="voucher-row">
                <span className="voucher-label">🎫 Voucher của Shop</span>
                <button className="voucher-select">Chọn Voucher</button>
              </div>
              
              <div className="voucher-row">
                <span className="voucher-label">🛒 Voucher nền tảng</span>
                <button className="voucher-select">Chọn Voucher</button>
              </div>
              
              <div className="voucher-row">
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="checkout-section payment-section">
            <div className="section-title payment-title">Phương thức thanh toán</div>
            
            <div className="payment-options">
              <div className="payment-tabs">
                <button 
                  className={`payment-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  Thẻ Tín dụng/Ghi nợ
                </button>
                <button 
                  className={`payment-tab ${paymentMethod === 'googlepay' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('googlepay')}
                >
                  Google Pay
                </button>
                <button 
                  className={`payment-tab ${paymentMethod === 'napas' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('napas')}
                >
                  Thẻ nội địa NAPAS
                </button>
                <button 
                  className={`payment-tab ${paymentMethod === 'shopeepay' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('shopeepay')}
                >
                  Ví GoMallPay
                </button>
                <button 
                  className={`payment-tab ${paymentMethod === 'installment' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('installment')}
                >
                  Trả góp bằng Thẻ Tín dụng
                </button>
                <button 
                  className={`payment-tab ${paymentMethod === 'bank-transfer' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('bank-transfer')}
                >
                  Chuyển khoản ngân hàng
                </button>
              </div>
              
              {/* Remove the old bank transfer section */}
              {/* <div className="payment-method-detail">
                <div className="bank-transfer-option">Chuyển khoản ngân hàng</div>
              </div> */}

              {/* Payment Options */}
              {paymentMethod === 'card' && (
                <div className="payment-options-detail">
                  <div className="card-options">
                    <div className="card-option">
                      <input type="radio" name="card-type" id="visa" defaultChecked />
                      <label htmlFor="visa">
                        <img src="/images/visa-logo.png" alt="Visa" className="card-logo" />
                        <span>Visa</span>
                      </label>
                    </div>
                    <div className="card-option">
                      <input type="radio" name="card-type" id="mastercard" />
                      <label htmlFor="mastercard">
                        <img src="/images/mastercard-logo.png" alt="Mastercard" className="card-logo" />
                        <span>Mastercard</span>
                      </label>
                    </div>
                    <div className="card-option">
                      <input type="radio" name="card-type" id="jcb" />
                      <label htmlFor="jcb">
                        <img src="/images/jcb-logo.png" alt="JCB" className="card-logo" />
                        <span>JCB</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'googlepay' && (
                <div className="payment-options-detail">
                  <div className="googlepay-info">
                    <div className="googlepay-description">
                      <p>Thanh toán nhanh chóng và bảo mật với Google Pay</p>
                      <div className="googlepay-benefits">
                        <span>✓ Không cần nhập thông tin thẻ</span>
                        <span>✓ Bảo mật tối đa</span>
                        <span>✓ Thanh toán trong 1 chạm</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'napas' && (
                <div className="payment-options-detail">
                  <div className="napas-options">
                    <div className="napas-option">
                      <input type="radio" name="napas-bank" id="vietcombank" defaultChecked />
                      <label htmlFor="vietcombank">
                        <img src="/images/vietcombank-logo.png" alt="Vietcombank" className="bank-logo" />
                        <span>Vietcombank</span>
                      </label>
                    </div>
                    <div className="napas-option">
                      <input type="radio" name="napas-bank" id="techcombank" />
                      <label htmlFor="techcombank">
                        <img src="/images/techcombank-logo.png" alt="Techcombank" className="bank-logo" />
                        <span>Techcombank</span>
                      </label>
                    </div>
                    <div className="napas-option">
                      <input type="radio" name="napas-bank" id="bidv" />
                      <label htmlFor="bidv">
                        <img src="/images/bidv-logo.png" alt="BIDV" className="bank-logo" />
                        <span>BIDV</span>
                      </label>
                    </div>
                    <div className="napas-option">
                      <input type="radio" name="napas-bank" id="agribank" />
                      <label htmlFor="agribank">
                        <img src="/images/agribank-logo.png" alt="Agribank" className="bank-logo" />
                        <span>Agribank</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'shopeepay' && (
                <div className="payment-options-detail">
                  <div className="shopeepay-section">
                    <div className="shopeepay-promo">
                      <img src="/images/shopeepay-promo.png" alt="Ví GoMallPay" className="promo-image" />
                    </div>
                    <div className="shopeepay-balance">
                      <span className="balance-icon">💰</span>
                      <span className="balance-text">Số dư Ví GoMallPay</span>
                      <span className="balance-amount">₫0</span>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'installment' && (
                <div className="payment-options-detail">
                  <div className="installment-options">
                    <div className="installment-option">
                      <input type="radio" name="installment-plan" id="3months" defaultChecked />
                      <label htmlFor="3months">
                        <span className="installment-term">3 tháng</span>
                        <span className="installment-rate">0% lãi suất</span>
                      </label>
                    </div>
                    <div className="installment-option">
                      <input type="radio" name="installment-plan" id="6months" />
                      <label htmlFor="6months">
                        <span className="installment-term">6 tháng</span>
                        <span className="installment-rate">2.5% lãi suất/tháng</span>
                      </label>
                    </div>
                    <div className="installment-option">
                      <input type="radio" name="installment-plan" id="12months" />
                      <label htmlFor="12months">
                        <span className="installment-term">12 tháng</span>
                        <span className="installment-rate">3.0% lãi suất/tháng</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'bank-transfer' && (
                <div className="payment-options-detail">
                  <div className="bank-transfer-options">
                    <div className="bank-transfer-info">
                      <p>Chọn ngân hàng để chuyển khoản:</p>
                    </div>
                    <div className="bank-list">
                      <div className="bank-option">
                        <input type="radio" name="bank-transfer" id="vietcombank-transfer" defaultChecked />
                        <label htmlFor="vietcombank-transfer">
                          <img src="/images/vietcombank-logo.png" alt="Vietcombank" className="bank-logo" />
                          <div className="bank-details">
                            <span className="bank-name">Vietcombank</span>
                            <span className="bank-account">1234567890 - GoMall</span>
                          </div>
                        </label>
                      </div>
                      <div className="bank-option">
                        <input type="radio" name="bank-transfer" id="techcombank-transfer" />
                        <label htmlFor="techcombank-transfer">
                          <img src="/images/techcombank-logo.png" alt="Techcombank" className="bank-logo" />
                          <div className="bank-details">
                            <span className="bank-name">Techcombank</span>
                            <span className="bank-account">0987654321 - GoMall</span>
                          </div>
                        </label>
                      </div>
                      <div className="bank-option">
                        <input type="radio" name="bank-transfer" id="bidv-transfer" />
                        <label htmlFor="bidv-transfer">
                          <img src="/images/bidv-logo.png" alt="BIDV" className="bank-logo" />
                          <div className="bank-details">
                            <span className="bank-name">BIDV</span>
                            <span className="bank-account">1122334455 - GoMall</span>
                          </div>
                        </label>
                      </div>
                      <div className="bank-option">
                        <input type="radio" name="bank-transfer" id="agribank-transfer" />
                        <label htmlFor="agribank-transfer">
                          <img src="/images/agribank-logo.png" alt="Agribank" className="bank-logo" />
                          <div className="bank-details">
                            <span className="bank-name">Agribank</span>
                            <span className="bank-account">5544332211 - GoMall</span>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="transfer-instructions">
                      <h4>Hướng dẫn chuyển khoản:</h4>
                      <ol>
                        <li>Chọn ngân hàng từ danh sách trên</li>
                        <li>Chuyển khoản đến tài khoản đã chọn</li>
                        <li>Nội dung chuyển khoản: Mã đơn hàng</li>
                        <li>Sau khi chuyển khoản, vui lòng chờ xác nhận</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Merged: Order details inside payment section */}
              {/* Order Note */}
              <div className="order-note">
                <label htmlFor="note">Lời nhắn:</label>
                <input
                  id="note"
                  type="text"
                  placeholder="Lưu ý cho Người bán..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="note-input"
                />
              </div>

              {/* Total Summary */}
              <div className="total-summary">
                <div className="total-row">
                  <span className="total-label">Tổng tiền hàng</span>
                  <span className="total-value">{currencyVND(total)}</span>
                </div>
                <div className="total-row">
                  <span className="total-label">Tổng tiền phí vận chuyển</span>
                  <span className="total-value">{currencyVND(shippingFee)}</span>
                </div>
                <div className="total-row final-total">
                  <span className="total-label">Tổng thanh toán</span>
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
                Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{' '}
                <span className="terms-link">Điều khoản của chúng tôi</span>
              </div>

              {/* Place Order Button */}
              <button 
                className="place-order-btn" 
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
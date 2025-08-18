import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './PaymentResult.css';

const CashPaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy thông tin đơn hàng từ location state hoặc fallback
  const orderData = location.state?.orderData || {
    orderID: 'N/A',
    orderNumber: 'N/A',
    amount: 0,
    items: []
  };

  const currencyVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleViewOrder = () => {
    // Navigate đến trang xem đơn hàng
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleDownloadInvoice = () => {
    // Navigate đến trang tải hóa đơn
    navigate('/invoice', { 
      state: { 
        orderData: {
          orderID: orderData.orderID,
          orderNumber: orderData.orderNumber,
          amount: orderData.amount,
          items: orderData.items,
          createdAt: new Date(),
          shippingAddress: 'Địa chỉ giao hàng của bạn',
          paymentMethod: 'Tiền mặt'
        }
      }
    });
  };

  return (
    <div className="payment-result-page">
      <Header />
      
      <div className="result-container">
        <div className="result-card success">
          {/* Success Icon */}
          <div className="result-icon">
            <div className="success-icon">✅</div>
          </div>

          {/* Success Title */}
          <h1 className="result-title">Đặt Hàng Thành Công!</h1>
          
          {/* Success Message */}
          <p className="result-message">
            Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>

          {/* Order Details */}
          <div className="order-details">
            <h3>📋 Thông Tin Đơn Hàng</h3>
            <div className="detail-row">
              <span className="detail-label">Mã đơn hàng:</span>
              <span className="detail-value">{orderData.orderNumber || orderData.orderID}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Tổng tiền:</span>
              <span className="detail-value amount">{currencyVND(orderData.amount)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phương thức thanh toán:</span>
              <span className="detail-value">💵 Tiền mặt (Thanh toán khi nhận hàng)</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Trạng thái:</span>
              <span className="detail-value status-pending">⏳ Đang xử lý</span>
            </div>
          </div>

          {/* Products Summary */}
          {orderData.items && orderData.items.length > 0 && (
            <div className="products-summary">
              <h3>🛍️ Sản Phẩm Đã Đặt</h3>
              <div className="products-list">
                {orderData.items.map((item, index) => (
                  <div key={index} className="product-item">
                    <img 
                      src={item.image && item.image.startsWith('http') ? item.image : `http://localhost:8080${item.image || '/images/placeholder-product.svg'}`} 
                      alt={item.name}
                      className="product-image"
                      onError={(e) => {
                        if (e.target && e.target['src']) {
                          e.target['src'] = '/images/placeholder-product.svg';
                        }
                      }}
                    />
                    <div className="product-info">
                      <div className="product-name">{item.name}</div>
                      <div className="product-details">
                        <span className="product-variant">Loại: {item.variant || item.size || 'Standard'}</span>
                        <span className="product-quantity">Số lượng: {item.quantity}</span>
                        <span className="product-unit-price">Đơn giá: {currencyVND(item.price)}</span>
                        {item.brand && <span className="product-brand">Thương hiệu: {item.brand}</span>}
                        {item.category && <span className="product-category">Danh mục: {item.category}</span>}
                      </div>
                      <div className="product-price">Thành tiền: {currencyVND(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="next-steps">
            <h3>📋 Các Bước Tiếp Theo</h3>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Xác nhận đơn hàng:</strong> Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 30 phút
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Chuẩn bị hàng:</strong> Hàng sẽ được đóng gói và giao trong 1-3 ngày làm việc
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Giao hàng:</strong> Nhân viên giao hàng sẽ liên hệ trước khi giao 30 phút
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <strong>Thanh toán:</strong> Thanh toán tiền mặt khi nhận hàng và kiểm tra
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="important-notes">
            <h3>⚠️ Lưu Ý Quan Trọng</h3>
            <ul>
              <li>Vui lòng chuẩn bị đủ tiền mặt để thanh toán khi nhận hàng</li>
              <li>Kiểm tra kỹ sản phẩm trước khi thanh toán</li>
              <li>Giữ lại hóa đơn để bảo hành và đổi trả</li>
              <li>Liên hệ hotline nếu có vấn đề: <strong>1900-xxxx</strong></li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={handleViewOrder}>
              👁️ Xem Đơn Hàng
            </button>
            <button className="btn btn-secondary" onClick={handleDownloadInvoice}>
              📄 Tải Hóa Đơn
            </button>
            <button className="btn btn-outline" onClick={handleContinueShopping}>
              🛒 Tiếp Tục Mua Sắm
            </button>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <p>📞 Cần hỗ trợ? Liên hệ chúng tôi:</p>
            <div className="contact-methods">
              <span>📧 Email: support@gomall.com</span>
              <span>📱 Hotline: 1900-xxxx</span>
              <span>💬 Chat: Mở chat ở góc phải màn hình</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashPaymentSuccess;

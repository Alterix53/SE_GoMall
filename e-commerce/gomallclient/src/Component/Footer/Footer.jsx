
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Section 1: DỊCH VỤ KHÁCH HÀNG */}
            <div className="footer-section">
              <h3 className="footer-title">DỊCH VỤ KHÁCH HÀNG</h3>
              <ul className="footer-links">
                <li><Link to="/help">Trung Tâm Trợ Giúp GoMall</Link></li>
                <li><Link to="/blog">GoMall Blog</Link></li>
                <li><Link to="/mall">GoMall Mall</Link></li>
                <li><Link to="/guide">Hướng Dẫn Mua Hàng/Đặt Hàng</Link></li>
                <li><Link to="/sell-guide">Hướng Dẫn Bán Hàng</Link></li>
                <li><Link to="/payment">Ví GoMallPay</Link></li>
                <li><Link to="/xu">GoMall Xu</Link></li>
                <li><Link to="/shipping">Đơn Hàng</Link></li>
                <li><Link to="/refund">Trả Hàng/Hoàn Tiền</Link></li>
                <li><Link to="/support">Liên Hệ GoMall</Link></li>
                <li><Link to="/policy">Chính Sách Bảo Hành</Link></li>
              </ul>
            </div>

            {/* Section 2: GOMALL VIỆT NAM */}
            <div className="footer-section">
              <h3 className="footer-title">GOMALL VIỆT NAM</h3>
              <ul className="footer-links">
                <li><Link to="/about">Về GoMall</Link></li>
                <li><Link to="/careers">Tuyển Dụng</Link></li>
                <li><Link to="/terms">Điều Khoản GoMall</Link></li>
                <li><Link to="/privacy">Chính Sách Bảo Mật</Link></li>
                <li><Link to="/mall-info">GoMall Mall</Link></li>
                <li><Link to="/seller">Kênh Người Bán</Link></li>
                <li><Link to="/flash-sale">Flash Sale</Link></li>
                <li><Link to="/affiliate">Tiếp Thị Liên Kết</Link></li>
                <li><Link to="/media">Liên Hệ Truyền Thông</Link></li>
              </ul>
            </div>

            {/* Section 3: THANH TOÁN */}
            <div className="footer-section">
              <h3 className="footer-title">THANH TOÁN</h3>
              <div className="payment-grid">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="VISA" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/JCB_logo.svg/2560px-JCB_logo.svg.png" alt="JCB" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" />
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ShopeePay-V-Horizontal.png" alt="S Pay" />
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ShopeePay-V-Horizontal.png" alt="SPayLater" />
              </div>
              
              <h4 className="footer-subtitle">ĐƠN VỊ VẬN CHUYỂN</h4>
              <div className="shipping-grid">
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2021/12/Logo-SPX-Express.png" alt="SPX Express" />
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Slogan-VN.png" alt="Giao Hàng Nhanh" />
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-Viettel-Post.png" alt="Viettel Post" />
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-J&T-Express.png" alt="J&T Express" />
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GrabExpress.png" alt="GrabExpress" />
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-Ninja-Van.png" alt="Ninja Van" />
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-Be.png" alt="Be" />
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-Ahamove.png" alt="Ahamove" />
              </div>
            </div>

            {/* Section 4: THEO DÕI GOMALL */}
            <div className="footer-section">
              <h3 className="footer-title">THEO DÕI GOMALL</h3>
              <div className="social-links">
                <a href="https://facebook.com" className="social-link">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" alt="Facebook" />
                  <span>Facebook</span>
                </a>
                <a href="https://instagram.com" className="social-link">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1325px-Instagram_logo_2016.svg.png" alt="Instagram" />
                  <span>Instagram</span>
                </a>
                <a href="https://linkedin.com" className="social-link">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/768px-LinkedIn_logo_initials.png" alt="LinkedIn" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            {/* Section 5: TẢI ỨNG DỤNG GOMALL */}
            <div className="footer-section">
              <h3 className="footer-title">TẢI ỨNG DỤNG GOMALL</h3>
              <div className="app-download">
                <div className="qr-code">
                  <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgZmlsbD0iYmxhY2siLz4KPC9zdmc+" alt="QR Code" />
                </div>
                <div className="app-stores">
                  <a href="#" className="app-store-link">
                    <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" />
                  </a>
                  <a href="#" className="app-store-link">
                    <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Google Play" />
                  </a>
                  <a href="#" className="app-store-link">
                    <img src="https://developer.huawei.com/consumer/en/service/josp/agc/images/appgallery_badge_en.png" alt="AppGallery" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              © 2025 GoMall. Tất cả các quyền được bảo lưu.
            </div>
            <div className="footer-countries">
              <span>Quốc gia & Khu vực: Singapore | Indonesia | Thái Lan | Malaysia | Việt Nam | Philippines | Brazil | México | Colombia | Chile | Đài Loan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

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
                <li><Link to="/shipping">Đơn Hàng</Link></li>
              </ul>
            </div>

            {/* Section 2: GOMALL VIỆT NAM */}
            <div className="footer-section">
              <h3 className="footer-title">GOMALL VIỆT NAM</h3>
              <ul className="footer-links">
                <li><Link to="/about">Về GoMall</Link></li>
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
                <img src="https://down-vn.img.susercontent.com/file/38fd98e55806c3b2e4535c4e4a6c4c08" alt="Mastercard" />
                <img src="https://down-vn.img.susercontent.com/file/5e3f0bee86058637ff23cfdf2e14ca09" alt="JCB" />
                <img src="https://down-vn.img.susercontent.com/file/0217f1d345587aa0a300e69e2195c492" alt="American Express" />
                <img src="https://down-vn.img.susercontent.com/file/9263fa8c83628f5deff55e2a90758b06" alt="S Pay" />
                <img src="https://down-vn.img.susercontent.com/file/a0a9062ebe19b45c1ae0506f16af5c16" alt="VNPay" />
              </div>
              
              <h4 className="footer-subtitle">ĐƠN VỊ VẬN CHUYỂN</h4>
              <div className="shipping-grid">
                <img src="https://down-vn.img.susercontent.com/file/vn-11134258-7ras8-m20rc1wk8926cf" alt="SPX Express" />
                <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/05/Logo-GHN-Slogan-VN.png" alt="Giao Hàng Nhanh" />
                <img src="https://down-vn.img.susercontent.com/file/59270fb2f3fbb7cbc92fca3877edde3f" alt="Viettel Post" />
                <img src="https://down-vn.img.susercontent.com/file/957f4eec32b963115f952835c779cd2c" alt="J&T Express" />
                <img src="https://down-vn.img.susercontent.com/file/0d349e22ca8d4337d11c9b134cf9fe63" alt="GrabExpress" />
                <img src="https://down-vn.img.susercontent.com/file/3900aefbf52b1c180ba66e5ec91190e5" alt="Ninja Van" />
                <img src="https://down-vn.img.susercontent.com/file/6e3be504f08f88a15a28a9a447d94d3d" alt="Be" />
                <img src="https://down-vn.img.susercontent.com/file/vn-50009109-ec3ae587db6309b791b78eb8af6793fd" alt="Ahamove" />
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
              <span>Quốc gia & Khu vực: Việt Nam | Singapore | Thái Lan</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
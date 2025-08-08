
import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Section 1: Logo / Brand */}
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-icon">G</div>
                <span className="logo-text">GoMall</span>
              </div>
              <p className="footer-description">
                Your shopping experience destination.
              </p>
              <p className="contact-text">Liên hệ với chúng tôi tại:</p>
              <div className="contact-grid">
                <a href="https://facebook.com" className="contact-item">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" alt="Facebook" />
                  <span>Facebook</span>
                </a>
                <a href="https://instagram.com" className="contact-item">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/1325px-Instagram_logo_2016.svg.png" alt="Instagram" />
                  <span>Instagram</span>
                </a>
                <a href="https://twitter.com" className="contact-item">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/2491px-Twitter-logo.svg.png" alt="Twitter" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>

            {/* Section 2: Links */}
            <div className="footer-section">
              <h3 className="footer-title">Links</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Section 3: Payment Methods */}
            <div className="footer-section">
              <h3 className="footer-title">THANH TOÁN</h3>
              <div className="payment-grid">
                <div className="payment-item">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="VISA" />
                  <span>VISA</span>
                </div>
                <div className="payment-item">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" />
                  <span>Mastercard</span>
                </div>
                <div className="payment-item">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/JCB_logo.svg/2560px-JCB_logo.svg.png" alt="JCB" />
                  <span>JCB</span>
                </div>
                <div className="payment-item">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png" alt="American Express" />
                  <span>American Express</span>
                </div>
                <div className="payment-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="COD" />
                  <span>COD</span>
                </div>
                <div className="payment-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="Trả Góp" />
                  <span>Trả Góp</span>
                </div>
                <div className="payment-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="S Pay" />
                  <span>S Pay</span>
                </div>
                <div className="payment-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="SPayLater" />
                  <span>SPayLater</span>
                </div>
              </div>
            </div>

            {/* Section 4: Shipping Units */}
            <div className="footer-section">
              <h3 className="footer-title">ĐƠN VỊ VẬN CHUYỂN</h3>
              <div className="shipping-grid">
                <div className="shipping-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="SPX Express" />
                  <span>SPX Express</span>
                </div>
                <div className="shipping-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="Giao Hàng Nhanh" />
                  <span>Giao Hàng Nhanh</span>
                </div>
                <div className="shipping-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="Viettel Post" />
                  <span>Viettel Post</span>
                </div>
                <div className="shipping-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="Vietnam Post" />
                  <span>Vietnam Post</span>
                </div>
                <div className="shipping-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="J&T Express" />
                  <span>J&T Express</span>
                </div>
                <div className="shipping-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="GrabExpress" />
                  <span>GrabExpress</span>
                </div>
                <div className="shipping-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="Ninja Van" />
                  <span>Ninja Van</span>
                </div>
                <div className="shipping-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="Be" />
                  <span>Be</span>
                </div>
                <div className="shipping-item">
                  <img src="https://cdn-icons-png.flaticon.com/512/2454/2454270.png" alt="Ahamove" />
                  <span>Ahamove</span>
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
              © 2025 Gomall. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
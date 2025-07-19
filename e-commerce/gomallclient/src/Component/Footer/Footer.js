import React from 'react';
import './Footer.css'; // Import the CSS file for styling

export default function Footer() {
  return (
    <footer className="footer bg-light text-dark py-5 mt-5 sticky-bot">
      <div className="container">
        <div className="row">
          {/* Cột 1: Logo / Tên */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Gomall</h5>
            <p className="text-muted">Enhance your shopping experience.</p>
          </div>

          {/* Cột 2: Các liên kết */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold">Liên kết</h6>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-decoration-none text-dark">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="/faq" className="text-decoration-none text-dark">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="/contact" className="text-decoration-none text-dark">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Mạng xã hội */}
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold">Theo dõi chúng tôi</h6>
            <a href="#" className="text-dark me-3">
              <i className="bi bi-facebook"></i> Facebook
            </a>
            <br />
            <a href="#" className="text-dark me-3">
              <i className="bi bi-instagram"></i> Instagram
            </a>
            <br />
            <a href="#" className="text-dark">
              <i className="bi bi-twitter"></i> Twitter
            </a>
          </div>
        </div>

        <hr />
        <div className="text-center text-muted small mt-4">
          © 2025 Gomall. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

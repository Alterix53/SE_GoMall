import React from 'react';
import './ColorDemo.css';

const ColorDemo = () => {
  return (
    <div className="color-demo">
      <div className="container">
        <h2 className="text-center mb-5">🎨 GoMall Color Palette Demo</h2>
        
        {/* Primary Colors */}
        <section className="mb-5">
          <h3>Primary Colors</h3>
          <div className="row">
            <div className="col-md-2 mb-3">
              <div className="color-swatch primary-color">
                <div className="color-box bg-primary"></div>
                <p className="color-name">Primary</p>
                <p className="color-code">#6366f1</p>
              </div>
            </div>
            <div className="col-md-2 mb-3">
              <div className="color-swatch secondary-color">
                <div className="color-box bg-secondary"></div>
                <p className="color-name">Secondary</p>
                <p className="color-code">#64748b</p>
              </div>
            </div>
            <div className="col-md-2 mb-3">
              <div className="color-swatch success-color">
                <div className="color-box bg-success"></div>
                <p className="color-name">Success</p>
                <p className="color-code">#10b981</p>
              </div>
            </div>
            <div className="col-md-2 mb-3">
              <div className="color-swatch info-color">
                <div className="color-box bg-info"></div>
                <p className="color-name">Info</p>
                <p className="color-code">#3b82f6</p>
              </div>
            </div>
            <div className="col-md-2 mb-3">
              <div className="color-swatch warning-color">
                <div className="color-box bg-warning"></div>
                <p className="color-name">Warning</p>
                <p className="color-code">#f59e0b</p>
              </div>
            </div>
            <div className="col-md-2 mb-3">
              <div className="color-swatch danger-color">
                <div className="color-box bg-danger"></div>
                <p className="color-name">Danger</p>
                <p className="color-code">#ef4444</p>
              </div>
            </div>
          </div>
        </section>

        {/* Accent Colors */}
        <section className="mb-5">
          <h3>Accent Colors (E-commerce)</h3>
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="color-swatch accent-orange">
                <div className="color-box" style={{backgroundColor: 'var(--accent-orange)'}}></div>
                <p className="color-name">Orange</p>
                <p className="color-code">#f97316</p>
                <small>Flash sales, promotions</small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="color-swatch accent-purple">
                <div className="color-box" style={{backgroundColor: 'var(--accent-purple)'}}></div>
                <p className="color-name">Purple</p>
                <p className="color-code">#8b5cf6</p>
                <small>Premium features</small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="color-swatch accent-teal">
                <div className="color-box" style={{backgroundColor: 'var(--accent-teal)'}}></div>
                <p className="color-name">Teal</p>
                <p className="color-code">#14b8a6</p>
                <small>Trust, security</small>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="color-swatch accent-pink">
                <div className="color-box" style={{backgroundColor: 'var(--accent-pink)'}}></div>
                <p className="color-name">Pink</p>
                <p className="color-code">#ec4899</p>
                <small>Fashion, beauty</small>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Demo */}
        <section className="mb-5">
          <h3>Button Styles</h3>
          <div className="row">
            <div className="col-md-6">
              <h5>Bootstrap Buttons</h5>
              <div className="button-group">
                <button className="btn btn-primary me-2">Primary</button>
                <button className="btn btn-secondary me-2">Secondary</button>
                <button className="btn btn-success me-2">Success</button>
                <button className="btn btn-warning me-2">Warning</button>
                <button className="btn btn-danger me-2">Danger</button>
                <button className="btn btn-info me-2">Info</button>
              </div>
            </div>
            <div className="col-md-6">
              <h5>Custom Buttons</h5>
              <div className="button-group">
                <button className="btn btn-flash-sale me-2">Flash Sale</button>
                <button className="btn btn-premium me-2">Premium</button>
              </div>
            </div>
          </div>
        </section>

        {/* Badges Demo */}
        <section className="mb-5">
          <h3>Badge Styles</h3>
          <div className="row">
            <div className="col-md-6">
              <h5>Bootstrap Badges</h5>
              <div className="badge-group">
                <span className="badge bg-primary me-2">Primary</span>
                <span className="badge bg-secondary me-2">Secondary</span>
                <span className="badge bg-success me-2">Success</span>
                <span className="badge bg-warning me-2">Warning</span>
                <span className="badge bg-danger me-2">Danger</span>
                <span className="badge bg-info me-2">Info</span>
              </div>
            </div>
            <div className="col-md-6">
              <h5>Custom Badges</h5>
              <div className="badge-group">
                <span className="badge flash-sale-badge me-2">FLASH SALE</span>
                <span className="badge premium-badge me-2">PREMIUM</span>
                <span className="badge trust-badge me-2">TRUSTED</span>
                <span className="badge fashion-badge me-2">FASHION</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cards Demo */}
        <section className="mb-5">
          <h3>Card Styles</h3>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card card-ecommerce">
                <img src="/images/default-product.jpg" className="card-img-top product-image" alt="Product" />
                <div className="card-body">
                  <h5 className="card-title">Product Name</h5>
                  <span className="badge flash-sale-badge mb-2">FLASH SALE</span>
                  <p className="product-price">$99.99</p>
                  <p className="product-discount">-20%</p>
                  <button className="btn btn-primary">Add to Cart</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card card-ecommerce">
                <img src="/images/default-product.jpg" className="card-img-top product-image" alt="Product" />
                <div className="card-body">
                  <h5 className="card-title">Premium Product</h5>
                  <span className="badge premium-badge mb-2">PREMIUM</span>
                  <p className="product-price">$199.99</p>
                  <button className="btn btn-premium">Buy Now</button>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card card-ecommerce">
                <img src="/images/default-product.jpg" className="card-img-top product-image" alt="Product" />
                <div className="card-body">
                  <h5 className="card-title">Trusted Product</h5>
                  <span className="badge trust-badge mb-2">TRUSTED</span>
                  <p className="product-price">$149.99</p>
                  <button className="btn btn-success">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cart Icon Demo */}
        <section className="mb-5">
          <h3>Cart Icon with Badge</h3>
          <div className="cart-icon">
            <i className="fas fa-shopping-cart fa-2x"></i>
            <span className="cart-badge">3</span>
          </div>
        </section>

        {/* Form Demo */}
        <section className="mb-5">
          <h3>Form Styles</h3>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control form-control-ecommerce" placeholder="Enter your email" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control form-control-ecommerce" placeholder="Enter your password" />
              </div>
            </div>
          </div>
        </section>

        {/* Alert Demo */}
        <section className="mb-5">
          <h3>Alert Styles</h3>
          <div className="alert alert-success alert-ecommerce">
            <strong>Success!</strong> Product added to cart successfully!
          </div>
          <div className="alert alert-warning alert-ecommerce">
            <strong>Warning!</strong> This item is running low on stock.
          </div>
          <div className="alert alert-danger alert-ecommerce">
            <strong>Error!</strong> Something went wrong. Please try again.
          </div>
        </section>
      </div>
    </div>
  );
};

export default ColorDemo; 
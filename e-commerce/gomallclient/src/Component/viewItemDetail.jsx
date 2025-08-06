"use client"

import { useState } from "react"
import "./viewItemDetail.css"

export default function ViewItemDetail() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState("M")
  const [selectedColor, setSelectedColor] = useState("blue")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  const productImages = [
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ]

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const colors = [
    { name: "blue", value: "#3B82F6" },
    { name: "red", value: "#EF4444" },
    { name: "green", value: "#10B981" },
    { name: "black", value: "#1F2937" },
  ]

  const relatedProducts = [
    { id: 1, name: "Similar Product 1", price: 89.99, image: "/placeholder.svg?height=200&width=200" },
    { id: 2, name: "Similar Product 2", price: 129.99, image: "/placeholder.svg?height=200&width=200" },
    { id: 3, name: "Similar Product 3", price: 99.99, image: "/placeholder.svg?height=200&width=200" },
    { id: 4, name: "Similar Product 4", price: 149.99, image: "/placeholder.svg?height=200&width=200" },
  ]

  const reviews = [
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      comment: "Excellent product! Great quality and fast shipping.",
      date: "2024-01-15",
    },
    { id: 2, name: "Jane Smith", rating: 4, comment: "Good value for money. Fits perfectly.", date: "2024-01-10" },
    { id: 3, name: "Mike Johnson", rating: 5, comment: "Love this product! Highly recommended.", date: "2024-01-05" },
  ]

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
    ));
  };

  return (
    <>
    <div className="product-detail-container">
      {/*<header className="header">
        <div className="header-content">
          <div className="logo"><h1>ShopLogo</h1></div>
          <nav className="navigation">
            <a href="/" className="nav-link">Home</a>
            <a href="/categories" className="nav-link">Categories</a>
            <a href="/cart" className="nav-link">Cart</a>
            <a href="/account" className="nav-link">Account</a>
          </nav>
        </div>
      </header>*/}

      <div className="main-content">
        <div className="product-container">
          <div className="image-gallery">
            <div className="main-image">
              <img src={productImages[selectedImage]} alt="Product" />
            </div>
            <div className="thumbnail-gallery">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={image} alt={`Product ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="product-info">
            <h1 className="product-title">Premium Cotton T-Shirt</h1>

            <div className="rating-section">
              <div className="stars">{renderStars(4)}</div>
              <span className="review-count">(127 reviews)</span>
            </div>

            <div className="price-section">
              <span className="current-price">$79.99</span>
              <span className="original-price">$99.99</span>
              <span className="discount">20% OFF</span>
            </div>

            <div className="stock-status in-stock">✓ In Stock</div>

            <div className="variants-section">
              <div className="size-selector">
                <label>Size:</label>
                <div className="size-options">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="color-selector">
                <label>Color:</label>
                <div className="color-options">
                  {colors.map((color) => (
                    <div
                      key={color.name}
                      className={`color-swatch ${selectedColor === color.name ? "active" : ""}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(-1)}>-</button>
                  <input type="number" value={quantity} readOnly />
                  <button onClick={() => handleQuantityChange(1)}>+</button>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="add-to-cart-btn">Add to Cart</button>
              <button className="buy-now-btn">Buy Now</button>
            </div>
          </div>
        </div>

        <div className="tabs-section">
          <div className="tab-headers">
            <button className={`tab-header ${activeTab === "description" ? "active" : ""}`} onClick={() => setActiveTab("description")}>Description</button>
            <button className={`tab-header ${activeTab === "specifications" ? "active" : ""}`} onClick={() => setActiveTab("specifications")}>Specifications</button>
            <button className={`tab-header ${activeTab === "reviews" ? "active" : ""}`} onClick={() => setActiveTab("reviews")}>Reviews</button>
            <button className={`tab-header ${activeTab === "related" ? "active" : ""}`} onClick={() => setActiveTab("related")}>Related Products</button>
          </div>

          <div className="tab-content">
            {activeTab === "description" && (
              <div className="description-content">
                <h3>Product Description</h3>
                <p>This premium cotton t-shirt is crafted from 100% organic cotton for ultimate comfort and durability.</p>
                <ul>
                  <li>100% Organic Cotton</li>
                  <li>Pre-shrunk for perfect fit</li>
                  <li>Machine washable</li>
                  <li>Available in multiple colors and sizes</li>
                </ul>
              </div>
            )}
            {activeTab === "specifications" && (
              <div className="specifications-content">
                <h3>Technical Details</h3>
                <table className="specs-table">
                  <tbody>
                    <tr><td>Material</td><td>100% Organic Cotton</td></tr>
                    <tr><td>Weight</td><td>180 GSM</td></tr>
                    <tr><td>Fit</td><td>Regular Fit</td></tr>
                    <tr><td>Care Instructions</td><td>Machine wash cold, tumble dry low</td></tr>
                    <tr><td>Country of Origin</td><td>USA</td></tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="reviews-content">
                <h3>Customer Reviews</h3>
                <div className="reviews-summary">
                  <div className="average-rating">
                    <span className="rating-number">4.2</span>
                    <div className="stars">{renderStars(4)}</div>
                    <span>Based on 127 reviews</span>
                  </div>
                </div>
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <span className="reviewer-name">{review.name}</span>
                        <div className="review-rating">{renderStars(review.rating)}</div>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "related" && (
              <div className="related-products">
                <h3>You May Also Like</h3>
                <div className="products-grid">
                  {relatedProducts.map((product) => (
                    <div key={product.id} className="product-card">
                      <img src={product.image} alt={product.name} />
                      <h4>{product.name}</h4>
                      <span className="price">${product.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

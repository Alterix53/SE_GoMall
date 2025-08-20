import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "../../contexts/CartContext";
import { Link, useNavigate } from 'react-router-dom';
import "./Cart.css";
import OptimizedImage from "../../utils/OptimizedImage";
import { createPlaceholderUrl } from "../../utils/imageUtils";

export default function CartManager() {
  const { cartItems, updateQuantity, removeFromCart, loading, error } = useCart();
  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState(() => new Set());
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Handle checkout navigation
  const handleCheckout = () => {
    const hasSelection = selectedKeys.size > 0;

    // Only allow checkout if there are selected items
    if (!hasSelection) {
      setShowErrorModal(true);
      return;
    }

    // Get selected items
    const selectedItems = Array.from(selectedKeys)
      .map((key) => cartItems.find((item) => `${item.id}-${item.size}` === key))
      .filter(Boolean);

    if (!selectedItems || selectedItems.length === 0) {
      setShowErrorModal(true);
      return;
    }

    const totalAmount = totals.selectedTotal;
    const totalCount = totals.selectedCount;

    // Check if total amount is greater than 0
    if (totalAmount <= 0) {
      setShowErrorModal(true);
      return;
    }

    // Navigate to checkout with items and totals
    navigate('/checkout', {
      state: {
        selectedItems,
        total: totalAmount,
        count: totalCount,
      },
    });
  };

  // Fetch suggested products on mount (visible both for empty and non-empty carts)
  useEffect(() => {
    fetchSuggestedProducts();
  }, []);

  const fetchSuggestedProducts = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await fetch('http://localhost:8080/api/products?limit=12');
      const data = await response.json();
      
      if (data.success && data.data && data.data.products) {
        // Transform data for display
        const products = data.data.products.map(product => ({
          id: product._id,
          name: product.name,
          image: (() => {
            const raw = product.images?.[0]?.url || '';
            if (!raw) return '/images/placeholder-product.svg';
            return raw.startsWith('http') ? raw : `http://localhost:8080${raw}`;
          })(),
          price: product.price?.sale || product.price?.original || 0,
          originalPrice: product.price?.original || 0,
          discount: product.discount || 0,
          rating: product.rating?.average || 0,
          sold: product.sold || 0,
          isFlashSale: product.isFlashSale || false
        }));
        setSuggestedProducts(products);
      }
    } catch (error) {
      console.error('Error fetching suggested products:', error);
      setSuggestedProducts([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const formatVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const currencyVND = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.max(0, Number(value) || 0));

  const makeKey = (item) => `${item.id}-${item.size || "default"}`;

  const handleSelectItem = (item, checked) => {
    const key = makeKey(item);
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const all = new Set(cartItems.map((i) => makeKey(i)));
      setSelectedKeys(all);
    } else {
      setSelectedKeys(new Set());
    }
  };

  const handleRemoveSelected = async () => {
    const itemsByKey = new Map(cartItems.map((i) => [makeKey(i), i]));
    const keysArray = Array.from(selectedKeys);
    for (const key of keysArray) {
      const item = itemsByKey.get(key);
      if (item) {
        // remove by id + size like before
        // eslint-disable-next-line no-await-in-loop
        await removeFromCart(item.id, item.size);
      }
    }
    setSelectedKeys(new Set());
  };

  const handleUpdateQuantity = async (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(id, size, newQuantity);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemoveItem = async (id, size) => {
    try {
      await removeFromCart(id, size);
      setSelectedKeys((prev) => {
        const next = new Set(prev);
        next.delete(`${id}-${size || "default"}`);
        return next;
      });
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const totals = useMemo(() => {
    const bySelection = cartItems.filter((i) => selectedKeys.has(makeKey(i)));
    const selectedTotal = bySelection.reduce(
      (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
      0
    );
    const selectedCount = bySelection.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

    const allTotal = cartItems.reduce(
      (sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0),
      0
    );
    const allCount = cartItems.reduce((sum, i) => sum + (Number(i.quantity) || 0), 0);

    return { selectedTotal, selectedCount, allTotal, allCount };
  }, [cartItems, selectedKeys]);

  const allSelected = useMemo(
    () => cartItems.length > 0 && selectedKeys.size === cartItems.length,
    [cartItems, selectedKeys]
  );

  // Nếu giỏ hàng trống, hiển thị empty state như Shopee
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page cart--empty">
        <div className="cart-container">
          <span className="page-title">Cart</span>
        </div>
        <div className="cart-wrapper">
          {/* Cart Header */}
          <div className="cart-header-table">
            <div className="cart-table-row cart-table-header">
              <div className="cart-col-checkbox">
                <input type="checkbox" disabled />
              </div>
              <div className="cart-col-product">Product</div>
              <div className="cart-col-price">Unit Price</div>
              <div className="cart-col-quantity">Quantity</div>
              <div className="cart-col-total">Amount</div>
              <div className="cart-col-actions">Actions</div>
            </div>
          </div>

          {/* Voucher Section - Only show when cart has items */}
          {cartItems && cartItems.length > 0 && (
            <div className="cart-voucher-section">
              <div className="voucher-item">
                <div className="voucher-icon">🎫</div>
                <span className="voucher-text">Voucher</span>
                <button className="voucher-select-btn">Select or enter code</button>
              </div>
              <div className="voucher-item">
                <div className="voucher-icon">💰</div>
                <span className="voucher-text">Coins</span>
                <span className="voucher-unavailable">You haven't selected any product</span>
                <span className="voucher-balance">-₫0</span>
              </div>
            </div>
          )}

          {/* Selection Controls */}
          <div className="cart-selection-controls">
            <div className="select-all-section">
              <input type="checkbox" id="select-all" disabled />
              <label htmlFor="select-all">Select All (1)</label>
              <button className="delete-btn" disabled>Delete</button>
              <button className="save-btn" disabled>Save to Favorites</button>
            </div>
            
            <div className="cart-total-section">
              <div className="total-info">
                <span className="total-label">Total (0 items): </span>
                <span className="total-amount">₫0</span>
              </div>
              <button className="checkout-btn" disabled>Checkout</button>
            </div>
          </div>

          {/* Suggested Products Section */}
          <div className="cart-suggestions-section">
            <div className="suggestions-header">
              <h2 className="suggestions-title">YOU MAY ALSO LIKE</h2>
              <Link to="/suggestions" className="view-all-link">View All &gt;</Link>
            </div>
            
            {loadingSuggestions ? (
              <div className="suggestions-loading">
                <div className="loading-spinner"></div>
                <span>Loading products...</span>
              </div>
            ) : (
              <div className="suggestions-grid">
                {suggestedProducts.map((product) => (
                  <Link key={product.id} to={`/product/${product.id}`} className="suggestion-card">
                    <div className="suggestion-image-container">
                      <OptimizedImage 
                        src={product.image}
                        alt={product.name}
                        className="suggestion-image"
                        fallbackUrl={createPlaceholderUrl(160,160,'')}
                        onLoad={() => {}}
                        onError={() => {}}
                      />
                      {product.discount > 0 && (
                        <div className="suggestion-discount">-{product.discount}%</div>
                      )}
                    </div>
                    <div className="suggestion-info">
                        <h3 className="suggestion-name">{product.name}</h3>
                        <div className="suggestion-price">
                          <span className="current-price">{formatVND(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="original-price">{formatVND(product.originalPrice)}</span>
                        )}
                      </div>
                      <div className="suggestion-stats">
                        <div className="rating">
                          <span className="stars">★★★★★</span>
                          <span className="rating-value">{product.rating.toFixed(1)}</span>
                        </div>
                        <span className="sold-count">Sold {product.sold > 1000 ? `${(product.sold/1000).toFixed(1)}k` : product.sold}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }


  return (
    <>
      <div className="cart-container">
        <span className="page-title">Cart</span>
      </div>
      <div className="cart-wrapper">
        {/* New box styled like checkout products-section */}
        <div className="cart-box products-section">
          {/* Header */}
          <div className="products-header">
            <div className="header-row">
              <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span>Product</span>
              </div>
              <div>Unit Price</div>
              <div>Quantity</div>
              <div>Total</div>
              <div>Actions</div>
            </div>
          </div>

          {/* Removed store header per request */}

          {/* Items */}
          {cartItems.map((item) => {
            const key = makeKey(item);
            const salePrice = Number(item.price) || 0;
            const subTotal = salePrice * (Number(item.quantity) || 1);
            return (
              <div className="product-row" key={key}>
                <div className="product-info">
                  <input
                    type="checkbox"
                    checked={selectedKeys.has(key)}
                    onChange={(e) => handleSelectItem(item, e.target.checked)}
                    style={{marginRight:'8px'}}
                  />
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
                    <div className="product-variant">Variant: {item.size || 'Default'}</div>
                  </div>
                </div>
                <div className="product-price">{currencyVND(salePrice)}</div>
                <div className="product-quantity">
                  <div style={{fontSize: '12px', color: '#999', marginBottom: '4px'}}>Quantity</div>
                  <div className="qty-control">
                    <button
                      className="btn-qty"
                      onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input className="qty-input" type="text" value={item.quantity} readOnly />
                    <button
                      className="btn-qty"
                      onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="product-total">{currencyVND(subTotal)}</div>
                <div className="product-actions">
                  <button 
                    className="link danger"
                    onClick={() => handleRemoveItem(item.id, item.size)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}

          {/* Removed insurance and voucher sections per request */}

          {/* Footer */}
          <div className="cart-footer">
            <div className="footer-checkbox">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span>Select All ({selectedKeys.size || 0})</span>
              </label>
            </div>
            <div className="footer-total">
              <div className="total-summary">
                <div className="total-line">
                  <span className="total-label">Total ({totals.selectedCount} items):</span>
                  <span className="total-amount">{currencyVND(totals.selectedTotal)}</span>
                </div>
              </div>
            </div>
            <div className="footer-action" style={{textAlign: 'center'}}>
              <button 
                className="btn-buy" 
                disabled={!cartItems || cartItems.length === 0}
                onClick={handleCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      {/* Suggestions section (always visible) */}
      <div className="cart-suggestions-section">
        <div className="suggestions-header">
          <h2 className="suggestions-title">YOU MAY ALSO LIKE</h2>
          <Link to="/suggestions" className="view-all-link">View All &gt;</Link>
        </div>

        {loadingSuggestions ? (
          <div className="suggestions-loading">
            <div className="loading-spinner"></div>
            <span>Loading products...</span>
          </div>
        ) : (
          <div className="suggestions-grid">
            {suggestedProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="suggestion-card">
                <div className="suggestion-image-container">
                  <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    className="suggestion-image"
                    fallbackUrl={createPlaceholderUrl(160,160,'')}
                    onLoad={() => {}}
                    onError={() => {}}
                  />
                  {product.discount > 0 && (
                    <div className="suggestion-discount">-{product.discount}%</div>
                  )}
                </div>
                <div className="suggestion-info">
                  <h3 className="suggestion-name">{product.name}</h3>
                  <div className="suggestion-price">
                    <span className="current-price">{formatVND(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">{formatVND(product.originalPrice)}</span>
                    )}
                  </div>
                  <div className="suggestion-stats">
                    <div className="rating">
                      <span className="stars">★★★★★</span>
                      <span className="rating-value">{Number(product.rating || 0).toFixed(1)}</span>
                    </div>
                    <span className="sold-count">Sold {product.sold > 1000 ? `${(product.sold/1000).toFixed(1)}k` : product.sold}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="error-modal-overlay">
          <div className="error-modal">
            <div className="error-message">
              You haven't selected any items to purchase.
            </div>
            <button 
              className="error-modal-btn"
              onClick={() => setShowErrorModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
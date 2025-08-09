import React, { useMemo, useState } from "react";
import { useCart } from "../../contexts/CartContext";
import Header from '../Header/Header';
import "./Cart.css";

export default function CartManager() {
  const { cartItems, updateQuantity, removeFromCart, loading, error } = useCart();

  const [selectedKeys, setSelectedKeys] = useState(() => new Set());

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
    for (const key of selectedKeys) {
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="cart-wrapper">
          <div className="cart-empty-state">Đang tải giỏ hàng...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="cart-wrapper">
          <div className="cart-empty-state">Lỗi: {error}</div>
        </div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="cart-wrapper">
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <div className="empty-title">Giỏ hàng trống</div>
            <a href="/" className="btn-orange">Mua sắm ngay</a>
          </div>
        </div>
      </>
    );
  }

  const allSelected = selectedKeys.size === cartItems.length && cartItems.length > 0;

  return (
    <>
      <Header />
      <div className="cart-wrapper">
        {/* Header row */}
        <div className="cart-table header">
        <div className="cell select">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span>Sản Phẩm</span>
          </label>
        </div>
        <div className="cell unit-price">Đơn Giá</div>
        <div className="cell quantity">Số Lượng</div>
        <div className="cell subtotal">Số Tiền</div>
        <div className="cell actions">Thao Tác</div>
      </div>

      {/* Items */}
      {cartItems.map((item) => {
        const key = makeKey(item);
        const salePrice = Number(item.price) || 0;
        const originalPrice = Number(item.originalPrice || item.price) || 0;
        const subTotal = salePrice * (Number(item.quantity) || 1);
        return (
          <div className="cart-table row" key={key}>
            <div className="cell select">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={selectedKeys.has(key)}
                  onChange={(e) => handleSelectItem(item, e.target.checked)}
                />
                <div className="product">
                  <img src={item.image} alt={item.name} />
                  <div className="info">
                    <div className="name" title={item.name}>{item.name}</div>
                    {item.size && item.size !== "default" && (
                      <div className="variant">Phân loại: {item.size}</div>
                    )}
                  </div>
                </div>
              </label>
            </div>

            <div className="cell unit-price">
              <div className="price-block">
                <span className="sale">{currencyVND(salePrice)}</span>
                {originalPrice > salePrice && (
                  <span className="original">{currencyVND(originalPrice)}</span>
                )}
              </div>
            </div>

            <div className="cell quantity">
              <div className="qty-control">
                <button
                  className="btn-qty"
                  onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                  disabled={loading}
                >
                  −
                </button>
                <input className="qty-input" value={item.quantity} readOnly />
                <button
                  className="btn-qty"
                  onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                  disabled={loading}
                >
                  +
                </button>
              </div>
              <div className="stock-note">Còn hàng</div>
            </div>

            <div className="cell subtotal">
              <span className="subtotal-val">{currencyVND(subTotal)}</span>
            </div>

            <div className="cell actions">
              <button
                className="link danger"
                onClick={() => handleRemoveItem(item.id, item.size)}
                disabled={loading}
              >
                Xóa
              </button>
            </div>
          </div>
        );
      })}

      {/* Voucher row (placeholder) */}
      <div className="voucher-row">
        <div className="voucher-title">Shopee Voucher</div>
        <button className="link">Chọn hoặc nhập mã</button>
      </div>

      {/* Footer actions */}
      <div className="cart-footer">
        <div className="left">
          <label className="checkbox">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span>Chọn Tất Cả ({selectedKeys.size || 0})</span>
          </label>
          <button className="link" onClick={handleRemoveSelected} disabled={selectedKeys.size === 0}>
            Xóa
          </button>
          <button className="link">Lưu vào mục Đã thích</button>
        </div>
        <div className="right">
          <div className="total-text">
            Tổng cộng ({totals.selectedCount} Sản phẩm):
            <span className="total-val">{currencyVND(totals.selectedTotal)}</span>
          </div>
          <button className="btn-buy" disabled={selectedKeys.size === 0}>Mua Hàng</button>
        </div>
      </div>
      </div>
    </>
  );
}
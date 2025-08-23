import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { useAuth } from '../../contexts/AuthContext';
import './InvoiceDownload.css';

const InvoiceDownload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, getCurrentUser } = useAuth();
  
  // Get order info from location state or fallback
  const orderData = location.state?.orderData || {
    orderID: 'N/A',
    orderNumber: 'N/A',
    amount: 0,
    items: [],
    createdAt: new Date(),
    shippingAddress: 'N/A',
    paymentMethod: 'N/A'
  };

  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    generateInvoiceData();
  }, [isAuthenticated, navigate]);

  const generateInvoiceData = () => {
    try {
      const currentUser = getCurrentUser();
      const invoice = {
        invoiceNumber: `INV-${Date.now()}`,
        orderNumber: orderData.orderNumber || orderData.orderID,
        orderDate: new Date(orderData.createdAt || Date.now()),
        customerInfo: {
          name: currentUser?.fullName || currentUser?.username || 'Customer',
          email: currentUser?.email || 'N/A',
          phone: currentUser?.phoneNumber || 'N/A',
          address: orderData.shippingAddress || 'N/A'
        },
        items: orderData.items || [],
        subtotal: orderData.amount || 0,
        shippingFee: 1000,
        total: (orderData.amount || 0) + 1000,
        paymentMethod: orderData.paymentMethod || 'Cash',
        status: 'Paid'
      };
      setInvoiceData(invoice);
    } catch (err) {
      setError('Cannot generate invoice data');
    }
  };

  const currencyVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual PDF generation and download
      // For now, we'll create a simple HTML invoice and download it
      const invoiceHTML = generateInvoiceHTML();
      downloadHTMLAsFile(invoiceHTML, `invoice-${invoiceData.invoiceNumber}.html`);
      
      setTimeout(() => {
        setLoading(false);
        alert('Invoice downloaded!');
      }, 2000);
    } catch (err) {
      setError('Cannot download invoice');
      setLoading(false);
    }
  };

  const generateInvoiceHTML = () => {
    if (!invoiceData) return '';
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceData.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .invoice { max-width: 800px; margin: 0 auto; border: 2px solid #333; padding: 30px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; color: #333; }
          .invoice-title { font-size: 20px; margin: 10px 0; }
          .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .customer-info, .invoice-details { flex: 1; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #333; }
          .info-row { margin-bottom: 8px; }
          .info-label { font-weight: bold; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          .items-table th { background-color: #f5f5f5; font-weight: bold; }
          .total-section { text-align: right; margin-bottom: 30px; }
          .total-row { margin-bottom: 8px; font-size: 16px; }
          .final-total { font-size: 20px; font-weight: bold; color: #e91e63; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="company-name">GO MALL</div>
            <div class="invoice-title">SALES INVOICE</div>
            <div>No: ${invoiceData.invoiceNumber}</div>
          </div>
          
          <div class="invoice-info">
            <div class="customer-info">
              <div class="section-title">Customer Information:</div>
              <div class="info-row"><span class="info-label">Name:</span> ${invoiceData.customerInfo.name}</div>
              <div class="info-row"><span class="info-label">Email:</span> ${invoiceData.customerInfo.email}</div>
              <div class="info-row"><span class="info-label">Phone:</span> ${invoiceData.customerInfo.phone}</div>
              <div class="info-row"><span class="info-label">Address:</span> ${invoiceData.customerInfo.address}</div>
            </div>
            
            <div class="invoice-details">
              <div class="section-title">Invoice Details:</div>
              <div class="info-row"><span class="info-label">Order ID:</span> ${invoiceData.orderNumber}</div>
              <div class="info-row"><span class="info-label">Order date:</span> ${formatDate(invoiceData.orderDate)}</div>
              <div class="info-row"><span class="info-label">Payment method:</span> ${invoiceData.paymentMethod}</div>
              <div class="info-row"><span class="info-label">Status:</span> ${invoiceData.status}</div>
            </div>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Product name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Unit price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.name}</td>
                  <td>${item.variant || item.size || 'Standard'}</td>
                  <td>${item.quantity}</td>
                  <td>${currencyVND(item.price)}</td>
                  <td>${currencyVND(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">Subtotal: ${currencyVND(invoiceData.subtotal)}</div>
            <div class="total-row">Shipping fee: ${currencyVND(invoiceData.shippingFee)}</div>
            <div class="total-row final-total">Total: ${currencyVND(invoiceData.total)}</div>
          </div>
          
          <div class="footer">
            <p>Thank you for shopping at GO MALL!</p>
            <p>This invoice was automatically generated on ${formatDate(new Date())}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const downloadHTMLAsFile = (htmlContent, filename) => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleBackToOrder = () => {
    navigate('/orders');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (!invoiceData) {
    return (
      <div className="invoice-download-page">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Creating invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-download-page">
      <Header />
      
      <div className="invoice-container">
        <div className="invoice-header">
          <h1>📄 Order Invoice</h1>
          <p>Invoice for order: <strong>{invoiceData.orderNumber}</strong></p>
        </div>

        <div className="invoice-preview">
          <div className="invoice-preview-header">
            <h2>Invoice Preview</h2>
            <div className="invoice-number">Invoice No: {invoiceData.invoiceNumber}</div>
          </div>

          <div className="invoice-content">
            {/* Company Header */}
            <div className="company-section">
              <div className="company-name">GO MALL</div>
              <div className="company-info">
                <p>🏢 GO MALL LLC</p>
                <p>📍 123 ABC Street, District 1, HCMC</p>
                <p>📞 Hotline: 1900-xxxx</p>
                <p>📧 Email: support@gomall.com</p>
              </div>
            </div>

            {/* Invoice Info */}
            <div className="invoice-info-section">
              <div className="info-grid">
                <div className="info-column">
                  <h3>👤 Customer Information</h3>
                  <div className="info-item">
                    <span className="label">Name:</span>
                    <span className="value">{invoiceData.customerInfo.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Email:</span>
                    <span className="value">{invoiceData.customerInfo.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Phone:</span>
                    <span className="value">{invoiceData.customerInfo.phone}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Address:</span>
                    <span className="value">{invoiceData.customerInfo.address}</span>
                  </div>
                </div>

                <div className="info-column">
                  <h3>📋 Order Information</h3>
                  <div className="info-item">
                    <span className="label">Order ID:</span>
                    <span className="value">{invoiceData.orderNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Order date:</span>
                    <span className="value">{formatDate(invoiceData.orderDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Payment method:</span>
                    <span className="value">{invoiceData.paymentMethod}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Status:</span>
                    <span className="value status-success">{invoiceData.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="items-section">
              <h3>🛍️ Items</h3>
              <div className="items-table">
                <div className="table-header">
                  <div className="header-cell">No</div>
                  <div className="header-cell">Product name</div>
                  <div className="header-cell">Type</div>
                  <div className="header-cell">Quantity</div>
                  <div className="header-cell">Unit price</div>
                  <div className="header-cell">Subtotal</div>
                </div>
                
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="table-row">
                    <div className="table-cell">{index + 1}</div>
                    <div className="table-cell product-name">{item.name}</div>
                    <div className="table-cell">{item.variant || item.size || 'Standard'}</div>
                    <div className="table-cell">{item.quantity}</div>
                    <div className="table-cell">{currencyVND(item.price)}</div>
                    <div className="table-cell">{currencyVND(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="totals-section">
              <div className="total-row">
                <span className="total-label">Subtotal:</span>
                <span className="total-value">{currencyVND(invoiceData.subtotal)}</span>
              </div>
              <div className="total-row">
                <span className="total-label">Shipping fee:</span>
                <span className="total-value">{currencyVND(invoiceData.shippingFee)}</span>
              </div>
              <div className="total-row final-total">
                <span className="total-label">Total:</span>
                <span className="total-value">{currencyVND(invoiceData.total)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="invoice-footer">
              <p>🎉 Thank you for shopping at GO MALL!</p>
              <p>📅 Invoice generated on: {formatDate(new Date())}</p>
              <p>💡 This invoice is legally valid and can be used for warranty and returns</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="invoice-actions">
          <button 
            className="btn btn-primary"
            onClick={handleDownloadPDF}
            disabled={loading}
          >
            {loading ? '⏳ Generating...' : '📥 Download Invoice'}
          </button>
          
          <button className="btn btn-secondary" onClick={handleBackToOrder}>
            👁️ View Orders
          </button>
          
          <button className="btn btn-outline" onClick={handleContinueShopping}>
            🛒 Continue Shopping
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
            <button className="btn btn-primary" onClick={generateInvoiceData}>
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceDownload;

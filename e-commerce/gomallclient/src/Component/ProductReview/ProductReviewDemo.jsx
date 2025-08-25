import React, { useState } from 'react';
import ProductReview from './ProductReview';

const ProductReviewDemo = () => {
  const [productId] = useState('demo-product-123');
  const [productName] = useState('Demo Product');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>Demo Product</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        This is a demo page to test the ProductReview component
      </p>
      
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#495057' }}>Product Information</h3>
        <p style={{ margin: '5px 0', color: '#6c757d' }}>
          <strong>Name:</strong> {productName}
        </p>
        <p style={{ margin: '5px 0', color: '#6c757d' }}>
          <strong>Rating:</strong> 4.5 ⭐
          <span style={{ color: '#666' }}>(127 reviews)</span>
        </p>
        <p style={{ margin: '5px 0', color: '#6c757d' }}>
          <strong>Price:</strong> $99.99
        </p>
      </div>

      <ProductReview 
        productId={productId} 
        productName={productName} 
      />
    </div>
  );
};

export default ProductReviewDemo;

import React from 'react';

const TestCard = ({ title, content, image, variant = 'default', size = 'medium' }) => {
  const getCardStyles = () => {
    const baseStyles = {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    };

    const sizeStyles = {
      small: { maxWidth: '200px' },
      medium: { maxWidth: '300px' },
      large: { maxWidth: '400px' }
    };

    const variantStyles = {
      default: {
        border: '1px solid #ddd'
      },
      elevated: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
      },
      outlined: {
        border: '2px solid #007bff'
      },
      flat: {
        boxShadow: 'none',
        border: '1px solid #eee'
      }
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    };
  };

  return (
    <div style={getCardStyles()}>
      {image && (
        <div style={{ 
          height: '200px', 
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
      )}
      <div style={{ padding: '16px' }}>
        {title && (
          <h3 style={{ 
            margin: '0 0 12px 0', 
            fontSize: size === 'small' ? '16px' : size === 'large' ? '20px' : '18px',
            color: '#333'
          }}>
            {title}
          </h3>
        )}
        {content && (
          <p style={{ 
            margin: 0, 
            color: '#666',
            fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
            lineHeight: '1.5'
          }}>
            {content}
          </p>
        )}
      </div>
    </div>
  );
};

export default TestCard; 
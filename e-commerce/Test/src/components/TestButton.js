import React from 'react';

const TestButton = ({ variant = 'primary', children, onClick, disabled = false, size = 'medium' }) => {
  const getButtonStyles = () => {
    const baseStyles = {
      border: 'none',
      borderRadius: '4px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      outline: 'none'
    };

    const sizeStyles = {
      small: { padding: '6px 12px', fontSize: '12px' },
      medium: { padding: '8px 16px', fontSize: '14px' },
      large: { padding: '12px 24px', fontSize: '16px' }
    };

    const variantStyles = {
      primary: {
        backgroundColor: disabled ? '#6c757d' : '#007bff',
        color: 'white',
        border: '1px solid #007bff'
      },
      secondary: {
        backgroundColor: disabled ? '#6c757d' : '#6c757d',
        color: 'white',
        border: '1px solid #6c757d'
      },
      success: {
        backgroundColor: disabled ? '#6c757d' : '#28a745',
        color: 'white',
        border: '1px solid #28a745'
      },
      danger: {
        backgroundColor: disabled ? '#6c757d' : '#dc3545',
        color: 'white',
        border: '1px solid #dc3545'
      },
      outline: {
        backgroundColor: 'transparent',
        color: disabled ? '#6c757d' : '#007bff',
        border: '1px solid #007bff'
      }
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    };
  };

  return (
    <button
      style={getButtonStyles()}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default TestButton; 
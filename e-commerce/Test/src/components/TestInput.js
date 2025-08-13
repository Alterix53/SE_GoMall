import React, { useState } from 'react';

const TestInput = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  label, 
  size = 'medium',
  variant = 'default',
  disabled = false,
  required = false,
  error = false,
  helperText
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputStyles = () => {
    const baseStyles = {
      width: '100%',
      border: '1px solid #ddd',
      borderRadius: '4px',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    };

    const sizeStyles = {
      small: { padding: '6px 12px', fontSize: '12px' },
      medium: { padding: '8px 12px', fontSize: '14px' },
      large: { padding: '12px 16px', fontSize: '16px' }
    };

    const variantStyles = {
      default: {
        borderColor: error ? '#dc3545' : isFocused ? '#007bff' : '#ddd',
        backgroundColor: disabled ? '#f8f9fa' : 'white'
      },
      outlined: {
        borderColor: error ? '#dc3545' : isFocused ? '#007bff' : '#ddd',
        borderWidth: '2px',
        backgroundColor: disabled ? '#f8f9fa' : 'white'
      },
      filled: {
        borderColor: error ? '#dc3545' : isFocused ? '#007bff' : '#ddd',
        backgroundColor: disabled ? '#f8f9fa' : '#f8f9fa'
      }
    };

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant]
    };
  };

  const getLabelStyles = () => {
    return {
      display: 'block',
      marginBottom: '4px',
      fontSize: size === 'small' ? '12px' : size === 'large' ? '16px' : '14px',
      color: error ? '#dc3545' : '#333',
      fontWeight: '500'
    };
  };

  const getHelperTextStyles = () => {
    return {
      fontSize: '12px',
      marginTop: '4px',
      color: error ? '#dc3545' : '#666'
    };
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={getLabelStyles()}>
          {label}
          {required && <span style={{ color: '#dc3545' }}> *</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        required={required}
        style={getInputStyles()}
      />
      {helperText && (
        <div style={getHelperTextStyles()}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default TestInput; 
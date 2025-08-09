import React from 'react';

const Label = ({ 
  children, 
  className = "", 
  htmlFor,
  ...props 
}) => {
  return (
    <label 
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
    </label>
  );
};

export { Label }; 
import React from 'react';

const Input = ({ 
  className = "", 
  type = "text",
  value,
  onChange,
  id,
  inputMode,
  "aria-live": ariaLive,
  ...props 
}) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      value={value}
      onChange={onChange}
      id={id}
      inputMode={inputMode}
      aria-live={ariaLive}
      {...props}
    />
  );
};

export { Input }; 
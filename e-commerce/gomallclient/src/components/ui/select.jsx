import React, { useState, useRef, useEffect } from 'react';

const Select = ({ 
  children, 
  value, 
  onValueChange, 
  ...props 
}) => {
  return (
    <div className="relative" {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <button 
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const SelectValue = ({ 
  placeholder = "Select option", 
  ...props 
}) => {
  return (
    <span className="text-left" {...props}>
      {placeholder}
    </span>
  );
};

const SelectContent = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <div className={`absolute top-full z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md ${className}`} {...props}>
      {children}
    </div>
  );
};

const SelectItem = ({ 
  children, 
  value, 
  onValueChange,
  className = "", 
  ...props 
}) => {
  return (
    <div 
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${className}`}
      onClick={() => onValueChange?.(value)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }; 
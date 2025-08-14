import React from 'react';

const Separator = ({ 
  orientation = "horizontal", 
  className = "", 
  ...props 
}) => {
  const classes = orientation === "horizontal" 
    ? "h-px w-full bg-border" 
    : "h-full w-px bg-border";
  
  return (
    <div className={`${classes} ${className}`} {...props} />
  );
};

export { Separator }; 
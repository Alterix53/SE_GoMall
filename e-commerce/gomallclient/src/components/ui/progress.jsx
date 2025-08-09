import React from 'react';

const Progress = ({ 
  value = 0, 
  className = "", 
  ...props 
}) => {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-secondary ${className}`} {...props}>
      <div 
        className="h-full w-full flex-1 bg-primary transition-all" 
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export { Progress }; 
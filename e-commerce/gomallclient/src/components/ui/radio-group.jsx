import React from 'react';

const RadioGroup = ({ 
  children, 
  value, 
  onValueChange, 
  className = "", 
  ...props 
}) => {
  return (
    <div className={className} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const RadioGroupItem = ({ 
  id, 
  value, 
  ...props 
}) => {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      className="peer sr-only"
      {...props}
    />
  );
};

export { RadioGroup, RadioGroupItem }; 
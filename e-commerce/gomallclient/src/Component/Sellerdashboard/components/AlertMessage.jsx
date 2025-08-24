import React from 'react';

const AlertMessage = ({ message, onClear }) => {
  if (!message.text) return null;

  return (
    <div className={`alert alert-${message.type}`} onClick={onClear}>
      {message.text}
      <button type="button" className="btn-close" onClick={onClear}></button>
    </div>
  );
};

export default AlertMessage;

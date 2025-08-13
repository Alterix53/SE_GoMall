import React from 'react';
import './ChatButton.css';

const ChatButton = () => {
  return (
    <div className="chat-button">
      <button className="chat-btn">
        <span className="chat-icon">💬</span>
        <span className="chat-text">Chat</span>
      </button>
    </div>
  );
};

export default ChatButton; 
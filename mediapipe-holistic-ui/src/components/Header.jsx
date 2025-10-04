import React from 'react';

const Header = ({ isStreaming }) => {
  return (
    <div className="header">
      <h1>MediaPipe Holistic Analysis</h1>
      <div className="status-indicator">
        <div className={`status-dot ${isStreaming ? 'active' : 'inactive'}`}></div>
        <span>{isStreaming ? 'Streaming' : 'Stopped'}</span>
      </div>
    </div>
  );
};

export default Header;


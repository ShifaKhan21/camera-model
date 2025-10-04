import React from 'react';
import './Timer.css';

const Timer = ({ elapsedTime, isStreaming }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`timer ${isStreaming ? 'active' : 'inactive'}`}>
      <div className="timer-label">Session Time</div>
      <div className="timer-display">{formatTime(elapsedTime)}</div>
    </div>
  );
};

export default Timer;


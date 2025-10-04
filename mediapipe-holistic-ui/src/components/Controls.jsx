import React from 'react';
import Timer from './Timer';
import ExportButton from './ExportButton';
import './Controls.css';

const Controls = ({ isStreaming, onStart, onStop, elapsedTime, onExport, summariesCount }) => {
  return (
    <div className="controls">
      <div className="controls-row">
        <button
          onClick={isStreaming ? onStop : onStart}
          className={`control-btn ${isStreaming ? 'stop' : 'start'}`}
        >
          {isStreaming ? 'Stop Camera' : 'Start Camera'}
        </button>
        <ExportButton 
          onExport={onExport} 
          disabled={summariesCount === 0}
          summariesCount={summariesCount}
        />
      </div>
      <Timer elapsedTime={elapsedTime} isStreaming={isStreaming} />
    </div>
  );
};

export default Controls;


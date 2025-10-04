import React from 'react';
import './ExportButton.css';

const ExportButton = ({ onExport, disabled, summariesCount }) => {
  return (
    <button
      onClick={onExport}
      disabled={disabled}
      className="export-btn"
      title={disabled ? 'No data to export' : 'Export analysis data as JSON'}
    >
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span>Export JSON {summariesCount > 0 && `(${summariesCount})`}</span>
    </button>
  );
};

export default ExportButton;


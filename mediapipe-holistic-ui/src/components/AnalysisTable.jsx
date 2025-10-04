import React from 'react';

const AnalysisTable = ({ summaries, lastUpdate }) => {
  return (
    <div className="analysis-section">
      <h3>Analysis Results {summaries.length > 0 && `(${summaries.length} cycles)`}</h3>
      <div className="table-container">
        <table className="analysis-table">
          <thead>
            <tr>
              <th>Cycle</th>
              <th>Expression</th>
              <th>Posture</th>
              <th>Eye Contact</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {summaries.length > 0 ? (
              summaries.map((summary, index) => (
                <tr key={summary.timestamp} className={index === summaries.length - 1 ? 'latest-row' : ''}>
                  <td>{index + 1}</td>
                  <td>
                    <span className={`detection-value ${summary.expression === 'happy' ? 'smiling' : summary.expression === 'not detected' ? 'not-detected' : ''}`}>
                      {summary.expression} ({(summary.expressionConfidence * 100).toFixed(0)}%)
                    </span>
                  </td>
                  <td>
                    <span className={`detection-value ${summary.posture === 'straight' ? 'upright' : summary.posture === 'slouched' ? 'slouched' : summary.posture === 'not detected' ? 'not-detected' : ''}`}>
                      {summary.posture} ({(summary.postureConfidence * 100).toFixed(0)}%)
                    </span>
                  </td>
                  <td>
                    <span className={`detection-value ${summary.eyeContact === 'maintained' ? 'maintained' : summary.eyeContact === 'not detected' ? 'not-detected' : ''}`}>
                      {summary.eyeContact} ({(summary.eyeContactConfidence * 100).toFixed(0)}%)
                    </span>
                  </td>
                  <td>{new Date(summary.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontStyle: 'italic' }}>
                  No data yet. Start the camera to begin analysis.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {summaries.length > 0 && (
        <div className="last-update">
          Last updated: {lastUpdate}
        </div>
      )}
    </div>
  );
};

export default AnalysisTable;


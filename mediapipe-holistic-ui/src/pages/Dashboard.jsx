import React from 'react';
import Header from '../components/Header';
import VideoCanvas from '../components/VideoCanvas';
import Controls from '../components/Controls';
import AnalysisTable from '../components/AnalysisTable';
import { useHolisticAnalysis } from '../hooks/useHolisticAnalysis';

const Dashboard = () => {
  const {
    isStreaming,
    summaries,
    lastUpdate,
    elapsedTime,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    exportData
  } = useHolisticAnalysis();

  return (
    <div className="app">
      <Header isStreaming={isStreaming} />
      <VideoCanvas videoRef={videoRef} canvasRef={canvasRef} />
      <Controls 
        isStreaming={isStreaming} 
        onStart={startCamera} 
        onStop={stopCamera}
        elapsedTime={elapsedTime}
        onExport={exportData}
        summariesCount={summaries.length}
      />
      <AnalysisTable summaries={summaries} lastUpdate={lastUpdate} />
    </div>
  );
};

export default Dashboard;


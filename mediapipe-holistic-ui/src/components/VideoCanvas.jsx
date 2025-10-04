import React from 'react';

const VideoCanvas = ({ videoRef, canvasRef }) => {
  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="video"
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="canvas"
      />
    </div>
  );
};

export default VideoCanvas;


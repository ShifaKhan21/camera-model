import { FACEMESH_TESSELATION, POSE_CONNECTIONS } from '@mediapipe/holistic';

export const drawResults = (canvas, results) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Draw face mesh in light green
  if (results.faceLandmarks) {
    drawFaceMesh(ctx, results.faceLandmarks, width, height);
  }

  // Draw pose landmarks (shoulders with orange dots)
  if (results.poseLandmarks) {
    drawPoseLandmarks(ctx, results.poseLandmarks, width, height);
  }
};

const drawFaceMesh = (ctx, landmarks, width, height) => {
  // Draw face mesh connections in light green
  ctx.strokeStyle = '#90EE90'; // Light green
  ctx.lineWidth = 1;

  // Draw the mesh connections
  for (const connection of FACEMESH_TESSELATION) {
    const start = landmarks[connection[0]];
    const end = landmarks[connection[1]];

    if (start && end) {
      ctx.beginPath();
      ctx.moveTo(start.x * width, start.y * height);
      ctx.lineTo(end.x * width, end.y * height);
      ctx.stroke();
    }
  }

  // Optionally draw face landmark points (small dots)
  ctx.fillStyle = '#90EE90';
  for (const landmark of landmarks) {
    if (landmark) {
      ctx.beginPath();
      ctx.arc(landmark.x * width, landmark.y * height, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
};

const drawPoseLandmarks = (ctx, landmarks, width, height) => {
  // MediaPipe pose landmark indices
  const LEFT_SHOULDER = 11;
  const RIGHT_SHOULDER = 12;
  const LEFT_HIP = 23;
  const RIGHT_HIP = 24;
  const LEFT_ELBOW = 13;
  const RIGHT_ELBOW = 14;

  const shoulderLandmarks = [
    { index: LEFT_SHOULDER, name: 'Left Shoulder' },
    { index: RIGHT_SHOULDER, name: 'Right Shoulder' }
  ];

  // Draw orange dots on shoulders
  ctx.fillStyle = '#FF8C00'; // Orange (dark orange)
  shoulderLandmarks.forEach(({ index }) => {
    const landmark = landmarks[index];
    if (landmark) {
      // Draw larger dot
      ctx.beginPath();
      ctx.arc(landmark.x * width, landmark.y * height, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw white border for better visibility
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });

  // Draw line connecting shoulders in orange
  const leftShoulder = landmarks[LEFT_SHOULDER];
  const rightShoulder = landmarks[RIGHT_SHOULDER];
  
  if (leftShoulder && rightShoulder) {
    ctx.strokeStyle = '#FF8C00'; // Orange
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(leftShoulder.x * width, leftShoulder.y * height);
    ctx.lineTo(rightShoulder.x * width, rightShoulder.y * height);
    ctx.stroke();
  }

  // Optionally draw other pose connections (subtle)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2;
  
  const connections = [
    [LEFT_SHOULDER, LEFT_ELBOW],
    [RIGHT_SHOULDER, RIGHT_ELBOW],
    [LEFT_SHOULDER, LEFT_HIP],
    [RIGHT_SHOULDER, RIGHT_HIP]
  ];

  connections.forEach(([start, end]) => {
    const startLandmark = landmarks[start];
    const endLandmark = landmarks[end];
    
    if (startLandmark && endLandmark) {
      ctx.beginPath();
      ctx.moveTo(startLandmark.x * width, startLandmark.y * height);
      ctx.lineTo(endLandmark.x * width, endLandmark.y * height);
      ctx.stroke();
    }
  });
};


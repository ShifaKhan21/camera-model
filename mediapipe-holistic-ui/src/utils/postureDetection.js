export const detectPosture = (results) => {
  const landmarks = results.pose?.landmarks || results.poseLandmarks || results.pose?.worldLandmarks;
  
  if (!landmarks || landmarks.length === 0) {
    return {
      posture: 'not detected',
      postureConfidence: 0
    };
  }

  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  
  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
    return {
      posture: 'not detected',
      postureConfidence: 0
    };
  }

  // Calculate centers
  const shoulderCenter = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2
  };
  const hipCenter = {
    x: (leftHip.x + rightHip.x) / 2,
    y: (leftHip.y + rightHip.y) / 2
  };
  
  // Calculate vertical distance and alignment
  const verticalDistance = Math.abs(shoulderCenter.y - hipCenter.y);
  const shoulderAlignment = Math.abs(leftShoulder.y - rightShoulder.y);
  
  let posture = 'not detected';
  let postureConfidence = 0;
  
  // Determine posture based on vertical distance
  if (verticalDistance > 0.3 && shoulderAlignment < 0.1) {
    posture = 'STRAIGHT';
    postureConfidence = 0.9;
  } else if (verticalDistance > 0.2) {
    posture = 'LEAN_FORWARD';
    postureConfidence = 0.8;
  } else if (verticalDistance > 0.1) {
    posture = 'SLOUCHED';
    postureConfidence = 0.85;
  } else {
    posture = 'LEAN_BACK';
    postureConfidence = 0.8;
  }
  
  // Add sitting/standing context
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  
  if (leftKnee && rightKnee) {
    const kneeHeight = (leftKnee.y + rightKnee.y) / 2;
    const hipKneeDistance = Math.abs(hipCenter.y - kneeHeight);
    const shoulderHipDistance = Math.abs(shoulderCenter.y - hipCenter.y);
    
    if (hipKneeDistance < shoulderHipDistance * 0.8) {
      posture = 'SITTING_' + posture;
    } else {
      posture = 'STANDING_' + posture;
    }
  } else {
    posture = 'SITTING_' + posture;
  }

  return { posture, postureConfidence };
};


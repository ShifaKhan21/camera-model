export const detectEyeContact = (faceLandmarks) => {
  if (!faceLandmarks || faceLandmarks.length === 0) {
    return {
      eyeContact: 'not detected',
      eyeContactConfidence: 0
    };
  }

  const landmarks = faceLandmarks;
  
  // Get eye landmarks
  const leftEyeInner = landmarks[33];
  const leftEyeOuter = landmarks[133];
  const rightEyeInner = landmarks[362];
  const rightEyeOuter = landmarks[263];
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const rightEyeTop = landmarks[386];
  const rightEyeBottom = landmarks[374];
  
  if (!leftEyeInner || !leftEyeOuter || !rightEyeInner || !rightEyeOuter || 
      !leftEyeTop || !leftEyeBottom || !rightEyeTop || !rightEyeBottom) {
    return {
      eyeContact: 'not detected',
      eyeContactConfidence: 0
    };
  }
  
  // Calculate eye aspect ratio (EAR)
  const leftEAR = Math.abs(leftEyeTop.y - leftEyeBottom.y) / (Math.abs(leftEyeOuter.x - leftEyeInner.x) + 0.001);
  const rightEAR = Math.abs(rightEyeTop.y - rightEyeBottom.y) / (Math.abs(rightEyeOuter.x - rightEyeInner.x) + 0.001);
  const avgEAR = (leftEAR + rightEAR) / 2;
  
  if (avgEAR > 0.25) {
    // Eyes are open, check if looking at camera
    const eyeCenter = {
      x: ((leftEyeInner.x + leftEyeOuter.x) / 2 + (rightEyeInner.x + rightEyeOuter.x) / 2) / 2,
      y: ((leftEyeTop.y + leftEyeBottom.y) / 2 + (rightEyeTop.y + rightEyeBottom.y) / 2) / 2
    };
    
    const nose = landmarks[1];
    if (nose) {
      const eyeNoseDistance = Math.abs(eyeCenter.x - nose.x);
      const eyeLevel = Math.abs(eyeCenter.y - nose.y);
      
      if (eyeNoseDistance < 0.08 && eyeLevel < 0.12) {
        return {
          eyeContact: 'maintained',
          eyeContactConfidence: 0.9
        };
      } else {
        return {
          eyeContact: 'not maintained',
          eyeContactConfidence: 0.7
        };
      }
    }
  } else {
    return {
      eyeContact: 'eyes closed',
      eyeContactConfidence: 0.95
    };
  }

  return {
    eyeContact: 'not detected',
    eyeContactConfidence: 0
  };
};


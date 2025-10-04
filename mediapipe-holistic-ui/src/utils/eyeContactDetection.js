export const detectEyeContact = (faceLandmarks) => {
  if (!faceLandmarks || faceLandmarks.length === 0) {
    return {
      eyeContact: 'not detected',
      eyeContactConfidence: 0
    };
  }

  const landmarks = faceLandmarks;
  
  // Eye landmarks (more comprehensive)
  const leftEyeInner = landmarks[133];
  const leftEyeOuter = landmarks[33];
  const leftEyeTop = landmarks[159];
  const leftEyeBottom = landmarks[145];
  const leftEyeCenter = landmarks[468]; // Left iris center
  
  const rightEyeInner = landmarks[362];
  const rightEyeOuter = landmarks[263];
  const rightEyeTop = landmarks[386];
  const rightEyeBottom = landmarks[374];
  const rightEyeCenter = landmarks[473]; // Right iris center
  
  // Face reference points for head pose
  const noseTip = landmarks[1];
  const noseBridge = landmarks[6];
  const chin = landmarks[152];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];
  
  if (!leftEyeInner || !leftEyeOuter || !rightEyeInner || !rightEyeOuter || 
      !leftEyeTop || !leftEyeBottom || !rightEyeTop || !rightEyeBottom || !noseTip) {
    return {
      eyeContact: 'not detected',
      eyeContactConfidence: 0
    };
  }
  
  // 1. Calculate Eye Aspect Ratio (EAR) - Check if eyes are open
  const leftEAR = Math.abs(leftEyeTop.y - leftEyeBottom.y) / (Math.abs(leftEyeOuter.x - leftEyeInner.x) + 0.001);
  const rightEAR = Math.abs(rightEyeTop.y - rightEyeBottom.y) / (Math.abs(rightEyeOuter.x - rightEyeInner.x) + 0.001);
  const avgEAR = (leftEAR + rightEAR) / 2;
  
  // Eyes closed detection (threshold: 0.2)
  if (avgEAR < 0.2) {
    return {
      eyeContact: 'eyes closed',
      eyeContactConfidence: 0.95
    };
  }
  
  // 2. Calculate face center and symmetry
  const faceCenter = {
    x: (leftCheek.x + rightCheek.x) / 2,
    y: (noseBridge.y + chin.y) / 2
  };
  
  // 3. Check head pose alignment (is face looking straight at camera?)
  const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
  const noseDeviation = Math.abs(noseTip.x - faceCenter.x) / faceWidth;
  const verticalAlignment = Math.abs(noseTip.y - faceCenter.y);
  
  // Head is not facing camera (turned away)
  if (noseDeviation > 0.15 || verticalAlignment > 0.15) {
    return {
      eyeContact: 'looking away',
      eyeContactConfidence: 0.85
    };
  }
  
  // 4. Improved iris/pupil tracking for gaze direction
  let gazeScore = 0;
  
  if (leftEyeCenter && rightEyeCenter) {
    // Calculate iris position relative to eye corners
    const leftEyeWidth = Math.abs(leftEyeOuter.x - leftEyeInner.x);
    const rightEyeWidth = Math.abs(rightEyeOuter.x - rightEyeInner.x);
    
    // Iris deviation from center (0 = centered, higher = looking away)
    const leftIrisDeviation = Math.abs((leftEyeCenter.x - leftEyeInner.x) - leftEyeWidth / 2) / leftEyeWidth;
    const rightIrisDeviation = Math.abs((rightEyeCenter.x - rightEyeInner.x) - rightEyeWidth / 2) / rightEyeWidth;
    const avgIrisDeviation = (leftIrisDeviation + rightIrisDeviation) / 2;
    
    // Iris centered means direct eye contact
    if (avgIrisDeviation < 0.15) {
      gazeScore += 0.5; // Strong indicator of direct gaze
    } else if (avgIrisDeviation < 0.25) {
      gazeScore += 0.3; // Moderate indicator
    }
  }
  
  // 5. Eye-nose-face geometry analysis
  const leftEyeCenterPoint = {
    x: (leftEyeInner.x + leftEyeOuter.x) / 2,
    y: (leftEyeTop.y + leftEyeBottom.y) / 2
  };
  const rightEyeCenterPoint = {
    x: (rightEyeInner.x + rightEyeOuter.x) / 2,
    y: (rightEyeTop.y + rightEyeBottom.y) / 2
  };
  
  // Eyes should be level and symmetrical for direct gaze
  const eyeSymmetry = Math.abs(leftEyeCenterPoint.y - rightEyeCenterPoint.y);
  const eyeNoseAlignment = Math.abs(
    ((leftEyeCenterPoint.x + rightEyeCenterPoint.x) / 2) - noseTip.x
  );
  
  if (eyeSymmetry < 0.02) {
    gazeScore += 0.2; // Eyes are level
  }
  
  if (eyeNoseAlignment < 0.03) {
    gazeScore += 0.3; // Eyes aligned with nose
  }
  
  // 6. Calculate confidence and determine eye contact status
  let eyeContact = 'not maintained';
  let confidence = 0;
  
  if (gazeScore >= 0.7) {
    eyeContact = 'strong eye contact';
    confidence = Math.min(0.95, 0.75 + gazeScore * 0.2);
  } else if (gazeScore >= 0.5) {
    eyeContact = 'maintained';
    confidence = Math.min(0.9, 0.7 + gazeScore * 0.15);
  } else if (gazeScore >= 0.3) {
    eyeContact = 'moderate';
    confidence = 0.65 + gazeScore * 0.1;
  } else {
    eyeContact = 'not maintained';
    confidence = 0.5 + gazeScore * 0.2;
  }
  
  return {
    eyeContact,
    eyeContactConfidence: confidence
  };
};


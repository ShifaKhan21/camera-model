export const detectExpression = (faceLandmarks) => {
  if (!faceLandmarks || faceLandmarks.length === 0) {
    return {
      expression: 'not detected',
      expressionConfidence: 0,
      emotions: {
        happy: 0,
        sad: 0,
        angry: 0,
        surprised: 0,
        fearful: 0,
        disgusted: 0,
        neutral: 0
      }
    };
  }

  const landmarks = faceLandmarks;
  
  // Key facial landmark indices for emotion detection
  const mouthPoints = {
    upperLip: landmarks[13],
    lowerLip: landmarks[14],
    leftCorner: landmarks[61],
    rightCorner: landmarks[291],
    mouthCenter: landmarks[0]
  };
  
  const eyePoints = {
    leftEye: {
      inner: landmarks[33],
      outer: landmarks[133],
      top: landmarks[159],
      bottom: landmarks[145]
    },
    rightEye: {
      inner: landmarks[362],
      outer: landmarks[263],
      top: landmarks[386],
      bottom: landmarks[374]
    }
  };
  
  const eyebrowPoints = {
    leftInner: landmarks[70],
    leftOuter: landmarks[63],
    rightInner: landmarks[300],
    rightOuter: landmarks[293]
  };
  
  const nosePoints = {
    tip: landmarks[1],
    leftNostril: landmarks[31],
    rightNostril: landmarks[35]
  };

  // Calculate facial features
  const mouthOpening = Math.abs(mouthPoints.upperLip.y - mouthPoints.lowerLip.y);
  const mouthWidth = Math.abs(mouthPoints.rightCorner.x - mouthPoints.leftCorner.x);
  const mouthCurvature = (mouthPoints.leftCorner.y + mouthPoints.rightCorner.y) / 2 - mouthPoints.mouthCenter.y;
  
  const leftEyeOpening = Math.abs(eyePoints.leftEye.top.y - eyePoints.leftEye.bottom.y);
  const rightEyeOpening = Math.abs(eyePoints.rightEye.top.y - eyePoints.rightEye.bottom.y);
  const avgEyeOpening = (leftEyeOpening + rightEyeOpening) / 2;
  
  const leftEyebrowHeight = eyebrowPoints.leftInner.y - eyePoints.leftEye.top.y;
  const rightEyebrowHeight = eyebrowPoints.rightInner.y - eyePoints.rightEye.top.y;
  const avgEyebrowHeight = (leftEyebrowHeight + rightEyebrowHeight) / 2;
  
  const noseWidth = Math.abs(nosePoints.rightNostril.x - nosePoints.leftNostril.x);
  
  // Emotion detection algorithms
  const happyScore = Math.max(0, Math.min(1, 
    (mouthCurvature * 20) + (mouthOpening * 10) + (avgEyebrowHeight * 5) - (avgEyeOpening * 3)
  ));
  
  const sadScore = Math.max(0, Math.min(1,
    (-mouthCurvature * 15) + (-avgEyebrowHeight * 8) + (avgEyeOpening * 2)
  ));
  
  const angryScore = Math.max(0, Math.min(1,
    (-avgEyeOpening * 8) + (-avgEyebrowHeight * 6) + (-mouthOpening * 5) + 
    (Math.abs(eyebrowPoints.leftInner.y - eyebrowPoints.leftOuter.y) * 10)
  ));
  
  const surprisedScore = Math.max(0, Math.min(1,
    (avgEyeOpening * 8) + (avgEyebrowHeight * 10) + (mouthOpening * 6)
  ));
  
  const fearfulScore = Math.max(0, Math.min(1,
    (avgEyeOpening * 6) + (avgEyebrowHeight * 8) + (mouthOpening * 3) + (noseWidth * 5)
  ));
  
  const disgustedScore = Math.max(0, Math.min(1,
    (noseWidth * 8) + (-avgEyeOpening * 4) + (-mouthCurvature * 10) + 
    (Math.abs(nosePoints.tip.y - mouthPoints.upperLip.y) * 5)
  ));
  
  const neutralScore = Math.max(0, Math.min(1,
    1 - Math.abs(mouthCurvature * 10) - Math.abs(avgEyebrowHeight * 5) - 
    Math.abs(avgEyeOpening - 0.02) * 20
  ));
  
  // Normalize scores
  const totalScore = happyScore + sadScore + angryScore + surprisedScore + 
                     fearfulScore + disgustedScore + neutralScore;
  
  const emotions = {
    happy: totalScore > 0 ? happyScore / totalScore : 0,
    sad: totalScore > 0 ? sadScore / totalScore : 0,
    angry: totalScore > 0 ? angryScore / totalScore : 0,
    surprised: totalScore > 0 ? surprisedScore / totalScore : 0,
    fearful: totalScore > 0 ? fearfulScore / totalScore : 0,
    disgusted: totalScore > 0 ? disgustedScore / totalScore : 0,
    neutral: totalScore > 0 ? neutralScore / totalScore : 0
  };
  
  // Get the emotion with highest confidence
  const emotionEntries = Object.entries(emotions);
  const maxEmotion = emotionEntries.reduce((a, b) => 
    emotions[a[0]] > emotions[b[0]] ? a : b
  );
  
  return {
    expression: maxEmotion[0],
    expressionConfidence: maxEmotion[1],
    emotions
  };
};


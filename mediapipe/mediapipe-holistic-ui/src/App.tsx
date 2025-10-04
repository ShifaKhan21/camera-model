import React, { useState, useRef, useEffect } from 'react';
import { Holistic } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import './App.css';

interface HolisticResults {
  pose: any;
  faceLandmarks: any;
  leftHandLandmarks: any;
  rightHandLandmarks: any;
}

interface SummaryData {
  timestamp: number;
  poseConfidence: number;
  faceDetected: boolean;
  handsDetected: number;
  dominantHand: 'left' | 'right' | 'none';
  expression: string;
  expressionConfidence: number;
  emotions: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    fearful: number;
    disgusted: number;
    neutral: number;
  };
  posture: string;
  postureConfidence: number;
  eyeContact: string;
  eyeContactConfidence: number;
}

const App: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const holisticRef = useRef<Holistic | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const summaryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const frameCountRef = useRef(0);
  const summaryDataRef = useRef<SummaryData[]>([]);

  useEffect(() => {
    return () => {
      if (summaryIntervalRef.current) {
        clearInterval(summaryIntervalRef.current);
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      if (!videoRef.current) return;

      const holistic = new Holistic({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }
      });

      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      holistic.onResults((results: HolisticResults) => {
        if (canvasRef.current && videoRef.current) {
          const canvas = canvasRef.current;
          const video = videoRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw video frame
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Process results for summary
            processHolisticResults(results);
          }
        }
      });

      holisticRef.current = holistic;

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (holisticRef.current && videoRef.current) {
            await holisticRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });

      cameraRef.current = camera;
      await camera.start();
      setIsStreaming(true);

      // Start 10-second summary interval
      summaryIntervalRef.current = setInterval(() => {
        generateSummary();
      }, 10000);

    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  const stopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (summaryIntervalRef.current) {
      clearInterval(summaryIntervalRef.current);
      summaryIntervalRef.current = null;
    }
    setIsStreaming(false);
    summaryDataRef.current = [];
    frameCountRef.current = 0;
  };

  const processHolisticResults = (results: HolisticResults) => {
    frameCountRef.current++;
    
    const poseConfidence = results.pose?.worldLandmarks ? 
      results.pose.worldLandmarks.reduce((acc: number, landmark: any) => 
        acc + (landmark.visibility || 0), 0) / results.pose.worldLandmarks.length : 0;
    
    const faceDetected = results.faceLandmarks && results.faceLandmarks.length > 0;
    const leftHandDetected = results.leftHandLandmarks && results.leftHandLandmarks.length > 0;
    const rightHandDetected = results.rightHandLandmarks && results.rightHandLandmarks.length > 0;
    const handsDetected = (leftHandDetected ? 1 : 0) + (rightHandDetected ? 1 : 0);
    
    let dominantHand: 'left' | 'right' | 'none' = 'none';
    if (leftHandDetected && rightHandDetected) {
      // Simple heuristic: compare hand landmark confidence
      const leftConfidence = results.leftHandLandmarks.reduce((acc: number, landmark: any) => 
        acc + (landmark.visibility || 0), 0) / results.leftHandLandmarks.length;
      const rightConfidence = results.rightHandLandmarks.reduce((acc: number, landmark: any) => 
        acc + (landmark.visibility || 0), 0) / results.rightHandLandmarks.length;
      dominantHand = leftConfidence > rightConfidence ? 'left' : 'right';
    } else if (leftHandDetected) {
      dominantHand = 'left';
    } else if (rightHandDetected) {
      dominantHand = 'right';
    }

    // Advanced expression analysis using MediaPipe landmarks
    let expression = 'not detected';
    let expressionConfidence = 0;
    let emotions = {
      happy: 0,
      sad: 0,
      angry: 0,
      surprised: 0,
      fearful: 0,
      disgusted: 0,
      neutral: 0
    };

    if (faceDetected && results.faceLandmarks) {
      const landmarks = results.faceLandmarks;
      
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
      
      // HAPPY: Smiling mouth, raised eyebrows, squinted eyes
      const happyScore = Math.max(0, Math.min(1, 
        (mouthCurvature * 20) + // Smile curvature
        (mouthOpening * 10) + // Mouth opening
        (avgEyebrowHeight * 5) - // Raised eyebrows
        (avgEyeOpening * 3) // Slightly squinted eyes
      ));
      
      // SAD: Downturned mouth, lowered eyebrows, droopy eyes
      const sadScore = Math.max(0, Math.min(1,
        (-mouthCurvature * 15) + // Downturned mouth
        (-avgEyebrowHeight * 8) + // Lowered eyebrows
        (avgEyeOpening * 2) // Wider eyes
      ));
      
      // ANGRY: Narrowed eyes, furrowed eyebrows, tight mouth
      const angryScore = Math.max(0, Math.min(1,
        (-avgEyeOpening * 8) + // Narrowed eyes
        (-avgEyebrowHeight * 6) + // Furrowed eyebrows
        (-mouthOpening * 5) + // Tight mouth
        (Math.abs(eyebrowPoints.leftInner.y - eyebrowPoints.leftOuter.y) * 10) // Eyebrow asymmetry
      ));
      
      // SURPRISED: Wide eyes, raised eyebrows, open mouth
      const surprisedScore = Math.max(0, Math.min(1,
        (avgEyeOpening * 8) + // Wide eyes
        (avgEyebrowHeight * 10) + // Raised eyebrows
        (mouthOpening * 6) // Open mouth
      ));
      
      // FEARFUL: Wide eyes, raised eyebrows, slightly open mouth
      const fearfulScore = Math.max(0, Math.min(1,
        (avgEyeOpening * 6) + // Wide eyes
        (avgEyebrowHeight * 8) + // Raised eyebrows
        (mouthOpening * 3) + // Slightly open mouth
        (noseWidth * 5) // Flared nostrils
      ));
      
      // DISGUSTED: Wrinkled nose, narrowed eyes, downturned mouth
      const disgustedScore = Math.max(0, Math.min(1,
        (noseWidth * 8) + // Wrinkled nose
        (-avgEyeOpening * 4) + // Narrowed eyes
        (-mouthCurvature * 10) + // Downturned mouth
        (Math.abs(nosePoints.tip.y - mouthPoints.upperLip.y) * 5) // Nose-mouth distance
      ));
      
      // NEUTRAL: Balanced features
      const neutralScore = Math.max(0, Math.min(1,
        1 - Math.abs(mouthCurvature * 10) - // Not smiling or frowning
        Math.abs(avgEyebrowHeight * 5) - // Not raised or lowered
        Math.abs(avgEyeOpening - 0.02) * 20 // Normal eye opening
      ));
      
      // Normalize scores to sum to 1
      const totalScore = happyScore + sadScore + angryScore + surprisedScore + fearfulScore + disgustedScore + neutralScore;
      
      emotions = {
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
      const maxEmotion = emotionEntries.reduce((a, b) => emotions[a[0] as keyof typeof emotions] > emotions[b[0] as keyof typeof emotions] ? a : b);
      
      expression = maxEmotion[0];
      expressionConfidence = maxEmotion[1];
    }

    // Posture detection using MediaPipe pose landmarks
    let posture = 'not detected';
    let postureConfidence = 0;
    
    const landmarks = results.pose?.landmarks || results.poseLandmarks || results.pose?.worldLandmarks;
    
    if (landmarks && landmarks.length > 0) {
      const leftShoulder = landmarks[11];
      const rightShoulder = landmarks[12];
      const leftHip = landmarks[23];
      const rightHip = landmarks[24];
      
      if (leftShoulder && rightShoulder && leftHip && rightHip) {
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
      }
    }

    // Eye contact analysis using eye aspect ratio
    let eyeContact = 'not detected';
    let eyeContactConfidence = 0;
    
    if (faceDetected && results.faceLandmarks) {
      const landmarks = results.faceLandmarks;
      
      // Get eye landmarks
      const leftEyeInner = landmarks[33];
      const leftEyeOuter = landmarks[133];
      const rightEyeInner = landmarks[362];
      const rightEyeOuter = landmarks[263];
      const leftEyeTop = landmarks[159];
      const leftEyeBottom = landmarks[145];
      const rightEyeTop = landmarks[386];
      const rightEyeBottom = landmarks[374];
      
      if (leftEyeInner && leftEyeOuter && rightEyeInner && rightEyeOuter && 
          leftEyeTop && leftEyeBottom && rightEyeTop && rightEyeBottom) {
        
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
              eyeContact = 'maintained';
              eyeContactConfidence = 0.9;
            } else {
              eyeContact = 'not maintained';
              eyeContactConfidence = 0.7;
            }
          }
        } else {
          eyeContact = 'eyes closed';
          eyeContactConfidence = 0.95;
        }
      }
    }

    const currentData: SummaryData = {
      timestamp: Date.now(),
      poseConfidence,
      faceDetected,
      handsDetected,
      dominantHand,
      expression,
      expressionConfidence,
      emotions,
      posture,
      postureConfidence,
      eyeContact,
      eyeContactConfidence
    };

    summaryDataRef.current.push(currentData);
    
    // Keep only last 10 seconds of data
    const tenSecondsAgo = Date.now() - 10000;
    summaryDataRef.current = summaryDataRef.current.filter(data => data.timestamp > tenSecondsAgo);
  };

  const generateSummary = () => {
    if (summaryDataRef.current.length === 0) return;

    const recentData = summaryDataRef.current;
    const avgPoseConfidence = recentData.reduce((acc, data) => acc + data.poseConfidence, 0) / recentData.length;
    const faceDetectionRate = recentData.filter(data => data.faceDetected).length / recentData.length;
    const avgHandsDetected = recentData.reduce((acc, data) => acc + data.handsDetected, 0) / recentData.length;
    
    const leftHandCount = recentData.filter(data => data.dominantHand === 'left').length;
    const rightHandCount = recentData.filter(data => data.dominantHand === 'right').length;
    const dominantHand = leftHandCount > rightHandCount ? 'left' : 
                        rightHandCount > leftHandCount ? 'right' : 'none';

    // Calculate averages for new fields
    const avgExpressionConfidence = recentData.reduce((acc, data) => acc + data.expressionConfidence, 0) / recentData.length;
    const avgPostureConfidence = recentData.reduce((acc, data) => acc + data.postureConfidence, 0) / recentData.length;
    const avgEyeContactConfidence = recentData.reduce((acc, data) => acc + data.eyeContactConfidence, 0) / recentData.length;

    // Calculate average emotions
    const avgEmotions = {
      happy: recentData.reduce((acc, data) => acc + data.emotions.happy, 0) / recentData.length,
      sad: recentData.reduce((acc, data) => acc + data.emotions.sad, 0) / recentData.length,
      angry: recentData.reduce((acc, data) => acc + data.emotions.angry, 0) / recentData.length,
      surprised: recentData.reduce((acc, data) => acc + data.emotions.surprised, 0) / recentData.length,
      fearful: recentData.reduce((acc, data) => acc + data.emotions.fearful, 0) / recentData.length,
      disgusted: recentData.reduce((acc, data) => acc + data.emotions.disgusted, 0) / recentData.length,
      neutral: recentData.reduce((acc, data) => acc + data.emotions.neutral, 0) / recentData.length
    };

    // Determine most common values
    const expressions = recentData.map(data => data.expression);
    const postures = recentData.map(data => data.posture);
    const eyeContacts = recentData.map(data => data.eyeContact);

    const mostCommonExpression = expressions.reduce((a, b, i, arr) => 
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    );
    const mostCommonPosture = postures.reduce((a, b, i, arr) => 
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    );
    const mostCommonEyeContact = eyeContacts.reduce((a, b, i, arr) => 
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    );

    const newSummary: SummaryData = {
      timestamp: Date.now(),
      poseConfidence: avgPoseConfidence,
      faceDetected: faceDetectionRate > 0.5,
      handsDetected: Math.round(avgHandsDetected),
      dominantHand,
      expression: mostCommonExpression,
      expressionConfidence: avgExpressionConfidence,
      emotions: avgEmotions,
      posture: mostCommonPosture,
      postureConfidence: avgPostureConfidence,
      eyeContact: mostCommonEyeContact,
      eyeContactConfidence: avgEyeContactConfidence
    };

    setSummaries(prev => [...prev, newSummary]);
    setLastUpdate(new Date().toLocaleTimeString());
  };

  return (
    <div className="app">
      <div className="header">
        <h1>MediaPipe Holistic Analysis</h1>
        <div className="status-indicator">
          <div className={`status-dot ${isStreaming ? 'active' : 'inactive'}`}></div>
          <span>{isStreaming ? 'Streaming' : 'Stopped'}</span>
        </div>
      </div>

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

      <div className="controls">
        <button
          onClick={isStreaming ? stopCamera : startCamera}
          className={`control-btn ${isStreaming ? 'stop' : 'start'}`}
        >
          {isStreaming ? 'Stop Camera' : 'Start Camera'}
        </button>
      </div>

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
    </div>
  );
};

export default App;

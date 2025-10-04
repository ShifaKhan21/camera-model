import { useState, useRef, useEffect } from 'react';
import { Holistic } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import { detectExpression } from '../utils/expressionDetection';
import { detectPosture } from '../utils/postureDetection';
import { detectEyeContact } from '../utils/eyeContactDetection';
import { drawResults } from '../utils/drawingUtils';

export const useHolisticAnalysis = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [summaries, setSummaries] = useState([]);
  const [lastUpdate, setLastUpdate] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const holisticRef = useRef(null);
  const cameraRef = useRef(null);
  const summaryIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const frameCountRef = useRef(0);
  const summaryDataRef = useRef([]);

  useEffect(() => {
    return () => {
      if (summaryIntervalRef.current) {
        clearInterval(summaryIntervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  const processHolisticResults = (results) => {
    frameCountRef.current++;
    
    const poseConfidence = results.pose?.worldLandmarks ? 
      results.pose.worldLandmarks.reduce((acc, landmark) => 
        acc + (landmark.visibility || 0), 0) / results.pose.worldLandmarks.length : 0;
    
    const faceDetected = results.faceLandmarks && results.faceLandmarks.length > 0;
    const leftHandDetected = results.leftHandLandmarks && results.leftHandLandmarks.length > 0;
    const rightHandDetected = results.rightHandLandmarks && results.rightHandLandmarks.length > 0;
    const handsDetected = (leftHandDetected ? 1 : 0) + (rightHandDetected ? 1 : 0);
    
    let dominantHand = 'none';
    if (leftHandDetected && rightHandDetected) {
      const leftConfidence = results.leftHandLandmarks.reduce((acc, landmark) => 
        acc + (landmark.visibility || 0), 0) / results.leftHandLandmarks.length;
      const rightConfidence = results.rightHandLandmarks.reduce((acc, landmark) => 
        acc + (landmark.visibility || 0), 0) / results.rightHandLandmarks.length;
      dominantHand = leftConfidence > rightConfidence ? 'left' : 'right';
    } else if (leftHandDetected) {
      dominantHand = 'left';
    } else if (rightHandDetected) {
      dominantHand = 'right';
    }

    const { expression, expressionConfidence, emotions } = detectExpression(results.faceLandmarks);
    const { posture, postureConfidence } = detectPosture(results);
    const { eyeContact, eyeContactConfidence } = detectEyeContact(results.faceLandmarks);

    const currentData = {
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

    const avgExpressionConfidence = recentData.reduce((acc, data) => acc + data.expressionConfidence, 0) / recentData.length;
    const avgPostureConfidence = recentData.reduce((acc, data) => acc + data.postureConfidence, 0) / recentData.length;
    const avgEyeContactConfidence = recentData.reduce((acc, data) => acc + data.eyeContactConfidence, 0) / recentData.length;

    const avgEmotions = {
      happy: recentData.reduce((acc, data) => acc + data.emotions.happy, 0) / recentData.length,
      sad: recentData.reduce((acc, data) => acc + data.emotions.sad, 0) / recentData.length,
      angry: recentData.reduce((acc, data) => acc + data.emotions.angry, 0) / recentData.length,
      surprised: recentData.reduce((acc, data) => acc + data.emotions.surprised, 0) / recentData.length,
      fearful: recentData.reduce((acc, data) => acc + data.emotions.fearful, 0) / recentData.length,
      disgusted: recentData.reduce((acc, data) => acc + data.emotions.disgusted, 0) / recentData.length,
      neutral: recentData.reduce((acc, data) => acc + data.emotions.neutral, 0) / recentData.length
    };

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

    const newSummary = {
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

      holistic.onResults((results) => {
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
            
            // Draw face mesh and pose landmarks
            drawResults(canvas, results);
            
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

      // Start timer
      startTimeRef.current = Date.now();
      setElapsedTime(0);
      timerIntervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);

      // Start summary interval
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
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setIsStreaming(false);
    summaryDataRef.current = [];
    frameCountRef.current = 0;
    startTimeRef.current = null;
  };

  const exportData = () => {
    const exportObject = {
      exportDate: new Date().toISOString(),
      sessionDuration: elapsedTime,
      totalCycles: summaries.length,
      summaries: summaries.map((summary, index) => ({
        cycle: index + 1,
        timestamp: new Date(summary.timestamp).toISOString(),
        expression: summary.expression,
        expressionConfidence: Math.round(summary.expressionConfidence * 100),
        posture: summary.posture,
        postureConfidence: Math.round(summary.postureConfidence * 100),
        eyeContact: summary.eyeContact,
        eyeContactConfidence: Math.round(summary.eyeContactConfidence * 100),
        emotions: {
          happy: Math.round(summary.emotions.happy * 100),
          sad: Math.round(summary.emotions.sad * 100),
          angry: Math.round(summary.emotions.angry * 100),
          surprised: Math.round(summary.emotions.surprised * 100),
          fearful: Math.round(summary.emotions.fearful * 100),
          disgusted: Math.round(summary.emotions.disgusted * 100),
          neutral: Math.round(summary.emotions.neutral * 100)
        },
        faceDetected: summary.faceDetected,
        handsDetected: summary.handsDetected,
        dominantHand: summary.dominantHand,
        poseConfidence: Math.round(summary.poseConfidence * 100)
      }))
    };

    // Create blob and download
    const dataStr = JSON.stringify(exportObject, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `holistic-analysis-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    isStreaming,
    summaries,
    lastUpdate,
    elapsedTime,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    exportData
  };
};


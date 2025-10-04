import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <Link to="/" className="back-link">← Back to Home</Link>
        
        <h1 className="about-title">About MediaPipe Holistic Analysis</h1>
        
        <div className="about-content">
          <section className="about-section">
            <h2>What is MediaPipe Holistic?</h2>
            <p>
              MediaPipe Holistic is a cutting-edge ML solution that provides simultaneous 
              detection of face, pose, and hand landmarks in real-time. Our application 
              leverages this powerful technology to analyze human behavior and expressions.
            </p>
          </section>

          <section className="about-section">
            <h2>Features</h2>
            <ul>
              <li><strong>Expression Detection:</strong> Identifies 7 emotions - Happy, Sad, Angry, Surprised, Fearful, Disgusted, and Neutral</li>
              <li><strong>Posture Analysis:</strong> Detects sitting/standing position and evaluates posture quality</li>
              <li><strong>Eye Contact Tracking:</strong> Monitors gaze direction and eye openness</li>
              <li><strong>Real-time Processing:</strong> Analyzes video feed at ~30 FPS with minimal latency</li>
              <li><strong>Summary Reports:</strong> Generates comprehensive summaries every 10 seconds</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Technology Stack</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <h3>React 18</h3>
                <p>Modern UI framework for building interactive interfaces</p>
              </div>
              <div className="tech-item">
                <h3>MediaPipe</h3>
                <p>Google's ML library for pose and face detection</p>
              </div>
              <div className="tech-item">
                <h3>Vite</h3>
                <p>Fast build tool for modern web development</p>
              </div>
              <div className="tech-item">
                <h3>JavaScript</h3>
                <p>Clean, maintainable code without complexity</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>How It Works</h2>
            <ol>
              <li>Grant camera permissions when prompted</li>
              <li>Click "Start Camera" to begin analysis</li>
              <li>The system tracks 468 face landmarks, 33 pose landmarks, and 21 hand landmarks per hand</li>
              <li>Custom algorithms process these landmarks to determine emotions, posture, and eye contact</li>
              <li>Results are aggregated every 10 seconds and displayed in an easy-to-read table</li>
            </ol>
          </section>

          <section className="about-section">
            <h2>Use Cases</h2>
            <ul>
              <li>Video conferencing engagement analysis</li>
              <li>Interview practice and feedback</li>
              <li>Presentation skills assessment</li>
              <li>Accessibility applications</li>
              <li>Human-computer interaction research</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Privacy</h2>
            <p>
              All processing happens locally in your browser. No video data is sent to external 
              servers. Your privacy is our priority.
            </p>
          </section>
        </div>

        <div className="about-actions">
          <Link to="/dashboard" className="btn btn-primary">Try It Now</Link>
          <Link to="/" className="btn btn-secondary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default About;


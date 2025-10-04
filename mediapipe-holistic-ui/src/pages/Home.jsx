import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">MediaPipe Holistic Analysis</h1>
        <p className="home-subtitle">Real-time human behavior analysis using AI</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">😊</div>
            <h3>Expression Detection</h3>
            <p>Analyze 7 different emotions in real-time</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🧍</div>
            <h3>Posture Analysis</h3>
            <p>Track sitting/standing posture quality</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">👁️</div>
            <h3>Eye Contact</h3>
            <p>Monitor gaze direction and engagement</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Analytics</h3>
            <p>10-second summary cycles with confidence scores</p>
          </div>
        </div>
        
        <div className="home-actions">
          <Link to="/dashboard" className="btn btn-primary">
            Start Analysis
          </Link>
          <Link to="/about" className="btn btn-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;


# MediaPipe Holistic Analysis Dashboard

A real-time human behavior analysis application using MediaPipe Holistic for expression, posture, and eye contact detection.

## Features

- **Real-time Analysis**: Continuous monitoring with 10-second summary cycles
- **Expression Detection**: 7 emotion classification (Happy, Sad, Angry, Surprised, Fearful, Disgusted, Neutral)
- **Posture Analysis**: Sitting/Standing detection with posture quality assessment
- **Eye Contact Detection**: Eye openness and gaze direction analysis
- **Professional UI**: Clean, full-screen dark interface with tabular results

## Technologies Used

- **React 18** with JavaScript (JSX)
- **MediaPipe Holistic** for pose, face, and hand landmark detection
- **Vite** for fast development and building
- **Custom Algorithms** for emotion and posture classification

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mediapipe-holistic-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## Usage

1. **Start Camera**: Click "Start Camera" to begin analysis
2. **Real-time Monitoring**: The system analyzes your:
   - Facial expressions and emotions
   - Posture (sitting/standing with quality assessment)
   - Eye contact and eye openness
3. **Summary Reports**: Every 10 seconds, a summary is generated and added to the table
4. **Stop Analysis**: Click "Stop Camera" to end the session

## Detection Capabilities

### Expression Detection
- **Happy**: Smiling with raised cheeks
- **Sad**: Downward mouth corners, lowered eyebrows
- **Angry**: Furrowed brows, tense mouth
- **Surprised**: Raised eyebrows, wide eyes
- **Fearful**: Wide eyes, tense facial muscles
- **Disgusted**: Wrinkled nose, raised upper lip
- **Neutral**: Relaxed facial features

### Posture Detection
- **STRAIGHT**: Upright torso, level shoulders
- **LEAN_FORWARD**: Slight forward lean showing engagement
- **SLOUCHED**: Rounded spine, hunched shoulders
- **LEAN_BACK**: Reclined position
- **Sitting/Standing**: Automatic detection based on body proportions

### Eye Contact Detection
- **Maintained**: Looking directly at camera
- **Not Maintained**: Looking away from camera
- **Eyes Closed**: When eyes are detected as closed

## Technical Details

### MediaPipe Integration
- Uses MediaPipe Holistic for simultaneous pose, face, and hand detection
- Processes 33 pose landmarks, 468 face landmarks, and 21 hand landmarks per hand
- Real-time processing at ~30 FPS

### Custom Algorithms
- **Emotion Detection**: Landmark-based analysis using facial geometry
- **Posture Analysis**: Vertical distance and alignment calculations
- **Eye Contact**: Eye Aspect Ratio (EAR) for openness detection

## Project Structure

```
mediapipe-holistic-ui/        # Frontend application
├── src/
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   ├── index.css            # Global styles
│   └── main.jsx             # Application entry point
├── index.html               # HTML template
├── package.json             # Dependencies
└── vite.config.js           # Vite configuration

Backend/                      # Backend folder (currently empty)
```

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open an issue on GitHub.
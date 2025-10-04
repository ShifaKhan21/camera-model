# Camera Model Project

A full-stack application for real-time human behavior analysis using MediaPipe Holistic.

## Project Structure

This project is organized into separate frontend and backend folders:

```
camera-model/
├── mediapipe-holistic-ui/    # Frontend Application (React + JavaScript)
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── App.css           # Application styles
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   ├── index.html            # HTML template
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite configuration
│   └── README.md             # Frontend documentation
│
└── Backend/                  # Backend Application (to be implemented)
```

## Frontend - MediaPipe Holistic UI

A React-based web application that provides real-time analysis of:
- **Facial Expressions**: 7 emotion types (Happy, Sad, Angry, Surprised, Fearful, Disgusted, Neutral)
- **Posture Detection**: Standing/Sitting with quality assessment
- **Eye Contact**: Gaze direction and eye openness tracking

### Frontend Setup

```bash
cd mediapipe-holistic-ui
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

For more details, see [mediapipe-holistic-ui/README.md](mediapipe-holistic-ui/README.md)

## Backend

The backend folder is currently empty and ready for implementation. This can be used for:
- Data storage and analysis
- API services
- Authentication
- Video processing services

## Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **JavaScript (ES6+)** - Programming language
- **MediaPipe Holistic** - ML library for pose/face/hand detection

### Backend
- To be determined based on project requirements

## Development

### Frontend Development
```bash
cd mediapipe-holistic-ui
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Features

- ✅ Real-time camera feed processing
- ✅ Expression detection with confidence scores
- ✅ Posture analysis (sitting/standing detection)
- ✅ Eye contact monitoring
- ✅ 10-second summary cycles
- ✅ Professional dark-themed UI
- ✅ Responsive design

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

**Note**: Requires camera permissions for full functionality.

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


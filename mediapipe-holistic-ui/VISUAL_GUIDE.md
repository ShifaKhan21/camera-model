# Visual Overlay Guide

## What You'll See

When you start the camera analysis, the following visual overlays will appear on your video feed:

### 🟢 Light Green Face Mesh

```
     Face Mesh Visualization
     ┌─────────────────────┐
     │   ╭─────────╮       │
     │  ╱  ●   ●   ╲      │  ← Eyes with mesh
     │ │   ╲───╱    │     │  ← Nose mesh
     │ │  ╲     ╱   │     │  ← Mouth mesh
     │  ╲  ╲─╱     ╱      │  ← Jaw contour
     │   ╲─────────╱       │
     └─────────────────────┘
```

**Details:**
- 468 facial landmark points
- Light green color (#90EE90)
- Thin lines connecting all points
- Creates a complete 3D facial mesh

### 🟠 Orange Shoulder Markers

```
     Pose Visualization
     ┌─────────────────────┐
     │                     │
     │      ●──────●      │  ← Orange dots on shoulders
     │     ╱│      │╲     │     with connecting line
     │    ╱ │      │ ╲    │  ← Subtle white lines
     │   ╱  │      │  ╲   │     to body parts
     │  ●   │      │   ●  │
     └─────────────────────┘
```

**Details:**
- 8px orange dots on each shoulder
- White border for visibility
- 3px orange line connecting shoulders
- Subtle white lines to elbows and hips

## Color Palette

| Element | Color Name | Hex Code | RGB |
|---------|-----------|----------|-----|
| Face Mesh | Light Green | `#90EE90` | rgb(144, 238, 144) |
| Shoulder Dots | Orange | `#FF8C00` | rgb(255, 140, 0) |
| Shoulder Line | Orange | `#FF8C00` | rgb(255, 140, 0) |
| Pose Connections | White (30%) | `rgba(255,255,255,0.3)` | rgba(255, 255, 255, 0.3) |

## Visual Layout

```
┌─────────────────────────────────────────┐
│  MediaPipe Holistic Analysis            │
├─────────────────────────────────────────┤
│                                         │
│   ┌───────────────────────────┐        │
│   │  🎥 Live Video Feed       │        │
│   │                           │        │
│   │    🟢 Face Mesh           │        │
│   │    (light green)          │        │
│   │                           │        │
│   │      🟠 ●───● 🟠          │        │
│   │      Shoulders            │        │
│   │      (orange)             │        │
│   │                           │        │
│   └───────────────────────────┘        │
│                                         │
│  [Start Camera] [Stop Camera]          │
│                                         │
│  Analysis Results Table                 │
│  ┌─────┬───────────┬─────────┐         │
│  │ ... │ ...       │ ...     │         │
│  └─────┴───────────┴─────────┘         │
└─────────────────────────────────────────┘
```

## Real-time Updates

The overlays update in real-time:
- **Frame rate**: ~30 FPS
- **Latency**: < 50ms
- **Smooth rendering**: No flickering

## Visibility Conditions

### Face Mesh Appears When:
✅ Face is detected in frame  
✅ Lighting is adequate  
✅ Face is within camera view  

### Shoulder Markers Appear When:
✅ Upper body is visible  
✅ Shoulders are in frame  
✅ Body pose is detected  

## Tips for Best Visualization

1. **Lighting**: Ensure good lighting on your face
2. **Distance**: Sit 2-3 feet from camera
3. **Position**: Keep face and shoulders in frame
4. **Background**: Use a plain background for better detection

## What Each Color Means

| Color | Purpose | Visibility |
|-------|---------|-----------|
| 🟢 Light Green | Facial structure mapping | Always on when face detected |
| 🟠 Orange | Posture reference points | Always on when body detected |
| ⚪ White (faded) | Body connections | Subtle, non-intrusive |

## Performance Impact

- **Minimal**: Overlays add negligible processing time
- **Optimized**: Uses efficient canvas drawing
- **Smooth**: No lag or stuttering

## Quick Start

1. Click "Start Camera"
2. Allow camera permissions
3. Position yourself in frame
4. Watch the overlays appear automatically!

The light green face mesh and orange shoulder dots will appear as soon as MediaPipe detects your face and body.

Enjoy your analysis! 🎉


# Visual Features Documentation

## Overview

The application now includes real-time visual overlays that display detected landmarks and connections on the video feed.

## Visual Overlays

### 1. **Light Green Face Mesh** 🟢

The face mesh visualization displays 468 facial landmarks connected by a tessellation pattern.

**Features:**
- **Color**: Light green (`#90EE90`)
- **Line Width**: 1px for subtle mesh lines
- **Points**: Small 1px dots at each landmark
- **Coverage**: Complete facial structure including:
  - Eyes and eyebrows
  - Nose and nostrils
  - Mouth and lips
  - Jawline and chin
  - Facial contours

**Technical Details:**
- Uses MediaPipe's `FACEMESH_TESSELATION` connections
- Draws all 468 face landmarks
- Real-time rendering at ~30 FPS

### 2. **Orange Shoulder Markers** 🟠

Prominent orange dots mark the shoulder positions with connecting lines.

**Features:**
- **Color**: Orange (`#FF8C00`)
- **Dot Size**: 8px radius with white border
- **Line Width**: 3px connecting line
- **Landmarks**:
  - Left shoulder (landmark 11)
  - Right shoulder (landmark 12)

**Additional Pose Visualization:**
- Subtle white lines (30% opacity) showing:
  - Shoulder to elbow connections
  - Shoulder to hip connections
- Line width: 2px

## Implementation

### File Structure

```
src/utils/
├── drawingUtils.js          # Main drawing utility
├── expressionDetection.js   # Expression analysis
├── postureDetection.js      # Posture analysis
└── eyeContactDetection.js   # Eye contact tracking
```

### Drawing Utility (`drawingUtils.js`)

The `drawResults()` function handles all visual overlays:

```javascript
import { drawResults } from '../utils/drawingUtils';

// In the holistic results callback
drawResults(canvas, results);
```

#### Functions

1. **`drawResults(canvas, results)`**
   - Main entry point for drawing
   - Orchestrates face mesh and pose rendering

2. **`drawFaceMesh(ctx, landmarks, width, height)`**
   - Renders face mesh in light green
   - Draws 468 landmark points
   - Connects points using FACEMESH_TESSELATION

3. **`drawPoseLandmarks(ctx, landmarks, width, height)`**
   - Draws orange shoulder markers
   - Creates shoulder connection line
   - Adds subtle body pose lines

## Customization

### Changing Colors

Edit `src/utils/drawingUtils.js`:

```javascript
// Face mesh color
ctx.strokeStyle = '#90EE90'; // Light green (change to any hex color)

// Shoulder markers color
ctx.fillStyle = '#FF8C00'; // Orange (change to any hex color)
```

### Adjusting Sizes

```javascript
// Face mesh line width
ctx.lineWidth = 1; // Increase for thicker lines

// Shoulder dot size
ctx.arc(x, y, 8, 0, 2 * Math.PI); // Change 8 to adjust radius

// Shoulder connection line
ctx.lineWidth = 3; // Increase for thicker line
```

### Adding More Landmarks

To add more pose landmarks (e.g., elbows, hips):

```javascript
const additionalLandmarks = [
  { index: 13, name: 'Left Elbow' },
  { index: 14, name: 'Right Elbow' },
  { index: 23, name: 'Left Hip' },
  { index: 24, name: 'Right Hip' }
];

// Add to drawPoseLandmarks function
additionalLandmarks.forEach(({ index }) => {
  const landmark = landmarks[index];
  if (landmark) {
    ctx.beginPath();
    ctx.arc(landmark.x * width, landmark.y * height, 8, 0, 2 * Math.PI);
    ctx.fill();
  }
});
```

## MediaPipe Landmark Indices

### Pose Landmarks (33 points)

Key landmarks used in visualization:
- **11**: Left Shoulder
- **12**: Right Shoulder
- **13**: Left Elbow
- **14**: Right Elbow
- **23**: Left Hip
- **24**: Right Hip
- **25**: Left Knee
- **26**: Right Knee

### Face Landmarks (468 points)

The complete face mesh includes:
- **0-32**: Face oval contour
- **33-133**: Left eye region
- **159-386**: Eye and eyebrow details
- **61-291**: Mouth region
- And many more for detailed facial structure

## Performance Considerations

### Optimization Tips

1. **Reduce Face Mesh Density**:
   ```javascript
   // Draw fewer connections for better performance
   const reducedConnections = FACEMESH_TESSELATION.filter((_, i) => i % 2 === 0);
   ```

2. **Adjust Line Width**:
   - Thinner lines = Better performance
   - Current setting (1px) is optimized

3. **Conditional Rendering**:
   ```javascript
   // Only draw if landmarks are detected
   if (results.faceLandmarks && results.faceLandmarks.length > 0) {
     drawFaceMesh(...);
   }
   ```

## Visual Examples

### Color Scheme

| Element | Color | Hex Code | Purpose |
|---------|-------|----------|---------|
| Face Mesh | Light Green | `#90EE90` | Facial structure visibility |
| Shoulder Dots | Orange | `#FF8C00` | Shoulder position markers |
| Shoulder Line | Orange | `#FF8C00` | Shoulder connection |
| Pose Lines | White (30%) | `rgba(255,255,255,0.3)` | Subtle body structure |

### Visibility

- **Face Mesh**: Subtle but visible, doesn't obstruct face
- **Shoulder Markers**: Prominent with white borders for clarity
- **Pose Lines**: Semi-transparent, non-intrusive

## Integration Flow

```
Video Feed (from camera)
    ↓
MediaPipe Holistic Processing
    ↓
Results Object (face + pose landmarks)
    ↓
Canvas Rendering:
  1. Draw video frame
  2. Draw face mesh (light green)
  3. Draw shoulder markers (orange)
  4. Draw pose connections (subtle white)
    ↓
Display to User
```

## Browser Support

Visual overlays work in all browsers that support:
- HTML5 Canvas API
- MediaPipe Web
- WebGL (for MediaPipe processing)

Tested on:
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Troubleshooting

### Issue: Overlays not showing

**Solution**: Check if landmarks are detected
```javascript
console.log('Face landmarks:', results.faceLandmarks?.length);
console.log('Pose landmarks:', results.poseLandmarks?.length);
```

### Issue: Colors not visible

**Solution**: Adjust opacity or use contrasting colors
```javascript
ctx.strokeStyle = 'rgba(144, 238, 144, 1.0)'; // Full opacity
```

### Issue: Performance lag

**Solution**: Reduce drawing complexity
```javascript
// Skip face mesh if needed
if (results.poseLandmarks) {
  drawPoseLandmarks(...); // Only draw pose
}
```

## Future Enhancements

Potential additions:
- Hand skeleton visualization
- Customizable color themes
- Toggle visibility controls
- Recording with overlays
- Screenshot capture with landmarks

## References

- [MediaPipe Holistic Documentation](https://google.github.io/mediapipe/solutions/holistic.html)
- [Canvas API Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [MediaPipe Landmark Indices](https://github.com/google/mediapipe/blob/master/mediapipe/python/solutions/holistic.py)


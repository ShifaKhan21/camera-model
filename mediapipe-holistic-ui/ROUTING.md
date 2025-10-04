# Routing Documentation

## Overview

The application now uses **React Router v6** for client-side routing, providing a seamless multi-page experience.

## Route Structure

```
App.jsx (Root Router)
├── / (Home)                    → Landing page with features overview
├── /dashboard (Dashboard)      → Main analysis interface with camera
├── /about (About)              → Information about the application
└── * (NotFound)                → 404 page for invalid routes
```

## Routes

### 1. **Home Page** (`/`)
- **Component**: `pages/Home.jsx`
- **Purpose**: Landing page with feature highlights
- **Features**:
  - Welcome message
  - Feature cards (Expression, Posture, Eye Contact, Analytics)
  - Call-to-action buttons
  - Navigation to Dashboard and About pages

### 2. **Dashboard** (`/dashboard`)
- **Component**: `pages/Dashboard.jsx`
- **Purpose**: Main application - real-time analysis interface
- **Features**:
  - Live camera feed
  - MediaPipe Holistic integration
  - Expression detection
  - Posture analysis
  - Eye contact tracking
  - Real-time summary table

### 3. **About Page** (`/about`)
- **Component**: `pages/About.jsx`
- **Purpose**: Information about the technology and features
- **Features**:
  - Technology stack overview
  - Feature explanations
  - How it works guide
  - Use cases
  - Privacy information

### 4. **404 Not Found** (`*`)
- **Component**: `pages/NotFound.jsx`
- **Purpose**: Catch-all route for invalid URLs
- **Features**:
  - User-friendly error message
  - Link back to home page

## File Structure

```
src/
├── App.jsx                      # Root component with Router setup
├── App.css                      # Global styles
│
├── pages/                       # Page components
│   ├── Home.jsx                 # Landing page
│   ├── Home.css
│   ├── Dashboard.jsx            # Analysis dashboard
│   ├── About.jsx                # About page
│   ├── About.css
│   ├── NotFound.jsx             # 404 page
│   └── NotFound.css
│
├── components/                  # Reusable UI components
│   ├── Header.jsx
│   ├── VideoCanvas.jsx
│   ├── Controls.jsx
│   └── AnalysisTable.jsx
│
├── hooks/                       # Custom React hooks
│   └── useHolisticAnalysis.js
│
└── utils/                       # Utility functions
    ├── expressionDetection.js
    ├── postureDetection.js
    └── eyeContactDetection.js
```

## Navigation

### Using Link Component

```jsx
import { Link } from 'react-router-dom';

// Navigate to different routes
<Link to="/">Home</Link>
<Link to="/dashboard">Dashboard</Link>
<Link to="/about">About</Link>
```

### Programmatic Navigation

```jsx
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/dashboard');
  };
  
  return <button onClick={handleClick}>Go to Dashboard</button>;
};
```

## Adding New Routes

To add a new route:

1. **Create a new page component**:
   ```jsx
   // src/pages/NewPage.jsx
   import React from 'react';
   
   const NewPage = () => {
     return (
       <div>
         <h1>New Page</h1>
       </div>
     );
   };
   
   export default NewPage;
   ```

2. **Import and add route in App.jsx**:
   ```jsx
   import NewPage from './pages/NewPage';
   
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/dashboard" element={<Dashboard />} />
     <Route path="/about" element={<About />} />
     <Route path="/new-page" element={<NewPage />} />  {/* New route */}
     <Route path="*" element={<NotFound />} />
   </Routes>
   ```

## Features

### 🎯 Benefits of This Structure

1. **Clean Separation**: Each page is isolated in its own file
2. **Easy Navigation**: Simple Link components for routing
3. **Scalable**: Easy to add new routes
4. **SEO Ready**: Can be enhanced with React Helmet for meta tags
5. **User Experience**: No page reloads, smooth transitions

### 🎨 Styling

Each page has its own CSS file for isolated styling:
- `Home.css` - Landing page styles
- `About.css` - About page styles  
- `NotFound.css` - 404 page styles
- `App.css` - Global/Dashboard styles

### 📱 Responsive Design

All pages are fully responsive and work on:
- Desktop computers
- Tablets
- Mobile phones

## Development

### Running the App

```bash
cd mediapipe-holistic-ui
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

### Testing Routes

Visit these URLs to test each route:
- http://localhost:5173/ → Home page
- http://localhost:5173/dashboard → Analysis dashboard
- http://localhost:5173/about → About page
- http://localhost:5173/invalid-route → 404 page

## Dependencies

- **react-router-dom**: ^6.x.x - Client-side routing library

## Notes

- All routes use **lazy loading** potential for optimization
- The router uses **BrowserRouter** for clean URLs
- 404 page catches all invalid routes with the `*` wildcard
- Navigation is handled by React Router, no full page reloads


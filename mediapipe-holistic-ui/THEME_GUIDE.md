# Theme Design Guide

## Overview

The application now has a **consistent purple gradient theme** throughout all pages, featuring modern glassmorphism design elements.

## Color Palette

### Primary Colors

| Color | Hex Code | RGB | Usage |
|-------|----------|-----|-------|
| Purple (Dark) | `#667eea` | rgb(102, 126, 234) | Gradient start |
| Purple (Light) | `#764ba2` | rgb(118, 75, 162) | Gradient end |
| Green (Success) | `#00ff88` | rgb(0, 255, 136) | Primary buttons, active states |
| Green (Dark) | `#00d4aa` | rgb(0, 212, 170) | Button gradients |
| Red (Stop) | `#ff4757` | rgb(255, 71, 87) | Stop button, errors |
| White | `#ffffff` | rgb(255, 255, 255) | Text, borders |

### Background Gradient

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Applied to: `body` element (covers entire app)

## Design System

### Glassmorphism Effect

All major UI elements use the glassmorphism design pattern:

```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 16px;
```

**Elements using glassmorphism:**
- Header
- Video container
- Timer display
- Export button
- Analysis table container
- Feature cards (on Home page)

### Border Radius

| Element | Radius | Purpose |
|---------|--------|---------|
| Buttons | 12px | Modern, friendly |
| Cards/Containers | 16px | Softer, spacious |
| Small elements | 8px | Subtle rounding |

### Shadows

#### Light Shadow (Subtle depth)
```css
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
```

#### Medium Shadow (Elevated elements)
```css
box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
```

#### Heavy Shadow (Interactive elements)
```css
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

#### Glow Effect (Active/Hover states)
```css
box-shadow: 0 8px 32px rgba(0, 255, 136, 0.4);
```

## Components

### 1. Buttons

#### Start Button (Primary)
- **Background:** Green gradient (`#00ff88` → `#00d4aa`)
- **Hover:** Lift effect (`translateY(-3px)`) + enhanced glow
- **Size:** Padding `14px 32px`, min-width `160px`
- **Border Radius:** 12px

#### Stop Button (Danger)
- **Background:** Red gradient (`#ff4757` → `#ff3742`)
- **Hover:** Lift effect + enhanced red glow
- Same sizing as Start button

#### Export Button (Secondary)
- **Background:** Glassmorphism (`rgba(255, 255, 255, 0.2)`)
- **Border:** 2px white with 50% opacity
- **Disabled State:** Reduced opacity, no hover effects

### 2. Timer Component

#### Inactive State
- **Background:** Glassmorphism with white tint
- **Border:** 2px white (30% opacity)
- **Text Color:** White

#### Active State
- **Background:** Green-tinted glassmorphism (`rgba(0, 255, 136, 0.1)`)
- **Border:** Green (`#00ff88`)
- **Glow:** Green shadow
- **Text:** Green with text shadow

### 3. Video Container

- **Background:** Glassmorphism
- **Border:** 2px white (30% opacity)
- **Border Radius:** 16px
- **Shadow:** Medium depth
- **Max Width:** 400px
- **Height:** 300px

### 4. Analysis Table

#### Table Container
- **Background:** Glassmorphism
- **Border:** 1px white (20% opacity)
- **Border Radius:** 12px

#### Table Header
- **Background:** White tinted (`rgba(255, 255, 255, 0.15)`)
- **Border Bottom:** 1px white (30% opacity)

#### Table Rows
- **Hover:** Brightened background (`rgba(255, 255, 255, 0.15)`)
- **Latest Row:** Green highlight (`rgba(0, 255, 136, 0.15)`)

### 5. Header

- **Background:** Glassmorphism
- **Border Bottom:** 1px white (20% opacity)
- **Padding:** 15px 20px

## Transitions & Animations

### Standard Transition
```css
transition: all 0.3s ease;
```

### Hover Effects

#### Button Hover
1. Background color/gradient shift
2. Shadow enhancement (increased size + opacity)
3. Lift effect (`transform: translateY(-3px)`)

#### Card Hover (Home page)
1. Background brightening
2. Lift effect (`transform: translateY(-10px)`)
3. Enhanced shadow

### Fade In Animation (Page Load)
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

animation: fadeIn 0.8s ease-in;
```

## Page-Specific Styling

### Home Page (`/`)
- Full-height centered layout
- Feature cards in 2x2 grid
- Large title (3.5rem)
- Two-button CTA (Start Analysis + Learn More)

### Dashboard (`/dashboard`)
- Grid layout with 4 rows:
  1. Header (status indicator)
  2. Video canvas
  3. Controls (buttons + timer)
  4. Analysis table (scrollable)
- Transparent background (shows gradient)
- Rounded containers with glassmorphism

### About Page (`/about`)
- Scrollable content
- Glass-morphic content container
- Rounded corners on all sections
- Tech grid for technology stack

### 404 Page (`/error`)
- Centered layout
- Large "404" typography
- Simple CTA button

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

### Font Weights
- **Regular:** 400 (body text)
- **Medium:** 500 (labels, secondary headings)
- **Semibold:** 600 (buttons, table headers, headings)
- **Bold:** 700 (main titles)

### Font Sizes

| Element | Size | Usage |
|---------|------|-------|
| Main Title | 3rem - 3.5rem | Page titles |
| Section Heading | 1.8rem | Section headers |
| Subsection | 1.25rem | Component titles |
| Body | 1rem - 1.05rem | Content text |
| Small | 0.85rem - 0.9rem | Labels, table text |
| Timer Display | 2rem | Monospace timer |

### Special Fonts

#### Timer Display
```css
font-family: 'Courier New', monospace;
letter-spacing: 2px;
```

## Responsive Design

### Breakpoint: 768px

#### Mobile Adjustments
- Font sizes reduced by ~20-30%
- Padding reduced
- Grid changes to single column
- Button sizes reduced slightly
- Timer display smaller

```css
@media (max-width: 768px) {
  .home-title { font-size: 2.5rem; }
  .features-grid { grid-template-columns: 1fr; }
  .timer-display { font-size: 1.5rem; }
}
```

## Consistency Rules

### ✅ Do's

1. **Always use glassmorphism** for major UI elements
2. **Maintain 16px border radius** for containers
3. **Use green (`#00ff88`)** for success/active states
4. **Apply transitions** to all interactive elements
5. **Use backdrop-filter: blur(10px)** for glass effect
6. **Maintain white opacity levels:**
   - Backgrounds: 5-20%
   - Borders: 20-50%
   - Text: 80-100%

### ❌ Don'ts

1. Don't use solid backgrounds (except video/canvas)
2. Don't use sharp corners on containers
3. Don't mix different gradient directions
4. Don't use opaque overlays (keep transparency)
5. Don't skip backdrop-filter on glass elements

## Accessibility

### Contrast Ratios

All text maintains sufficient contrast against backgrounds:
- White text on gradient: ✅ 4.5:1+ ratio
- Green buttons: ✅ High contrast
- Disabled states: Clear visual difference

### Focus States

All interactive elements have clear focus states:
```css
button:focus {
  outline: 2px solid #00ff88;
  outline-offset: 2px;
}
```

## Brand Identity

### Visual Theme
- **Modern & Professional:** Glassmorphism + gradients
- **Tech-Forward:** Purple/blue color scheme
- **Friendly & Approachable:** Rounded corners, smooth transitions
- **Trustworthy:** Consistent design language

### Mood
- Futuristic yet accessible
- Clean and uncluttered
- Engaging and interactive
- Professional for ML/AI application

## Implementation

### Key CSS Files

1. **`index.css`** - Global styles, gradient background
2. **`App.css`** - Dashboard/main app layout
3. **`Home.css`** - Landing page styles
4. **`About.css`** - About page styles
5. **`Timer.css`** - Timer component
6. **`ExportButton.css`** - Export button styling

### Global Background (index.css)
```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
```

All pages automatically inherit this gradient background.

## Future Enhancements

Potential additions while maintaining theme:
- Dark mode toggle (darker purple gradient)
- Custom color themes (different gradients)
- Animation variants for page transitions
- Additional glassmorphic components

---

**Theme Version:** 2.0  
**Last Updated:** October 2025  
**Status:** ✅ Production Ready


# Water Intake Calculator (Arabic)

## Overview

This is a daily water intake calculator web application designed for Arabic-speaking users. The application helps users determine their optimal daily water consumption based on their body weight and activity level. It features a responsive, right-to-left (RTL) interface with Arabic text and provides personalized hydration recommendations to promote health and wellness.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Built as a static web application using vanilla HTML, CSS, and JavaScript
- **RTL Layout**: Designed with right-to-left text direction for Arabic language support
- **Responsive Design**: Mobile-first approach ensuring compatibility across all device sizes
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with interactive features

### UI/UX Design Patterns
- **Component-based Structure**: Modular CSS architecture with reusable components
- **Animation System**: CSS keyframe animations for smooth transitions and visual feedback
- **Form Validation**: Client-side validation with real-time feedback
- **Accessibility**: Semantic HTML structure with proper ARIA labels and keyboard navigation

### Styling Architecture
- **CSS Custom Properties**: Centralized design system using CSS variables for colors, spacing, and transitions
- **BEM Methodology**: Block Element Modifier naming convention for maintainable CSS
- **Mobile-first Responsive**: Breakpoint-based responsive design starting from mobile devices

### JavaScript Architecture
- **Event-driven Programming**: DOM event listeners for user interactions
- **Modular Functions**: Separated concerns with dedicated functions for validation, calculation, and display
- **Progressive Enhancement**: Graceful degradation ensuring basic functionality without JavaScript

### Calculation Logic
- **Weight-based Formula**: Base water intake calculated from body weight
- **Activity Multipliers**: Additional water requirements based on activity level (sedentary, moderate, active)
- **Localized Output**: Results displayed in Arabic with appropriate units and recommendations

## External Dependencies

### Fonts and Typography
- **Google Fonts (Cairo)**: Arabic-optimized font family for improved readability
- **Font Awesome**: Icon library for visual elements and UI enhancement

### Assets and Media
- **SVG Graphics**: Custom water-themed illustrations (water drop, bottle icons)
- **Static Assets**: Image assets stored locally for faster loading and offline capability

### Browser APIs
- **DOM API**: Standard web APIs for element manipulation and event handling
- **Intersection Observer**: For scroll-triggered animations and lazy loading effects
- **Local Storage**: Potential for saving user preferences and calculation history

### Development Dependencies
- **No Build Process**: Direct browser-compatible code without transpilation
- **No Package Manager**: Self-contained application with CDN-based external resources
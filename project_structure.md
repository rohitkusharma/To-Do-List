# Project Structure

This document provides detailed information about the To-Do-List PWA project structure and architecture.

## Directory Structure

```
To-Do-List/
├── index.html              # Main application entry point
├── manifest.webmanifest    # PWA manifest for installability
├── service-worker.js       # Service Worker for offline functionality
├── pwa-diagnostic.js       # PWA installation diagnostic utility
├── LICENSE                 # MIT License file
├── README.md               # Project documentation
├── project_structure.md    # This file - detailed project structure
├── assets/                 # Static assets directory
│   ├── icons/             # App icons and favicons
│   │   ├── favicon.ico    # Standard favicon
│   │   ├── favicon.svg    # SVG favicon (preferred)
│   │   ├── favicon-32x32.png # PNG favicon for compatibility
│   │   ├── icon-192x192.png  # PWA icon (maskable)
│   │   └── icon-512x512.png  # PWA icon (high resolution)
│   └── images/            # App images (currently empty)
├── scripts/               # JavaScript modules
│   ├── app.js            # Main application logic and DOM management
│   ├── taskManager.js    # Task state management and business logic
│   └── utils.js          # Utility functions and helpers
└── styles/               # CSS stylesheets
    ├── style.css        # Custom styles and animations
    └── responsive.css   # Mobile and responsive design styles
```

## Core Files Overview

### HTML Entry Point
- **`index.html`** - Main application page with complete UI structure
  - Includes Tailwind CSS, Lucide icons, and Markdown libraries via CDN
  - Contains the entire app UI (header, task input, filters, task list)
  - Registers service worker and handles PWA installation

### JavaScript Architecture

#### **`scripts/app.js`** - Main Application Controller
- **Purpose**: DOM manipulation, event handling, UI rendering
- **Key Features**:
  - Task rendering with Markdown support
  - Inline editing functionality
  - Markdown toolbar implementation
  - Theme toggle (dark/light mode)
  - PWA installation prompt handling
  - Keyboard shortcuts and accessibility
- **Dependencies**: `TaskManager`, utility functions from `utils.js`

#### **`scripts/taskManager.js`** - State Management
- **Purpose**: Task business logic and data persistence
- **Key Features**:
  - CRUD operations for tasks (Create, Read, Update, Delete)
  - localStorage persistence
  - Task filtering and categorization
  - Priority management
  - Completion tracking and statistics
- **Data Model**: Task objects with id, text, description, completed, priority, category

#### **`scripts/utils.js`** - Utility Functions
- **Purpose**: Reusable helper functions
- **Key Features**:
  - DOM element creation helpers
  - Toast notification system
  - Confetti animations
  - Unique ID generation
  - Common utility functions

### Progressive Web App (PWA) Files

#### **`manifest.webmanifest`** - App Manifest
- **Purpose**: PWA configuration and metadata
- **Contains**:
  - App name, icons, and theme colors
  - Display mode and start URL
  - Icon definitions for different sizes
  - App description and scope

#### **`service-worker.js`** - Offline Support
- **Purpose**: Caching strategy and offline functionality
- **Features**:
  - Static asset caching
  - Network-first strategy for external CDN resources
  - Cache versioning and updates
  - Offline fallback support

#### **`pwa-diagnostic.js`** - Development Tool
- **Purpose**: PWA installation troubleshooting
- **Features**:
  - Manifest validation
  - Service worker registration checking
  - Icon availability testing
  - Installation prompt debugging

### Styling Architecture

#### **`styles/style.css`** - Custom Styles
- **Purpose**: Custom animations, overrides, and enhancements
- **Contains**:
  - Task animations (enter, hover effects)
  - Markdown content styling
  - Custom component styles
  - Dark mode enhancements

#### **`styles/responsive.css`** - Mobile Optimization
- **Purpose**: Mobile-specific styles and responsive design
- **Features**:
  - Mobile layout adjustments
  - Touch-friendly interface elements
  - Responsive grid and flexbox layouts
  - Screen size specific optimizations

## Data Flow

### Task Management Flow
1. **User Input** → Form submission (title, description, priority, category)
2. **TaskManager** → Validates and creates task object
3. **localStorage** → Persists task data automatically
4. **App.js** → Re-renders UI with new task
5. **DOM** → Updates visual representation

### State Persistence
- **Storage**: localStorage with key `'todolist-data'`
- **Format**: JSON object containing tasks array and completed count
- **Backup**: Automatic save on every state change
- **Recovery**: Automatic load on page refresh/app startup

### Event Handling
- **Keyboard Shortcuts**: Enter (add), Escape (cancel), Ctrl+Enter (submit from textarea)
- **Mouse/Touch**: Click handlers for buttons, checkboxes, and interactive elements
- **Filtering**: Real-time filtering by status (all/active/completed) and category

## Third-Party Dependencies

### CDN Libraries
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide Icons**: Consistent icon library for UI elements
- **Marked.js**: Markdown parsing for rich text descriptions
- **DOMPurify**: XSS protection for sanitizing HTML output

### Why CDN?
- **Performance**: Faster loading from global CDNs
- **Caching**: Browser cache benefits across sites
- **Simplicity**: No build process required
- **Reliability**: Fallback handling in service worker

## Development Guidelines

### Adding New Features
1. **State Changes**: Update `TaskManager` class methods
2. **UI Updates**: Modify rendering functions in `app.js`
3. **Styling**: Add styles to appropriate CSS files
4. **Persistence**: Ensure localStorage sync in TaskManager
5. **PWA**: Update service worker cache when adding assets

### Code Organization Principles
- **Separation of Concerns**: UI logic separate from business logic
- **Modularity**: ES6 modules for clear dependencies
- **Persistence**: Automatic data saving on state changes
- **Progressive Enhancement**: Works without JavaScript, enhanced with it
- **Accessibility**: Semantic HTML and keyboard navigation

### Performance Considerations
- **Lazy Loading**: Icons rendered only when needed
- **Efficient Rendering**: Minimal DOM manipulation
- **Cache Strategy**: Aggressive caching for offline performance
- **Bundle Size**: No bundling needed, direct ES6 modules

## Testing Strategy

### Manual Testing Checklist
- [ ] Task CRUD operations (Create, Read, Update, Delete)
- [ ] Data persistence across page reloads
- [ ] PWA installation and offline functionality
- [ ] Responsive design on mobile devices
- [ ] Keyboard navigation and accessibility
- [ ] Dark/light mode toggle
- [ ] Markdown rendering and toolbar functionality

### Browser Support
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (ES6+ support required)
- **PWA Support**: Chrome, Edge, Safari (with limitations)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet

## Future Enhancements

### Potential Features
- **Data Export/Import**: JSON backup and restore
- **Task Sharing**: URL-based task sharing
- **Advanced Filtering**: Date-based filters, search
- **Drag & Drop**: Task reordering
- **Bulk Operations**: Multi-select and bulk edit
- **Categories**: Enhanced category management
- **Themes**: Additional color schemes

### Architecture Improvements
- **TypeScript**: Type safety for larger codebase
- **Testing**: Unit tests for core functionality
- **Build Process**: Bundling and optimization
- **API Integration**: Backend synchronization option
- **IndexedDB**: Enhanced storage for large datasets

## Troubleshooting

### Common Issues
1. **PWA Not Installing**: Check console logs from `pwa-diagnostic.js`
2. **Data Loss**: localStorage quota exceeded or privacy mode
3. **Offline Issues**: Service worker registration failed
4. **Styling Problems**: Tailwind CSS CDN not loaded
5. **Icons Missing**: Lucide library loading issues

### Debug Tools
- **Browser DevTools**: Application tab for PWA inspection
- **Console Logs**: Diagnostic messages from `pwa-diagnostic.js`
- **Network Tab**: CDN resource loading status
- **localStorage Inspector**: Data persistence verification
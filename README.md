# To-Do-List — Progressive Web App

A modern, feature-rich task tracker built as a Progressive Web App (PWA) with HTML, Tailwind CSS, and vanilla JavaScript. This single-session app includes advanced features like Markdown support, dark mode, and offline capabilities while maintaining simplicity and performance.

## ✨ Features

### Core Task Management
- ✅ Add, edit, delete tasks with inline editing
- 📝 Rich task descriptions with **Markdown support** (bold, italic, links, lists, code, etc.)
- 🎯 Priority levels (Low, Normal, High) with visual indicators
- 🏷️ Category organization and filtering
- ✔️ Toggle completion with visual feedback and celebrations
- 📊 Real-time task statistics and completion counter

### User Experience
- 🌓 **Dark/Light mode toggle** (per-session preference)
- 🎉 Toast notifications and confetti animations on task completion
- ⌨️ **Full keyboard support**:
  - `Enter` to add tasks from title/category inputs
  - `Ctrl+Enter` to add from description field
  - `Esc` to cancel operations
  - Arrow keys and tab navigation
- 📱 **Responsive design** - works on desktop and mobile
- 🎨 **Rich Markdown toolbar** with icons for formatting (bold, italic, links, lists, code blocks, tables, etc.)

### Filtering & Organization
- 📋 Filter by status: All, Active, Completed
- 🏷️ Filter by category with dynamic category list
- 🗑️ Bulk "Clear Completed" action
- 📈 Live task statistics in footer

### Progressive Web App (PWA)
- 📱 **Installable** - Add to home screen on mobile/desktop
- ⚡ **Offline capable** with service worker caching
- 🔄 Background sync and updates
- 🎯 **App-like experience** with standalone display mode
- 📦 Optimized caching for instant loading

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, ES6+ Modules
- **Styling**: Tailwind CSS (CDN) with custom brand colors
- **Icons**: Lucide Icons (CDN)
- **Markdown**: Marked.js + DOMPurify for safe rendering
- **PWA**: Web App Manifest + Service Worker
- **No frameworks** - Pure vanilla JavaScript for maximum performance

## 🚀 Quick Start

### Option 1: Simple File Opening
```bash
# Just open index.html in your browser
open index.html  # macOS
start index.html # Windows
```

### Option 2: Local Server (Recommended for PWA features)
```bash
# Navigate to project directory
cd To-Do-List

# Python 3 (recommended)
python -m http.server 8080

# Node.js alternative
npx serve -l 8080

# PHP alternative  
php -S localhost:8080
```

Then visit **http://localhost:8080**

> **PWA Note**: For full PWA functionality (installation, offline support), serve over localhost or HTTPS.

## 📱 Installing as PWA

1. **Serve the app** over localhost (see Quick Start above)
2. **Open in Chrome/Edge**: Visit http://localhost:8080
3. **Interact with the app**: Add a few tasks, try different features
4. **Look for Install button**: Should appear in the header after ~30 seconds
5. **Alternative**: Click browser's "Install" icon in address bar

### PWA Installation Checklist
- ✅ Served over HTTPS or localhost
- ✅ Valid Web App Manifest
- ✅ Service Worker registered
- ✅ Required icons (192x192, 512x512)
- ✅ User engagement detected

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Add task | `Enter` (from title/category fields) |
| Add with description | `Ctrl+Enter` (from description field) |
| Cancel operation | `Esc` |
| New line in description | `Enter` (in description field) |
| Toggle dark mode | Click moon/sun icon |

## 🎨 Markdown Support

The description field supports rich Markdown formatting:

- **Bold** and *italic* text
- [Links](https://example.com) and images
- `inline code` and code blocks
- Lists (bulleted and numbered)
- > Blockquotes
- Tables and horizontal rules
- ~~Strikethrough~~ text
- Emoji support 😊

Use the toolbar icons for quick formatting assistance.

## 📁 Project Structure

```
To-Do-List/
├── index.html              # Main app page
├── manifest.webmanifest    # PWA manifest
├── service-worker.js       # SW for offline support
├── pwa-diagnostic.js       # PWA troubleshooting
├── styles/
│   ├── style.css          # Custom animations & overrides
│   └── responsive.css     # Mobile-specific styles
├── scripts/
│   ├── app.js            # Main app logic & UI
│   ├── taskManager.js    # State management
│   └── utils.js          # Helper functions
└── assets/
    └── icons/            # App icons & favicon
```

## 🎯 Design Philosophy

- **Single-session by design** - No persistence beyond current tab
- **Privacy-first** - No data collection or external services  
- **Performance-focused** - Minimal dependencies, optimized loading
- **Accessibility** - Semantic HTML, keyboard navigation, screen reader friendly
- **Progressive Enhancement** - Works without JavaScript, enhanced with it

## 🔧 Development

### Adding New Features
1. **State changes**: Update `scripts/taskManager.js`
2. **UI updates**: Modify `scripts/app.js` 
3. **Styling**: Add to `styles/style.css` or use Tailwind classes
4. **PWA assets**: Update `service-worker.js` cache list

### Cache Versioning
When updating assets, increment the cache version in `service-worker.js`:
```javascript
const CACHE = 'task-manager-cache-v4'; // Increment this
```

## 🐛 Troubleshooting

### PWA Install Prompt Not Appearing?
1. **Check console** for diagnostic messages (pwa-diagnostic.js)
2. **Verify serving** over localhost or HTTPS
3. **User engagement** required - interact with app first
4. **DevTools**: Check Application → Manifest and Service Worker tabs
5. **Clear cache** and try again

### Favicon Not Showing?
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser cache settings
- Verify files exist in `assets/icons/`

## 📄 License

MIT License - Feel free to use, modify, and distribute.

## 🤝 Contributing

This is a demonstration project, but improvements are welcome! Focus on:
- Performance optimizations
- Accessibility enhancements  
- PWA feature improvements
- Mobile UX refinements

---

*Built with ❤️ as a modern take on the classic to-do app*

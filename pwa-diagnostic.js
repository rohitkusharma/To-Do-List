// PWA Installation Diagnostic Script
console.log('=== PWA Installation Diagnostic ===');

// Check if we're on localhost or HTTPS
console.log('Origin:', window.location.origin);
console.log('Protocol:', window.location.protocol);
console.log('Is secure context:', window.isSecureContext);

// Check service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(registration => {
    console.log('Service Worker registered and ready:', registration);
  }).catch(err => {
    console.error('Service Worker registration failed:', err);
  });
} else {
  console.error('Service Worker not supported');
}

// Check manifest
fetch('./manifest.webmanifest')
  .then(response => response.json())
  .then(manifest => {
    console.log('Manifest loaded successfully:', manifest);
    
    // Check required fields
    const required = ['name', 'start_url', 'display', 'icons'];
    required.forEach(field => {
      if (manifest[field]) {
        console.log(`✓ ${field}:`, manifest[field]);
      } else {
        console.error(`✗ Missing required field: ${field}`);
      }
    });
    
    // Check icons
    if (manifest.icons && manifest.icons.length > 0) {
      console.log('Checking icon availability...');
      manifest.icons.forEach((icon, index) => {
        const img = new Image();
        img.onload = () => console.log(`✓ Icon ${index} (${icon.sizes}) loaded successfully:`, icon.src);
        img.onerror = () => console.error(`✗ Icon ${index} failed to load:`, icon.src);
        img.src = icon.src;
      });
    }
  })
  .catch(err => {
    console.error('Failed to load manifest:', err);
  });

// Check install prompt availability
let installPromptFired = false;
window.addEventListener('beforeinstallprompt', (e) => {
  installPromptFired = true;
  console.log('✓ beforeinstallprompt event fired - PWA is installable!');
});

// Check after a delay if prompt fired
setTimeout(() => {
  if (!installPromptFired) {
    console.log('⚠️ beforeinstallprompt has not fired yet');
    console.log('This could mean:');
    console.log('1. PWA criteria not met');
    console.log('2. Already installed');
    console.log('3. User has dismissed install prompt multiple times');
    console.log('4. Browser doesn\'t support PWA installation');
  }
}, 2000);

// Check if already installed
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('✓ PWA is already installed and running in standalone mode');
}
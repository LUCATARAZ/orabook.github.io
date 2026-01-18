// FORCE UPDATE FOR GITHUB PAGES
const FORCE_VERSION = '20240119.3';
const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

console.log(`🔄 GitHub Pages Force Update v${FORCE_VERSION}`);
console.log(`📱 Mobile: ${IS_MOBILE}`);

// Clear caches
if ('caches' in window) {
    caches.keys().then(function(names) {
        names.forEach(function(name) {
            caches.delete(name);
        });
    });
}

// Force reload on mobile
if (IS_MOBILE) {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    // Add cache busting parameters
    params.set('v', FORCE_VERSION);
    params.set('t', Date.now());
    params.set('mobile', 'force');
    params.set('cache', 'bust');
    
    // Only redirect if parameters changed
    if (url.toString() !== window.location.href) {
        setTimeout(() => {
            window.location.replace(url.toString());
        }, 100);
    }
}

// Prevent back/forward cache
window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// GitHub Pages Mobile Cache Buster v2
console.log('🚀 GitHub Pages Cache System v2 - Loading...');

(function() {
    const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const IS_GITHUB = window.location.hostname.includes('github.io');
    
    // Check if this is a GitHub Pages build
    fetch('/version.txt')
        .then(response => response.text())
        .then(versionText => {
            console.log('📄 Version file:', versionText);
            
            // Extract BUILD_ID
            const buildMatch = versionText.match(/BUILD_ID=(\d+)/);
            const buildId = buildMatch ? buildMatch[1] : 'unknown';
            
            // Store build ID
            const lastBuildId = localStorage.getItem('github_pages_build_id');
            
            if (IS_GITHUB && IS_MOBILE) {
                console.log(`📱 GitHub Pages Mobile - Build: ${buildId}, Last: ${lastBuildId}`);
                
                // Force refresh if build changed or no cache params
                const url = new URL(window.location.href);
                const params = url.searchParams;
                
                if (lastBuildId !== buildId || !params.has('gh_build')) {
                    console.log('🔄 Build changed or no cache params - forcing refresh');
                    
                    // Update localStorage
                    localStorage.setItem('github_pages_build_id', buildId);
                    localStorage.setItem('last_mobile_refresh', Date.now().toString());
                    
                    // Add cache busting params
                    params.set('gh_build', buildId);
                    params.set('t', Date.now());
                    params.set('mobile', 'force');
                    params.set('github', 'pages');
                    
                    // Clear all caches
                    if ('caches' in window) {
                        caches.keys().then(cacheNames => {
                            cacheNames.forEach(cacheName => {
                                caches.delete(cacheName);
                            });
                        });
                    }
                    
                    // Force redirect (replace, not push)
                    setTimeout(() => {
                        window.location.replace(url.toString());
                    }, 300);
                } else {
                    console.log('✅ Already on latest build');
                }
            }
        })
        .catch(error => {
            console.log('⚠️ Cannot read version.txt:', error);
            // Fallback: add timestamp if mobile
            if (IS_GITHUB && IS_MOBILE) {
                const url = new URL(window.location.href);
                const params = url.searchParams;
                
                if (!params.has('t')) {
                    params.set('t', Date.now());
                    params.set('mobile_fallback', 'true');
                    setTimeout(() => {
                        window.location.replace(url.toString());
                    }, 100);
                }
            }
        });
    
    // Listen for pageshow event (back/forward cache)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            console.log('🔄 Page restored from bfcache - forcing reload');
            window.location.reload();
        }
    });
    
    // Clear service workers if any
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            registrations.forEach(function(registration) {
                registration.unregister();
                console.log('🗑️ Unregistered service worker');
            });
        });
    }
})();

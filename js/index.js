/**
 * 🎯 MAIN JAVASCRIPT INDEX
 * Central entry point that loads all modular JS files
 * This file coordinates all JavaScript functionality
 */

console.log('[Portfolio] JavaScript modules loading...');

// Modules are loaded via script tags in HTML
// See index.html for <script> tag order:
// 1. js/01-cursor.js - Cursor effects and particle trails
// 2. js/02-navigation.js - Navigation, smooth scroll, active tracking
// 3. js/03-contact-form.js - Contact form handling
// 4. js/04-scroll-animations.js - Intersection observer and project filtering

// Global initialization function
function initializePortfolio() {
  console.log('[Portfolio] Initializing all modules...');
  
  // Wait for all modules to be loaded and DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupGlobalEventListeners();
    });
  } else {
    setupGlobalEventListeners();
  }
}

function setupGlobalEventListeners() {
  // Global scroll tracking
  window.addEventListener('scroll', () => {
    updateScrollPosition();
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    updateViewportDimensions();
  });

  // Prevent body scroll while loading
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    const hideLoadingScreen = () => {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.pointerEvents = 'none';
      document.body.style.overflow = 'auto';
    };

    // Hide after 3 seconds or when content is loaded
    setTimeout(hideLoadingScreen, 3000);
    window.addEventListener('load', hideLoadingScreen);
  }
}

// Utility functions
function updateScrollPosition() {
  const scrollY = window.scrollY;
  document.documentElement.style.setProperty('--scroll-position', scrollY + 'px');
}

function updateViewportDimensions() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  document.documentElement.style.setProperty('--viewport-width', width + 'px');
  document.documentElement.style.setProperty('--viewport-height', height + 'px');
}

// Initialize on DOM load
initializePortfolio();

console.log('[Portfolio] Initialization complete!');

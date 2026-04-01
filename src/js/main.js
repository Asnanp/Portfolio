/**
 * Main Application Entry Point
 * Portfolio Website — Advanced Scroll Edition
 */

// Import styles
import '../styles/global.css';
import '../styles/loading.css';
import '../styles/navigation.css';
import '../styles/home.css';
import '../styles/projects.css';
import '../styles/contact.css';
import '../styles/scroll-animations.css';

// Import modules
import { initLoadingScreen } from './loading.js';
import { initNavbar } from './navbar.js';
import { initCursor } from './cursor.js';
import { initModelViewer } from './modelViewer.js';
import { initAnimations } from './animations.js';
import { initScrollEngine, scrollToSection } from './scrollEngine.js';
import { initTextEffects } from './textEffects.js';
import { initMagneticElements, initMagneticCursor, initClickRipple } from './magneticElements.js';

/**
 * Initialize all application modules
 */
async function initApp() {
  try {
    // Show loading screen
    const loadingScreen = initLoadingScreen();

    // Wait for DOM to be ready
    await waitForDOMReady();

    // Phase 1: Text effects (split text before scroll engine reads them)
    initTextEffects();

    // Phase 2: Core modules
    initNavbar();
    initCursor();
    initAnimations();

    // Phase 3: Scroll engine (GSAP + Lenis — must be after text splitting)
    initScrollEngine();

    // Phase 4: Interactive effects
    initMagneticElements();
    initMagneticCursor();
    initClickRipple();

    // Phase 5: 3D model viewer
    await initModelViewer();

    // Phase 6: Wire up nav links to use Lenis smooth scroll
    wireNavigation();

    // Hide loading screen when everything is ready
    loadingScreen.hide();

    console.log('🚀 Application initialized successfully!');

  } catch (error) {
    console.error('Failed to initialize application:', error);
    // Still try to hide loading screen on error
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => { loadingScreen.style.display = 'none'; }, 800);
    }
  }
}

/**
 * Wire navigation links to use Lenis smooth scroll
 */
function wireNavigation() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      if (target && target !== '#') {
        scrollToSection(target);
      }
    });
  });

  // Get in touch button
  const getInTouchBtn = document.querySelector('.get');
  if (getInTouchBtn) {
    getInTouchBtn.addEventListener('click', () => {
      scrollToSection('#contact');
    });
  }
}

/**
 * Wait for DOM to be fully loaded
 * @returns {Promise}
 */
function waitForDOMReady() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve);
    }
  });
}

/**
 * Loading Screen Controller
 */
class LoadingScreenController {
  constructor() {
    this.screen = document.querySelector('.loading-screen');
    this.progressBar = document.querySelector('.progress-bar');
    this.stages = document.querySelectorAll('.stage');
    this.currentStage = 0;
  }

  updateProgress(progress) {
    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
    }
  }

  updateStage(stageIndex) {
    this.stages.forEach((stage, index) => {
      if (index <= stageIndex) {
        stage.classList.add('active');
      } else {
        stage.classList.remove('active');
      }
    });
  }

  hide() {
    if (this.screen) {
      this.screen.style.opacity = '0';
      setTimeout(() => {
        this.screen.style.display = 'none';
      }, 800);
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for use in other modules
export { LoadingScreenController };

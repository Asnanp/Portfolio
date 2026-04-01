/**
 * Loading Screen Module
 * Handles the quantum loading animation
 */

/**
 * Initialize loading screen
 * @returns {LoadingScreenController} Controller for managing loading state
 */
export function initLoadingScreen() {
  const screen = document.querySelector('.loading-screen');
  const progressBar = document.querySelector('.progress-bar');
  const stages = document.querySelectorAll('.stage');
  
  if (!screen) {
    console.warn('Loading screen element not found');
    return createMockController();
  }
  
  let progress = 0;
  let currentStage = 0;
  
  /**
   * Update progress bar
   * @param {number} value - Progress percentage (0-100)
   */
  function updateProgress(value) {
    progress = Math.min(100, Math.max(0, value));
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  }
  
  /**
   * Update loading stage
   * @param {number} stage - Stage index (0-4)
   */
  function updateStage(stage) {
    currentStage = Math.min(stages.length - 1, Math.max(0, stage));
    stages.forEach((s, index) => {
      s.classList.toggle('active', index <= currentStage);
    });
  }
  
  /**
   * Simulate loading progress
   */
  function simulateLoading() {
    const stages_data = [
      { progress: 20, stage: 0 },
      { progress: 40, stage: 1 },
      { progress: 60, stage: 2 },
      { progress: 80, stage: 3 },
      { progress: 100, stage: 4 }
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (index >= stages_data.length) {
        clearInterval(interval);
        return;
      }
      
      const data = stages_data[index];
      updateProgress(data.progress);
      updateStage(data.stage);
      index++;
    }, 500);
  }
  
  /**
   * Hide loading screen
   */
  function hide() {
    screen.style.opacity = '0';
    screen.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => {
      screen.style.display = 'none';
    }, 800);
  }
  
  // Start simulation
  simulateLoading();
  
  return {
    updateProgress,
    updateStage,
    hide,
    getProgress: () => progress,
    getStage: () => currentStage
  };
}

/**
 * Create mock controller if loading screen doesn't exist
 */
function createMockController() {
  return {
    updateProgress: () => {},
    updateStage: () => {},
    hide: () => {},
    getProgress: () => 100,
    getStage: () => 4
  };
}

/**
 * Create loading screen HTML dynamically if needed
 */
export function createLoadingScreen() {
  const loadingHTML = `
    <div class="loading-screen">
      <div class="loading-container">
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-core"></div>
        </div>
        <div class="loading-text">AsnanP Portfolio</div>
        <div class="loading-progress">
          <div class="progress-bar"></div>
          <div class="progress-glow"></div>
        </div>
        <div class="loading-stages">
          <div class="stage active" id="stage-0">
            <div class="stage-icon">🚀</div>
            <span>Loading</span>
          </div>
          <div class="stage" id="stage-1">
            <div class="stage-icon">🎨</div>
            <span>Assets</span>
          </div>
          <div class="stage" id="stage-2">
            <div class="stage-icon">🎯</div>
            <span>3D Models</span>
          </div>
          <div class="stage" id="stage-3">
            <div class="stage-icon">⚡</div>
            <span>Optimizing</span>
          </div>
          <div class="stage" id="stage-4">
            <div class="stage-icon">✨</div>
            <span>Ready</span>
          </div>
        </div>
        <div class="loading-tips">
          <div class="tip-text">Loading optimized experience...</div>
          <div class="tip-progress"></div>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', loadingHTML);
  return initLoadingScreen();
}

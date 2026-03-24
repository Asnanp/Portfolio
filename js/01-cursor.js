/**
 * 🎯 ULTRA SMOOTH CURSOR EFFECTS
 * Advanced custom cursor with trail, particles, and audio feedback
 */

class UltraSmoothCursor {
  constructor() {
    this.cursor = document.getElementById('cursor');
    this.mouse = { x: 0, y: 0 };
    this.pos = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.trail = [];
    this.isActive = false;
    this.audioEnabled = true;
    this.ease = 0.12;
    this.friction = 0.85;
    this.force = 0.3;
    this.performanceMode = this.detectPerformanceMode();
    this.init();
  }

  detectPerformanceMode() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    const isSlowNetwork = navigator.connection && 
      (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g');
    const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    return {
      reducedEffects: isMobile || hasReducedMotion || isLowEnd || isSlowNetwork || hasLowMemory,
      maxParticles: isMobile ? 3 : (isLowEnd ? 8 : 15),
      trailLength: isMobile ? 2 : (isLowEnd ? 4 : 8),
      enableComplexEffects: !isMobile && !isLowEnd && !hasReducedMotion && !isSlowNetwork,
      frameThrottle: isMobile ? 3 : 1,
      touchOptimized: 'ontouchstart' in window
    };
  }

  init() {
    if (this.cursor) {
      this.cursor.style.opacity = '1';
      console.log('[Cursor] Initialized');
    }
    
    this.bindEvents();
    this.update();
    this.setupAudioToggle();
  }

  bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.isActive = true;
      
      if (this.pos.x === 0 && this.pos.y === 0) {
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;
      }
      
      this.createTrail(e.clientX, e.clientY);
      if (Math.random() < 0.15) {
        this.createParticles(e.clientX, e.clientY);
      }
    });

    document.addEventListener('mouseleave', () => {
      this.isActive = false;
    });

    document.addEventListener('mouseenter', () => {
      this.isActive = true;
    });

    this.setupHoverEffects();
    this.setupClickEffects();
  }

  update() {
    if (this.isActive && this.cursor) {
      const dx = this.mouse.x - this.pos.x;
      const dy = this.mouse.y - this.pos.y;
      this.velocity.x += dx * this.force;
      this.velocity.y += dy * this.force;
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;
      this.pos.x += this.velocity.x * this.ease;
      this.pos.y += this.velocity.y * this.ease;
      
      this.cursor.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
    }
    requestAnimationFrame(() => this.update());
  }

  createTrail(x, y) {
    if (this.performanceMode.reducedEffects || this.trail.length > this.performanceMode.trailLength) return;
    
    const trails = ['dot', 'particle'];
    const trailType = trails[Math.floor(Math.random() * trails.length)];
    const trail = document.createElement('div');
    trail.className = `cursor-trail trail-${trailType}`;
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    const colors = this.getCurrentColors();
    trail.style.setProperty('--trail-color', colors[Math.floor(Math.random() * colors.length)]);
    
    document.body.appendChild(trail);
    this.trail.push(trail);
    
    const duration = trailType === 'dot' ? 1200 : 800;
    setTimeout(() => {
      if (trail.parentNode) trail.remove();
      const index = this.trail.indexOf(trail);
      if (index > -1) this.trail.splice(index, 1);
    }, duration);
  }

  createParticles(x, y) {
    if (this.performanceMode.reducedEffects) return;
    
    const particleTypes = ['explosion', 'magnetic', 'spiral'];
    const type = particleTypes[Math.floor(Math.random() * particleTypes.length)];
    const count = Math.min(this.performanceMode.maxParticles, 
      window.innerWidth < 768 ? 2 : (type === 'spiral' ? 3 : Math.floor(Math.random() * 4) + 2));

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = `cursor-particle particle-${type}`;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        const size = Math.random() * 8 + 3;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        const colors = this.getCurrentColors();
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        if (type === 'explosion') {
          const angle = (Math.PI * 2 * i) / count;
          const velocity = Math.random() * 150 + 80;
          particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
          particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
        } else if (type === 'magnetic') {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 100 + 50;
          particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
          particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        } else if (type === 'spiral') {
          particle.style.setProperty('--spiral-radius', (Math.random() * 80 + 40) + 'px');
        }

        document.body.appendChild(particle);
        const duration = type === 'spiral' ? 3000 : type === 'magnetic' ? 2000 : 1500;
        setTimeout(() => particle.remove(), duration);
      }, i * (type === 'spiral' ? 200 : 50));
    }
  }

  getCurrentColors() {
    const cursorState = this.cursor.className;
    if (cursorState.includes('hover-button')) {
      return ['#ff6b6b', '#ff8e8e'];
    } else if (cursorState.includes('hover-image')) {
      return ['#00ffff', '#00ff88'];
    }
    return ['#ffffff', '#ff00ff', '#00ffff'];
  }

  setupHoverEffects() {
    const elements = document.querySelectorAll('[data-cursor]');
    elements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        const cursorType = element.getAttribute('data-cursor');
        this.cursor.className = `cursor hover-${cursorType}`;
        
        if (cursorType === 'button') {
          this.playHoverSound('button');
          this.createHoverBurst(element);
        } else if (cursorType === 'image') {
          this.playHoverSound('image');
          this.createMagneticField(element);
        } else if (cursorType === 'special') {
          this.playHoverSound('special');
        }
      });

      element.addEventListener('mouseleave', () => {
        this.cursor.className = 'cursor';
      });

      element.addEventListener('mousemove', (e) => {
        if (element.getAttribute('data-cursor') === 'special') {
          this.createContinuousParticles(e.clientX, e.clientY);
        }
      });
    });
  }

  setupClickEffects() {
    document.addEventListener('click', (e) => {
      this.createClickRipple(e.clientX, e.clientY);
      this.createClickBurst(e.clientX, e.clientY);
      this.playClickSound();
    });

    document.addEventListener('mousedown', () => {
      this.cursor.style.transform = 'scale(0.9)';
    });

    document.addEventListener('mouseup', () => {
      this.cursor.style.transform = 'scale(1)';
    });
  }

  createHoverBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'cursor-particle particle-magnetic';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.background = 'rgba(255, 255, 255, 0.9)';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.boxShadow = '0 0 10px rgba(255,255,255,0.8)';

        const angle = (Math.PI * 2 * i) / 12;
        const distance = 60;
        particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
        particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
      }, i * 30);
    }
  }

  createMagneticField(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const field = document.createElement('div');
        field.style.position = 'fixed';
        field.style.left = centerX + 'px';
        field.style.top = centerY + 'px';
        field.style.width = '2px';
        field.style.height = '2px';
        field.style.background = 'rgba(241,196,15,0.7)';
        field.style.borderRadius = '50%';
        field.style.pointerEvents = 'none';
        field.style.zIndex = '9997';
        field.style.animation = 'particleSpiral 4s linear forwards';
        field.style.setProperty('--spiral-radius', (Math.random() * 120 + 60) + 'px');
        document.body.appendChild(field);
        setTimeout(() => field.remove(), 4000);
      }, i * 100);
    }
  }

  createContinuousParticles(x, y) {
    if (Math.random() < 0.3) {
      const particle = document.createElement('div');
      particle.className = 'cursor-particle particle-explosion';
      particle.style.left = x + (Math.random() - 0.5) * 20 + 'px';
      particle.style.top = y + (Math.random() - 0.5) * 20 + 'px';
      particle.style.width = '3px';
      particle.style.height = '3px';
      particle.style.background = `hsl(${Math.random() * 360}, 80%, 70%)`;

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 40 + 20;
      particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
      particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1500);
    }
  }

  createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '0';
    ripple.style.height = '0';
    ripple.style.border = '3px solid rgba(255,255,255,0.8)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9997';
    document.body.appendChild(ripple);

    ripple.animate([
      { width: '0', height: '0', opacity: 1, borderWidth: '3px' },
      { width: '200px', height: '200px', opacity: 0, borderWidth: '0px' }
    ], {
      duration: 800,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => ripple.remove();
  }

  createClickBurst(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#9b59b6', '#f39c12', '#e91e63'];
    for (let i = 0; i < 16; i++) {
      const particle = document.createElement('div');
      particle.className = 'cursor-particle particle-explosion';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.width = Math.random() * 6 + 4 + 'px';
      particle.style.height = particle.style.width;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = `0 0 10px ${colors[Math.floor(Math.random() * colors.length)]}`;

      const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.5;
      const velocity = Math.random() * 120 + 80;
      particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
      particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1500);
    }
  }

  playHoverSound(type) {
    if (!this.audioEnabled || !window.AudioContext && !window.webkitAudioContext) return;
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const frequencies = {
      'button': [440, 660],
      'image': [550, 880],
      'text': [330, 495],
      'hover': [440, 660],
      'special': [660, 880, 1100]
    };

    const freqs = frequencies[type] || [440];
    freqs.forEach((freq, index) => {
      setTimeout(() => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        oscillator.type = type === 'special' ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
      }, index * 100);
    });
  }

  playClickSound() {
    if (!this.audioEnabled || !window.AudioContext && !window.webkitAudioContext) return;
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  setupAudioToggle() {
    const audioToggle = document.querySelector('.floating-audio-toggle');
    if (audioToggle) {
      audioToggle.addEventListener('click', () => {
        this.audioEnabled = !this.audioEnabled;
        audioToggle.classList.toggle('muted', !this.audioEnabled);
        audioToggle.setAttribute('aria-pressed', this.audioEnabled.toString());
        
        const hex = audioToggle.querySelector('.audio-toggle-hex');
        if (hex) {
          setTimeout(() => {
            hex.style.transform = '';
          }, 200);
        }
        
        if (this.audioEnabled && this.audioContext) {
          this.playToggleSound('button');
        }
      });
    }
  }

  playToggleSound(type) {
    // Same as playHoverSound for consistency
    this.playHoverSound(type);
  }
}

// Initialize cursor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.ultraCursor = new UltraSmoothCursor();
});

/**
 * Animations Module
 * Handles typewriter, audio toggle, scroll indicator, and GSAP-enhanced parallax
 * (Heavy scroll animations moved to scrollEngine.js)
 */
import gsap from 'gsap';

/**
 * Initialize all animations
 */
export function initAnimations() {
  initAudioToggle();
  initBackToTop();
  initScrollIndicator();
  initTypewriter();
  initFloatingOrbsParallax();
  initNavScrollEffect();
  initHoverTiltEffect();

  console.log('✅ Animations initialized');
}

/**
 * Initialize audio toggle functionality
 */
function initAudioToggle() {
  const audioToggle = document.getElementById('audioToggle');
  if (!audioToggle) return;

  let isMuted = false;

  audioToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    audioToggle.setAttribute('aria-pressed', !isMuted);
    window.dispatchEvent(new CustomEvent('audioToggle', { detail: { muted: isMuted } }));
  });
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top-enhanced');
  if (!backToTop) return;

  function toggleBackToTop() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    const scrollProgress = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  backToTop.addEventListener('click', scrollToTop);
  toggleBackToTop();
}

/**
 * Initialize scroll indicator
 */
function initScrollIndicator() {
  const scrollIndicator = document.querySelector('.professional-scroll-indicator');
  if (!scrollIndicator) return;

  scrollIndicator.addEventListener('click', () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Hide scroll indicator after scrolling past hero
  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.3) {
      gsap.to(scrollIndicator, { opacity: 0, y: 20, duration: 0.4, ease: 'power2.in' });
    } else {
      gsap.to(scrollIndicator, { opacity: 0.7, y: 0, duration: 0.4, ease: 'power2.out' });
    }
  }, { passive: true });
}

/**
 * Initialize typewriter effect
 */
function initTypewriter() {
  const typewriterText = document.getElementById('typewriterText');
  if (!typewriterText) return;

  const texts = [
    'creating beautiful user experiences.',
    'building AI-powered solutions.',
    'exploring machine learning.',
    'crafting innovative projects.',
    'pushing boundaries in deep learning.',
  ];

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentText = texts[textIndex];

    if (isDeleting) {
      typewriterText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentText.length) {
      typingSpeed = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1500);
}

/**
 * GSAP-powered floating orbs parallax (replaces basic scroll listener)
 */
function initFloatingOrbsParallax() {
  const orbs = document.querySelectorAll('.floating-orb');
  if (!orbs.length) return;

  // Mouse-based parallax for orbs
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateOrbs() {
    orbs.forEach((orb, index) => {
      const speed = 15 + index * 10;
      const x = mouseX * speed;
      const y = mouseY * speed;

      gsap.to(orb, {
        x: x,
        y: y,
        duration: 1.5 + index * 0.5,
        ease: 'power2.out',
      });
    });

    requestAnimationFrame(animateOrbs);
  }

  animateOrbs();
}

/**
 * Navbar scroll effect — shrink and add shadow on scroll
 */
function initNavScrollEffect() {
  const navbar = document.querySelector('.ultra-navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * Enhanced card tilt effect with GSAP
 */
function initHoverTiltEffect() {
  const cards = document.querySelectorAll('.holo-card, .project-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 8;
      const rotateY = ((centerX - x) / centerX) * 8;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
      });
    });
  });
}

/**
 * Smooth scroll to section
 * @param {string} targetId - Target section ID
 */
export function smoothScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

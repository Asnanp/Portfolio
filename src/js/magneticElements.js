/**
 * Magnetic Elements Module
 * Interactive magnetic pull effect for buttons and links
 */
import gsap from 'gsap';

/**
 * Initialize magnetic effect on interactive elements
 */
export function initMagneticElements() {
  // Check for touch device — no magnetic on touch
  if (!window.matchMedia('(hover: hover)').matches) return;

  const magneticSelectors = [
    '.neo-btn',
    '.get',
    '.submit-btn',
    '.download-btn',
    '.social-btn',
    '.ultra-nav-link',
    '.tech-tag',
    '.action-btn',
    '.floating-audio-toggle',
    '.logo',
  ];

  const selector = magneticSelectors.join(', ');
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    const strength = el.dataset.magneticStrength
      ? parseFloat(el.dataset.magneticStrength)
      : 0.3;
    const smoothness = 0.2;

    let bounds;

    const onMouseEnter = () => {
      bounds = el.getBoundingClientRect();
      el.style.willChange = 'transform';
    };

    const onMouseMove = (e) => {
      if (!bounds) return;

      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: smoothness,
        ease: 'power2.out',
      });

      // Also move inner content slightly more for depth
      const inner = el.querySelector('span, .btn-icon, .social-icon, .audio-icon');
      if (inner) {
        gsap.to(inner, {
          x: deltaX * 0.3,
          y: deltaY * 0.3,
          duration: smoothness,
          ease: 'power2.out',
        });
      }
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      });

      const inner = el.querySelector('span, .btn-icon, .social-icon, .audio-icon');
      if (inner) {
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)',
        });
      }

      el.style.willChange = '';
    };

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
  });

  console.log('✅ Magnetic elements initialized');
}

/**
 * Magnetic cursor — cursor pulls toward nearest interactive element
 */
export function initMagneticCursor() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cursorAura = document.querySelector('.cursor-aura');
  const cursorCore = document.querySelector('.cursor-core');
  if (!cursorAura && !cursorCore) return;

  const interactiveElements = document.querySelectorAll(
    'a, button, [data-cursor], input, textarea, .tech-tag, .project-card'
  );

  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursorAura) {
        gsap.to(cursorAura, {
          scale: 1.5,
          borderColor: 'rgba(236, 72, 153, 0.6)',
          duration: 0.3,
          ease: 'power2.out',
        });
      }
      if (cursorCore) {
        gsap.to(cursorCore, {
          scale: 0.5,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    el.addEventListener('mouseleave', () => {
      if (cursorAura) {
        gsap.to(cursorAura, {
          scale: 1,
          borderColor: 'rgba(99, 102, 241, 0.5)',
          duration: 0.3,
          ease: 'power2.out',
        });
      }
      if (cursorCore) {
        gsap.to(cursorCore, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
  });
}

/**
 * Click ripple burst effect
 */
export function initClickRipple() {
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    gsap.fromTo(
      ripple,
      {
        width: 0,
        height: 0,
        opacity: 0.6,
      },
      {
        width: 100,
        height: 100,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      }
    );
  });
}

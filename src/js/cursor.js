/**
 * Custom Cursor Module
 * Enhanced futuristic cursor with velocity-based effects
 */
import gsap from 'gsap';

/**
 * Initialize custom cursor
 */
export function initCursor() {
  if (!window.matchMedia('(hover: hover)').matches) {
    const cursorEl = document.querySelector('.cursor');
    if (cursorEl) cursorEl.style.display = 'none';
    return;
  }

  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  const cursorCore = cursor.querySelector('.cursor-core');
  
  // Use GSAP quickSetter for ultra-fast, zero-latency movement
  const setX = gsap.quickSetter(cursorCore, 'x', 'px');
  const setY = gsap.quickSetter(cursorCore, 'y', 'px');

  document.documentElement.style.cursor = 'none';

  /**
   * Immediately track mouse without delay
   */
  function handleMouseMove(e) {
    setX(e.clientX);
    setY(e.clientY);
  }

  /**
   * Hover class toggling (CSS handles the width/height transitions)
   */
  function handleHover(e) {
    const isInteractive = e.target.closest('a, button, input, textarea, [data-cursor]');
    if (isInteractive) {
      cursor.classList.add('cursor-hover');
    }
  }

  function handleHoverLeave(e) {
    const isStillInteractive = e.relatedTarget?.closest?.('a, button, input, textarea, [data-cursor]');
    if (!isStillInteractive) {
      cursor.classList.remove('cursor-hover');
    }
  }

  /**
   * Crisp pop on click
   */
  function handleClick() {
    gsap.fromTo(cursorCore, {
      scale: 0.5,
    }, {
      scale: 1,
      duration: 0.3,
      ease: 'back.out(2)',
    });
  }

  // Event listeners
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseover', handleHover);
  document.addEventListener('mouseout', handleHoverLeave);
  document.addEventListener('mousedown', handleClick);

  return {
    updatePosition: (x, y) => {
      setX(x);
      setY(y);
    },
  };
}

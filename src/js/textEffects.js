/**
 * Text Effects Module
 * Premium text animations: splitting, scramble, countup, glitch
 */
import gsap from 'gsap';

/**
 * Split text into individual characters wrapped in spans
 * Preserves spaces and line breaks
 */
export function splitTextIntoChars(selector) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    if (el.dataset.split === 'done') return; // Don't split twice

    const text = el.textContent;
    const fragment = document.createDocumentFragment();

    // Handle line breaks (br tags) by working with innerHTML
    const html = el.innerHTML;
    const parts = html.split(/<br\s*\/?>/gi);

    el.innerHTML = '';

    parts.forEach((part, partIndex) => {
      const trimmedPart = part.trim();
      const words = trimmedPart.split(/\s+/);

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'split-word';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.overflow = 'hidden';

        for (let i = 0; i < word.length; i++) {
          const charSpan = document.createElement('span');
          charSpan.className = 'split-char';
          charSpan.textContent = word[i];
          charSpan.style.display = 'inline-block';
          charSpan.style.willChange = 'transform, opacity';
          wordSpan.appendChild(charSpan);
        }

        el.appendChild(wordSpan);

        // Add space between words (not after last word)
        if (wordIndex < words.length - 1) {
          const space = document.createElement('span');
          space.innerHTML = '&nbsp;';
          space.className = 'split-space';
          space.style.display = 'inline-block';
          el.appendChild(space);
        }
      });

      // Add line break between parts
      if (partIndex < parts.length - 1) {
        el.appendChild(document.createElement('br'));
      }
    });

    el.dataset.split = 'done';
  });
}

/**
 * Text scramble/decode effect — Matrix-style character cycling
 */
export class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.queue = [];
    this.frame = 0;
    this.frameRequest = null;
    this.resolve = null;
  }

  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0; i < this.queue.length; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      if (this.resolve) this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
}

/**
 * Animated counter that counts up to a target value
 */
export function initCountUp(selector = '.stat-value') {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    const text = el.textContent.trim();
    // Extract numeric part
    const match = text.match(/^([\d,]+\.?\d*)/);
    if (!match && !text.includes('∞') && !text.includes('/')) return;

    // Skip non-numeric values like ∞ or 24/7
    if (text.includes('∞') || text.includes('/')) {
      // Just do a reveal animation instead
      gsap.from(el, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
      return;
    }

    if (!match) return;

    const target = parseFloat(match[1].replace(/,/g, ''));
    const suffix = text.replace(match[1], ''); // e.g., '+', 'K+', etc.
    const hasComma = match[1].includes(',');
    const hasDecimal = match[1].includes('.');

    // Set initial value
    el.textContent = '0' + suffix;

    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          gsap.to(obj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              let displayVal = Math.floor(obj.val);
              if (hasComma) {
                displayVal = displayVal.toLocaleString();
              }
              if (hasDecimal) {
                displayVal = obj.val.toFixed(1);
              }
              el.textContent = displayVal + suffix;
            },
          });
        },
      },
    });
  });
}

/**
 * Glitch text effect on hover
 */
export function initGlitchHover(selector = '[data-glitch]') {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    // Store original text once to prevent saving a scrambled state
    const originalText = el.dataset.original || el.textContent.trim();
    if (!el.dataset.original) {
      el.dataset.original = originalText;
    }

    el.addEventListener('mouseenter', () => {
      // Prevent overlapping glitch effects if hovered repeatedly
      if (el.dataset.glitching === "true") return;
      el.dataset.glitching = "true";
      
      // Stop any existing GSAP tween if there was one
      gsap.killTweensOf(el);

      let iterations = 0;
      // Faster recovery for titles, limit max duration
      const maxIterations = Math.max(10, Math.min(originalText.length, 25));
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

      const interval = setInterval(() => {
        el.textContent = originalText
          .split('')
          .map((char, i) => {
            // Speed up stabilization
            if (i < iterations * 1.5) return originalText[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        iterations++;
        if (iterations >= maxIterations) {
          el.textContent = originalText;
          clearInterval(interval);
          el.dataset.glitching = "false";
        }
      }, 30);
    });
  });
}

/**
 * Initialize all text effects
 */
export function initTextEffects() {
  // Split key headings into chars
  splitTextIntoChars('.home-section h1');
  splitTextIntoChars('.section-title');
  splitTextIntoChars('.contact-title');
  splitTextIntoChars('.skills-title');

  // Count up animations for stat values
  initCountUp('.stat-value');

  // Glitch hover on project titles
  initGlitchHover('.project-title');

  console.log('✅ Text effects initialized');
}

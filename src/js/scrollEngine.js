/**
 * Scroll Engine - Core Animation Orchestration
 * Lenis smooth scroll + GSAP ScrollTrigger
 */
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

/**
 * Initialize Lenis smooth scroll
 */
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  console.log('✅ Lenis smooth scroll initialized');
  return lenis;
}

/**
 * Initialize all scroll animations
 */
export function initScrollEngine() {
  initLenis();
  initScrollProgress();
  initHeroAnimations();
  initAboutAnimations();
  initProjectsHorizontalScroll();
  initContactAnimations();
  initFooterAnimations();
  initParallaxLayers();
  initSectionColorMorph();
  initGrainOverlay();

  console.log('✅ Scroll Engine initialized');
}

/**
 * Scroll progress bar at top of page
 */
function initScrollProgress() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  if (!progressBar) return;

  gsap.to(progressBar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  });
}

/**
 * Hero Section — Cinematic Entry
 */
function initHeroAnimations() {
  const heroSection = document.getElementById('home');
  if (!heroSection) return;

  const tl = gsap.timeline({
    defaults: { ease: 'power4.out' },
  });

  // Hero heading chars
  const heroChars = heroSection.querySelectorAll('.split-char');
  if (heroChars.length) {
    tl.from(heroChars, {
      y: 120,
      rotateX: -90,
      opacity: 0,
      stagger: 0.03,
      duration: 1.2,
    }, 0.5);
  }

  // Subtitle scramble (handled by textEffects, just fade the container)
  const subtitle = heroSection.querySelector('.typewriter-container');
  if (subtitle) {
    tl.from(subtitle, {
      opacity: 0,
      y: 30,
      duration: 0.8,
    }, 1.2);
  }

  // CTA button
  const ctaBtn = heroSection.querySelector('.get');
  if (ctaBtn) {
    tl.from(ctaBtn, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
    }, 1.5);
  }

  // 3D model scene
  const scene = heroSection.querySelector('.scene');
  if (scene) {
    tl.from(scene, {
      opacity: 0,
      scale: 0.8,
      x: 100,
      duration: 1,
      ease: 'power3.out',
    }, 0.8);
  }

  // Scroll indicator
  const scrollIndicator = heroSection.querySelector('.professional-scroll-indicator');
  if (scrollIndicator) {
    tl.from(scrollIndicator, {
      opacity: 0,
      y: 20,
      duration: 0.6,
    }, 2);
  }

  // Hero EXIT animation — fade + scale down as user scrolls past
  gsap.to(heroSection.querySelector('.container'), {
    y: -100,
    opacity: 0,
    scale: 0.9,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'center center',
      end: 'bottom top',
      scrub: 1,
    },
  });

  // 3D model parallax on scroll
  if (scene) {
    gsap.to(scene, {
      y: -150,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }
}

/**
 * About Section — Cinematic Pinned Experience
 */
function initAboutAnimations() {
  const aboutSection = document.getElementById('about');
  const stickyWrapper = aboutSection?.querySelector('.about-sticky-wrapper');
  
  if (!aboutSection || !stickyWrapper) return;

  const title = stickyWrapper.querySelector('.editorial-title');
  const bio = stickyWrapper.querySelector('.editorial-bio');
  const stats = stickyWrapper.querySelectorAll('.stat-minimal');
  
  const bentoHeader = stickyWrapper.querySelector('.bento-header');
  const bentoCards = stickyWrapper.querySelectorAll('.bento-card');
  const actionBtns = stickyWrapper.querySelectorAll('.action-buttons .btn');

  // Master timeline pinned to the about section
  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: aboutSection,
      start: 'top top',
      end: '+=200%', // Pin for 2 viewport heights
      scrub: 1,
      pin: true,
      anticipatePin: 1
    }
  });

  // 1. Initial State
  gsap.set([title, bio, stats, bentoHeader, bentoCards, actionBtns], { opacity: 0, y: 50 });
  gsap.set(bentoCards, { scale: 0.95, rotationY: -5 });

  // 2. Reveal Editorial Header & Bio
  aboutTl.to(title, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
         .to(bio, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
         .to(stats, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' }, '-=0.5');

  // 3. Pause slightly
  aboutTl.to({}, { duration: 0.5 });

  // 4. Reveal Bento Box Grid
  aboutTl.to(bentoHeader, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
         .to(bentoCards, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            stagger: 0.15,
            duration: 1.2,
            ease: 'back.out(1.2)'
         }, '-=0.4');

  // 5. Action Buttons
  aboutTl.to(actionBtns, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, '-=0.2');

  // Optional: Global parallax for the 3D model if it's on screen
  if (window.gsap && document.querySelector('.model-container')) {
    gsap.to('.model-container', {
      scrollTrigger: {
        trigger: aboutSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      y: 200, // Move the model down deeply
      opacity: 0.2, // Fade it back smoothly
      scale: 0.9,
    });
  }
}

/**
 * Projects Section — Horizontal Scroll Gallery
 */
function initProjectsHorizontalScroll() {
  const projectsSection = document.getElementById('projects');
  if (!projectsSection) return;

  // Section header reveal
  const sectionHeader = projectsSection.querySelector('.section-header');
  if (sectionHeader) {
    const titleChars = sectionHeader.querySelectorAll('.split-char');
    if (titleChars.length) {
      gsap.from(titleChars, {
        y: 80,
        opacity: 0,
        rotateX: -60,
        stagger: 0.02,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionHeader,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    const subtitle = sectionHeader.querySelector('.section-subtitle');
    if (subtitle) {
      gsap.from(subtitle, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: subtitle,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }
  }

  // Horizontal scroll for project cards
  const horizontalTrack = projectsSection.querySelector('.projects-horizontal-track');
  const projectCards = projectsSection.querySelectorAll('.project-card');

  if (horizontalTrack && projectCards.length) {
    const totalScrollWidth = horizontalTrack.scrollWidth - window.innerWidth;

    gsap.to(horizontalTrack, {
      x: () => -totalScrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: projectsSection.querySelector('.projects-horizontal-wrapper'),
        start: 'top top',
        end: () => `+=${totalScrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Individual card animations during horizontal scroll
    projectCards.forEach((card, i) => {
      // Card entrance — slight rotation and scale
      gsap.from(card, {
        rotateY: -8,
        scale: 0.9,
        opacity: 0.5,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          containerAnimation: gsap.getById?.('horizontalScroll'),
          start: 'left 80%',
          end: 'left 50%',
          toggleActions: 'play none none reverse',
          // Use the section-based trigger instead
          scroller: undefined,
        },
      });

      // Parallax on project images
      const img = card.querySelector('.project-image img');
      if (img) {
        gsap.to(img, {
          xPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: projectsSection.querySelector('.projects-horizontal-wrapper'),
            start: 'top top',
            end: () => `+=${totalScrollWidth}`,
            scrub: 1,
          },
        });
      }
    });
  }

  // Resume/Download section
  const downloadSection = projectsSection.querySelector('.download-section');
  if (downloadSection) {
    gsap.from(downloadSection, {
      y: 80,
      opacity: 0,
      scale: 0.9,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: downloadSection,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  }
}

/**
 * Contact Section — Staggered Form Reveal
 */
function initContactAnimations() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  // Title reveal
  const titleChars = contactSection.querySelectorAll('.contact-title .split-char');
  if (titleChars.length) {
    gsap.from(titleChars, {
      y: 60,
      opacity: 0,
      rotateX: -45,
      stagger: 0.03,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: contactSection,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
    });
  }

  const subtitle = contactSection.querySelector('.contact-subtitle');
  if (subtitle) {
    gsap.from(subtitle, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: subtitle,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  }

  // Form container
  const form = contactSection.querySelector('.contact-form');
  if (form) {
    gsap.from(form, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: form,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  }

  // Form fields stagger
  const formGroups = contactSection.querySelectorAll('.form-group');
  if (formGroups.length) {
    gsap.from(formGroups, {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: formGroups[0],
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  }

  // Submit button
  const submitBtn = contactSection.querySelector('.submit-btn');
  if (submitBtn) {
    gsap.from(submitBtn, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: submitBtn,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });
  }
}

/**
 * Footer — Staggered Reveal
 */
function initFooterAnimations() {
  const footer = document.getElementById('ultimateFooter');
  if (!footer) return;

  const footerElements = footer.querySelectorAll('.footer-brand, .footer-nav, .footer-social');
  if (footerElements.length) {
    gsap.from(footerElements, {
      y: 60,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footer,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  }

  const footerBottom = footer.querySelector('.footer-bottom');
  if (footerBottom) {
    gsap.from(footerBottom, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: footerBottom,
        start: 'top 95%',
        toggleActions: 'play none none reverse',
      },
    });
  }
}

/**
 * Parallax Layers — Depth effect on decorative elements
 */
function initParallaxLayers() {
  // Floating orbs
  const orbs = document.querySelectorAll('.floating-orb');
  orbs.forEach((orb, i) => {
    const speed = 0.3 + i * 0.15;
    gsap.to(orb, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1 + i * 0.5,
      },
    });
  });

  // Section dividers
  const dividers = document.querySelectorAll('.section-divider');
  dividers.forEach((div) => {
    gsap.from(div, {
      scaleX: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: div,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // DNA helix parallax
  const helixBases = document.querySelectorAll('.helix-base');
  helixBases.forEach((base, i) => {
    gsap.to(base, {
      y: () => gsap.utils.random(-80, 80),
      x: () => gsap.utils.random(-30, 30),
      ease: 'none',
      scrollTrigger: {
        trigger: base.closest('section') || document.body,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });
}

/**
 * Section Color Morphing — Background gradient shifts
 */
function initSectionColorMorph() {
  // Disabled — pure black background, no color morphing
}

/**
 * Film grain — static only, NO animation (saves massive perf)
 */
function initGrainOverlay() {
  const grain = document.querySelector('.grain-overlay');
  if (!grain) return;
  // Just show it statically — no per-frame animation
  grain.style.opacity = '0.02';
}

/**
 * Expose lenis for external use
 */
export function getLenis() {
  return lenis;
}

/**
 * Scroll to a section smoothly via Lenis
 */
export function scrollToSection(target) {
  if (lenis) {
    lenis.scrollTo(target, { offset: 0, duration: 1.5 });
  }
}

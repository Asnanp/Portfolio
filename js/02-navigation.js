/**
 * 🎆 ULTRA NAVIGATION SYSTEM
 * Smooth scroll, active tracking, parallax effects, and keyboard nav
 */

class UltraNavigation {
  constructor() {
    this.navbar = document.querySelector('.ultra-navbar');
    this.navLinks = document.querySelectorAll('.ultra-nav-link');
    this.sections = document.querySelectorAll('section[id]');
    this.isScrolling = false;
    this.currentSection = 'home';
    this.lastScrollY = 0;
    this.init();
  }

  init() {
    this.setupSmoothScroll();
    this.setupActiveTracking();
    this.setupParallaxNav();
    this.setupKeyboardNav();
  }

  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const targetPosition = targetSection.offsetTop;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          const duration = 1000;
          let start = null;
          
          const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const easing = progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            window.scrollTo(0, startPosition + distance * easing);
            
            if (timeElapsed < duration) {
              requestAnimationFrame(animation);
            }
          };
          
          requestAnimationFrame(animation);
        }
      });
    });
  }

  setupActiveTracking() {
    const observerOptions = {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.currentSection = sectionId;
          this.updateActiveLink(sectionId);
        }
      });
    }, observerOptions);

    this.sections.forEach(section => observer.observe(section));
  }

  updateActiveLink(sectionId) {
    this.navLinks.forEach(link => {
      const linkSection = link.getAttribute('data-section');
      if (linkSection === sectionId) {
        link.classList.add('active');
        link.style.background = 'rgba(0, 255, 255, 0.1)';
        link.style.color = '#00ffff';
        link.style.textShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
      } else {
        link.classList.remove('active');
        link.style.background = '';
        link.style.color = '';
        link.style.textShadow = '';
      }
    });
  }

  setupParallaxNav() {
    let ticking = false;
    
    const updateNavPosition = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollY / maxScroll) * 100;
      
      if (this.navbar) {
        const rotation = scrollPercent * 0.1;
        this.navbar.style.transform = `translateX(-50%) rotateZ(${rotation}deg)`;
      }
      
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateNavPosition);
        ticking = true;
      }
    });
  }

  setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateToNextSection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateToPrevSection();
      }
    });
  }

  navigateToNextSection() {
    const sectionArray = Array.from(this.sections);
    const currentIndex = sectionArray.findIndex(s => s.id === this.currentSection);
    if (currentIndex < sectionArray.length - 1) {
      const nextSection = sectionArray[currentIndex + 1];
      this.scrollToSection(nextSection);
    }
  }

  navigateToPrevSection() {
    const sectionArray = Array.from(this.sections);
    const currentIndex = sectionArray.findIndex(s => s.id === this.currentSection);
    if (currentIndex > 0) {
      const prevSection = sectionArray[currentIndex - 1];
      this.scrollToSection(prevSection);
    }
  }

  scrollToSection(section) {
    const targetPosition = section.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start = null;
    
    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const easing = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      window.scrollTo(0, startPosition + distance * easing);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.ultraNavigation = new UltraNavigation();
});

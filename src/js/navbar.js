/**
 * Navbar Module
 * Handles navigation interactions and active state
 */

/**
 * Initialize navbar functionality
 */
export function initNavbar() {
  const navLinks = document.querySelectorAll('.ultra-nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  if (!navLinks.length) {
    console.warn('Navbar links not found');
    return;
  }
  
  /**
   * Update active nav link based on scroll position
   */
  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  /**
   * Smooth scroll to section
   * @param {Event} event - Click event
   */
  function handleNavClick(event) {
    const link = event.currentTarget;
    const href = link.getAttribute('href');
    
    if (href.startsWith('#')) {
      event.preventDefault();
      const targetId = href.substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  }
  
  // Add event listeners
  navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });
  
  // Listen to scroll events
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  
  // Initial call
  updateActiveNav();
  
  console.log('✅ Navbar initialized');
}

/**
 * Create floating navbar
 * @returns {HTMLElement} Navbar element
 */
export function createNavbar() {
  const navHTML = `
    <nav class="ultra-navbar" aria-label="Main navigation" role="navigation">
      <div class="ultra-nav-container">
        <ul class="ultra-nav-links">
          <li><a href="#home" class="ultra-nav-link active" data-section="home">Home</a></li>
          <li><a href="#about" class="ultra-nav-link" data-section="about">About</a></li>
          <li><a href="#projects" class="ultra-nav-link" data-section="projects">Projects</a></li>
          <li><a href="#contact" class="ultra-nav-link" data-section="contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  return document.querySelector('.ultra-navbar');
}

/**
 * Hide/show navbar based on scroll direction
 */
export class NavbarScrollController {
  constructor() {
    this.navbar = document.querySelector('.ultra-navbar');
    this.lastScrollY = window.scrollY;
    this.ticking = false;
    
    if (this.navbar) {
      this.init();
    }
  }
  
  init() {
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        window.requestAnimationFrame(() => {
          this.update();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }
  
  update() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      // Scrolling down
      this.navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      this.navbar.style.transform = 'translateY(0)';
    }
    
    this.lastScrollY = currentScrollY;
  }
}

/**
 * 📧 CONTACT FORM HANDLER
 * Form validation, email submission, and visual feedback
 */

class ContactFormHandler {
  constructor() {
    this.contactForm = document.querySelector('.contact-form');
    this.submitBtn = null;
    this.originalBtnText = '';

    if (this.contactForm) {
      this.init();
    }
  }

  init() {
    this.submitBtn = this.contactForm.querySelector('.submit-btn');
    this.originalBtnText = this.submitBtn.innerHTML;
    this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  handleSubmit(e) {
    const formData = new FormData(this.contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
      e.preventDefault();
      this.showError('Please fill in all fields');
      return;
    }

    if (!this.isValidEmail(email)) {
      e.preventDefault();
      this.showError('Please enter a valid email');
      return;
    }

    this.showSending();

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`
Hello,

New message from your portfolio:

Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from portfolio contact form
    `);

    const mailtoLink = `mailto:asnanp875@gmail.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      window.open(mailtoLink, '_blank');
      this.showSuccess();
    }, 500);
  }

  showSending() {
    this.submitBtn.innerHTML = '<span>Sending...</span><div class="btn-icon">⏳</div>';
    this.submitBtn.style.background = 'linear-gradient(135deg, #ff8800, #ffaa00)';
    this.submitBtn.disabled = true;
  }

  showSuccess() {
    this.submitBtn.innerHTML = '<span>Email Opened!</span><div class="btn-icon">✅</div>';
    this.submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
    this.contactForm.reset();
    this.createSuccessAnimation();

    setTimeout(() => {
      this.resetButton();
    }, 3000);
  }

  showError(errorMessage) {
    this.submitBtn.innerHTML = `<span>${errorMessage}</span><div class="btn-icon">❌</div>`;
    this.submitBtn.style.background = 'linear-gradient(135deg, #ff4444, #cc0000)';

    setTimeout(() => {
      this.resetButton();
    }, 3000);
  }

  resetButton() {
    this.submitBtn.innerHTML = this.originalBtnText;
    this.submitBtn.style.background = 'linear-gradient(135deg, #00ffff, #ff00ff)';
    this.submitBtn.disabled = false;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  createSuccessAnimation() {
    const formRect = this.contactForm.getBoundingClientRect();

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.style.cssText = `
          position: fixed;
          top: ${formRect.top + formRect.height / 2}px;
          left: ${formRect.left + formRect.width / 2}px;
          width: 8px;
          height: 8px;
          background: #00ff88;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          animation: successParticle 2s ease-out forwards;
          transform: rotate(${i * 36}deg) translateX(50px);
        `;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 2000);
      }, i * 100);
    }

    if (!document.getElementById('success-particle-styles')) {
      const style = document.createElement('style');
      style.id = 'success-particle-styles';
      style.textContent = `
        @keyframes successParticle {
          0% { opacity: 1; transform: scale(1) translateX(0); }
          100% { opacity: 0; transform: scale(0.5) translateX(100px); }
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize contact form handler
document.addEventListener('DOMContentLoaded', () => {
  window.contactFormHandler = new ContactFormHandler();
});

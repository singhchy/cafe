// Button ripple, nav hover, form focus states, micro‑interactions
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
import { isMobile, isFinePointer } from '../../global/js/utils.js';

export function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn:not(.btn-magnetic)');
  
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (isMobile()) return; // No ripple on mobile for performance
      
      const x = e.clientX - this.getBoundingClientRect().left;
      const y = e.clientY - this.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      gsap.fromTo(ripple,
        { scale: 0, opacity: 0.6 },
        {
          scale: 4,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          onComplete: () => ripple.remove()
        }
      );
    });
  });
}

export function initNavHover() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, {
        y: -2,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    link.addEventListener('mouseleave', () => {
      gsap.to(link, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

export function initFormFocus() {
  const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
  
  inputs.forEach(input => {
    const label = input.previousElementSibling?.classList.contains('form-label') 
      ? input.previousElementSibling 
      : null;
    
    input.addEventListener('focus', () => {
      gsap.to(input, {
        borderColor: 'var(--v1-primary)',
        boxShadow: '0 0 0 3px rgba(45, 74, 45, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      if (label) {
        gsap.to(label, {
          y: -10,
          fontSize: '0.8rem',
          color: 'var(--v1-primary)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
    
    input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
        gsap.to(input, {
          borderColor: 'var(--v1-border)',
          boxShadow: 'none',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        if (label) {
          gsap.to(label, {
            y: 0,
            fontSize: '1rem',
            color: 'var(--v1-text-muted)',
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      }
    });
  });
}

export function initHoverLift() {
  const liftElements = document.querySelectorAll('.feature-card, .menu-card, .blog-card');
  
  liftElements.forEach(el => {
    if (!isFinePointer()) return;
    
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        y: -6,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
    
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });
}

export function initSocialBounce() {
  const socialIcons = document.querySelectorAll('.social-icon');
  
  socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        scale: 1.2,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)'
      });
    });
    
    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });
}

export function initPlayButtonPulse() {
  const playButton = document.querySelector('.play-button');
  if (!playButton) return;
  
  // Continuous pulse
  gsap.to(playButton, {
    scale: 1.05,
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
  
  // Click effect
  playButton.addEventListener('click', () => {
    gsap.to(playButton, {
      scale: 1.3,
      opacity: 0.7,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
  });
}

export function initImageHoverZoom() {
  const images = document.querySelectorAll('.blog-card-img img, .menu-card-img img');
  
  images.forEach(img => {
    const parent = img.closest('.blog-card, .menu-card');
    if (!parent) return;
    
    parent.addEventListener('mouseenter', () => {
      gsap.to(img, {
        scale: 1.08,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
    
    parent.addEventListener('mouseleave', () => {
      gsap.to(img, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  });
}

export function initFormValidation() {
  const form = document.querySelector('.reservation-form');
  if (!form) return;
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll('.form-input, .form-select');
  
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      let isValid = true;
      
      inputs.forEach(input => {
        const error = input.nextElementSibling?.classList.contains('form-error') 
          ? input.nextElementSibling 
          : null;
        
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
          
          if (error) {
            error.textContent = 'This field is required';
            error.classList.add('show');
            
            gsap.fromTo(error,
              { x: -10, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
            );
          }
          
          // Shake animation
          gsap.to(input, {
            x: -5,
            duration: 0.1,
            yoyo: true,
            repeat: 5,
            ease: 'power2.inOut'
          });
        } else {
          input.classList.remove('error');
          if (error) error.classList.remove('show');
        }
      });
      
      if (isValid) {
        e.preventDefault();
        // Show success message
        const success = document.createElement('div');
        success.className = 'form-success';
        success.innerHTML = '<p>Reservation submitted successfully!</p>';
        form.appendChild(success);
        
        gsap.fromTo(success,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
        );
        
        // Reset form after 3 seconds
        setTimeout(() => {
          gsap.to(success, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.in',
            onComplete: () => success.remove()
          });
          form.reset();
        }, 3000);
      } else {
        e.preventDefault();
      }
    });
  }
}

// Initialize all interactions
export function initAllInteractions() {
  if (!isMobile()) {
    initButtonRipple();
    initNavHover();
    initHoverLift();
    initImageHoverZoom();
  }
  
  initFormFocus();
  initSocialBounce();
  initPlayButtonPulse();
  initFormValidation();
  
  console.log('V1 interaction animations initialized');
}
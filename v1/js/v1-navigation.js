// Navigation sticky, mobile menu, scroll detection
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
import { ScrollTrigger } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
import { isMobile } from '../../global/js/utils.js';

export function initNavigation() {
  const header = document.querySelector('.nav-header');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const scrollThreshold = 80;

  // Sticky nav on scroll
  function updateNavOnScroll() {
    const scrolled = window.scrollY > scrollThreshold;
    header.classList.toggle('scrolled', scrolled);
  }

  window.addEventListener('scroll', updateNavOnScroll);
  updateNavOnScroll(); // initial check

  // Mobile menu toggle
  if (navToggle && mobileOverlay) {
    navToggle.addEventListener('click', () => {
      const isActive = navToggle.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
      
      // Animate links stagger
      if (isActive) {
        gsap.from(mobileLinks, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Nav link hover animation (underline)
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

  // Smooth scroll to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetTop = target.offsetTop - offset;
        
        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navToggle && navToggle.classList.contains('active')) {
          navToggle.classList.remove('active');
          mobileOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  // ScrollTrigger for nav background intensity
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: self => {
      const progress = self.progress;
      header.style.setProperty('--scroll-progress', progress);
    }
  });
}
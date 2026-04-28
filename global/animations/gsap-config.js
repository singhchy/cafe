// GSAP global configuration and ScrollTrigger registration
import gsap from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
import ScrollTrigger from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
import CustomEase from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, CustomEase);

// Global GSAP defaults
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8
});

// Custom easing curves
CustomEase.create('organic', '0.4, 0.0, 0.2, 1');
CustomEase.create('bounceOut', '0.34, 1.56, 0.64, 1');

/**
 * Initialize GSAP and ScrollTrigger with global settings
 */
export function initGSAP() {
  // Set global ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: 'play none none none',
    start: 'top 80%',
    end: 'bottom 20%',
    markers: false // set to true for debugging
  });

  // Prevent memory leaks on page hide
  ScrollTrigger.addEventListener('refreshInit', () => {
    // Optional: add any pre‑refresh logic
  });

  // Improve performance on mobile
  if (window.matchMedia('(max-width: 768px)').matches) {
    ScrollTrigger.config({
      limitCallbacks: true,
      ignoreMobileResize: true
    });
  }

  console.log('GSAP configured with ScrollTrigger');
}

/**
 * Create a standard entrance animation for any element
 * @param {HTMLElement|HTMLElement[]} target - Element(s) to animate
 * @param {Object} options - Animation options
 * @returns {GSAPTween} GSAP timeline
 */
export function createEntrance(target, options = {}) {
  const defaults = {
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0,
    scrollTrigger: null
  };

  const config = { ...defaults, ...options };

  const tl = gsap.timeline({
    defaults: { ease: config.ease },
    scrollTrigger: config.scrollTrigger
  });

  tl.from(target, {
    y: config.y,
    opacity: config.opacity,
    duration: config.duration,
    stagger: config.stagger
  });

  return tl;
}

/**
 * Create a staggered group entrance
 * @param {HTMLElement[]} elements - Array of elements
 * @param {Object} options - Animation options
 * @returns {GSAPTween} GSAP timeline
 */
export function staggerEntrance(elements, options = {}) {
  const defaults = {
    y: 40,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: null
  };

  const config = { ...defaults, ...options };

  return gsap.from(elements, {
    y: config.y,
    opacity: config.opacity,
    duration: config.duration,
    ease: config.ease,
    stagger: config.stagger,
    scrollTrigger: config.scrollTrigger
  });
}

/**
 * Create a continuous floating animation (sine wave)
 * @param {HTMLElement} element - Element to float
 * @param {Object} options - Animation options
 * @returns {GSAPTween} GSAP animation
 */
export function floatAnimation(element, options = {}) {
  const defaults = {
    y: 20,
    duration: 3,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true
  };

  const config = { ...defaults, ...options };

  return gsap.to(element, {
    y: `+=${config.y}`,
    duration: config.duration,
    ease: config.ease,
    repeat: config.repeat,
    yoyo: config.yoyo
  });
}

/**
 * Create a magnetic button effect
 * @param {HTMLElement} button - Button element
 * @param {number} strength - Magnetic pull strength (default 0.2)
 */
export function magneticButton(button, strength = 0.2) {
  const bounding = button.getBoundingClientRect();

  button.addEventListener('mousemove', (e) => {
    const x = e.clientX - bounding.left - bounding.width / 2;
    const y = e.clientY - bounding.top - bounding.height / 2;

    gsap.to(button, {
      x: x * strength,
      y: y * strength,
      duration: 0.6,
      ease: 'power2.out'
    });
  });

  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    });
  });
}

/**
 * Create a tilt effect on mouse move (3D card tilt)
 * @param {HTMLElement} card - Card element
 * @param {Object} options - Tilt options
 */
export function tiltEffect(card, options = {}) {
  const defaults = {
    maxRotation: 8,
    perspective: 1000,
    scale: 1.03,
    easing: 'power2.out'
  };

  const config = { ...defaults, ...options };

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = (x / rect.width - 0.5) * 2;
    const yPercent = (y / rect.height - 0.5) * 2;

    const rotateY = xPercent * config.maxRotation;
    const rotateX = -yPercent * config.maxRotation;

    gsap.to(card, {
      rotateX,
      rotateY,
      scale: config.scale,
      transformPerspective: config.perspective,
      duration: 0.4,
      ease: config.easing
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    });
  });
}

/**
 * Create a counter animation (number count‑up)
 * @param {HTMLElement} element - Element containing the number
 * @param {number} endValue - Target number
 * @param {Object} options - Animation options
 * @returns {GSAPTween} GSAP timeline
 */
export function counterAnimation(element, endValue, options = {}) {
  const defaults = {
    duration: 2,
    ease: 'power2.out',
    scrollTrigger: null,
    prefix: '',
    suffix: ''
  };

  const config = { ...defaults, ...options };

  const tl = gsap.timeline({
    scrollTrigger: config.scrollTrigger
  });

  tl.fromTo(element,
    { innerText: 0 },
    {
      innerText: endValue,
      duration: config.duration,
      ease: config.ease,
      snap: { innerText: 1 },
      onUpdate: function() {
        element.textContent = config.prefix + Math.floor(this.targets()[0].innerText) + config.suffix;
      }
    }
  );

  return tl;
}

/**
 * Create a marquee (infinite horizontal scroll)
 * @param {HTMLElement} container - Marquee container
 * @param {string} direction - 'left' or 'right' (default 'left')
 * @param {number} speed - Pixels per second (default 50)
 */
export function marquee(container, direction = 'left', speed = 50) {
  const content = container.children[0];
  if (!content) return;

  const contentWidth = content.scrollWidth;
  const duplicate = content.cloneNode(true);
  container.appendChild(duplicate);

  const totalWidth = contentWidth * 2;
  const duration = totalWidth / speed;

  gsap.set([content, duplicate], { x: 0 });

  const tl = gsap.timeline({ repeat: -1 });
  tl.to([content, duplicate], {
    x: direction === 'left' ? -contentWidth : contentWidth,
    duration,
    ease: 'none',
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % contentWidth)
    }
  });

  // Pause on hover
  container.addEventListener('mouseenter', () => tl.pause());
  container.addEventListener('mouseleave', () => tl.resume());

  return tl;
}

/**
 * Kill all ScrollTrigger instances and clean up
 */
export function cleanupAnimations() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.globalTimeline.clear();
}

// Export GSAP and plugins for convenience
export { gsap, ScrollTrigger, CustomEase };
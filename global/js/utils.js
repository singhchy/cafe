// Shared utility functions for V1 website

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Linear interpolation (lerp) between two values
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum bound
 * @param {number} max - Maximum bound
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Get viewport dimensions
 * @returns {Object} { width, height }
 */
export function getViewport() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Check if device has fine pointer (mouse) vs coarse (touch)
 * @returns {boolean} True if fine pointer
 */
export function isFinePointer() {
  return window.matchMedia('(pointer: fine)').matches;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} el - Element to check
 * @param {number} offset - Offset from viewport edges (px)
 * @returns {boolean} True if element is in viewport
 */
export function isInViewport(el, offset = 0) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth) - offset &&
    rect.bottom >= offset &&
    rect.right >= offset
  );
}

/**
 * Preload images
 * @param {string[]} srcs - Array of image URLs
 * @returns {Promise} Resolves when all images are loaded
 */
export function preloadImages(srcs) {
  const promises = srcs.map(src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = resolve;
      img.onerror = reject;
    });
  });
  return Promise.all(promises);
}

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Throttle function to limit execution rate
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Detect mobile device (simplified)
 * @returns {boolean} True if mobile
 */
export function isMobile() {
  return window.matchMedia('(max-width: 768px)').matches;
}

/**
 * Add CSS class with vendor prefix support
 * @param {HTMLElement} el - Element
 * @param {string} className - Class to add
 */
export function addClass(el, className) {
  el.classList.add(className);
}

/**
 * Remove CSS class
 * @param {HTMLElement} el - Element
 * @param {string} className - Class to remove
 */
export function removeClass(el, className) {
  el.classList.remove(className);
}

/**
 * Toggle CSS class
 * @param {HTMLElement} el - Element
 * @param {string} className - Class to toggle
 * @param {boolean} force - Optional force state
 */
export function toggleClass(el, className, force) {
  el.classList.toggle(className, force);
}

/**
 * Set CSS custom property on document root
 * @param {string} property - Property name
 * @param {string} value - Property value
 */
export function setCSSProperty(property, value) {
  document.documentElement.style.setProperty(property, value);
}

/**
 * Get CSS custom property value
 * @param {string} property - Property name
 * @returns {string} Property value
 */
export function getCSSProperty(property) {
  return getComputedStyle(document.documentElement).getPropertyValue(property).trim();
}
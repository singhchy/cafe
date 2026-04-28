// Smooth scroll and scroll‑triggered utilities
import { debounce, throttle } from './utils.js';

let scrollY = 0;
let lastScrollY = 0;
let ticking = false;
const scrollListeners = [];

/**
 * Initialize smooth scroll behavior
 */
export function initSmoothScroll() {
  // Use native CSS scroll‑behavior if supported
  if ('scrollBehavior' in document.documentElement.style) {
    return;
  }

  // Polyfill for smooth scrolling to anchor links
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    window.scrollTo({
      top: target.offsetTop - 80, // offset for sticky nav
      behavior: 'smooth'
    });
  });
}

/**
 * Get current scroll position
 * @returns {number} Scroll Y
 */
export function getScrollY() {
  return window.pageYOffset || document.documentElement.scrollTop;
}

/**
 * Add scroll event listener with throttling
 * @param {Function} callback - Function to call on scroll
 * @param {number} throttleMs - Throttle interval (default 16ms ≈ 60fps)
 * @returns {Function} Unsubscribe function
 */
export function onScroll(callback, throttleMs = 16) {
  const throttledCallback = throttle(callback, throttleMs);
  const listener = () => throttledCallback(getScrollY());
  window.addEventListener('scroll', listener, { passive: true });
  scrollListeners.push({ callback, listener });
  return () => {
    window.removeEventListener('scroll', listener);
    const index = scrollListeners.findIndex(item => item.callback === callback);
    if (index > -1) scrollListeners.splice(index, 1);
  };
}

/**
 * Remove all scroll listeners
 */
export function removeAllScrollListeners() {
  scrollListeners.forEach(({ listener }) => {
    window.removeEventListener('scroll', listener);
  });
  scrollListeners.length = 0;
}

/**
 * Detect scroll direction
 * @returns {string} 'up' or 'down'
 */
export function getScrollDirection() {
  const current = getScrollY();
  const direction = current > lastScrollY ? 'down' : 'up';
  lastScrollY = current;
  return direction;
}

/**
 * Check if user has scrolled past a threshold
 * @param {number} threshold - Pixels from top
 * @returns {boolean} True if scrolled past threshold
 */
export function isScrolledPast(threshold) {
  return getScrollY() > threshold;
}

/**
 * Scroll to top of page smoothly
 * @param {number} duration - Duration in ms
 */
export function scrollToTop(duration = 600) {
  const start = getScrollY();
  const startTime = performance.now();

  function scrollStep(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress * (2 - progress); // easeOutQuad

    window.scrollTo(0, start * (1 - ease));

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}

/**
 * Enable/disable body scroll (for modals)
 * @param {boolean} disable - True to disable scroll
 */
export function toggleBodyScroll(disable) {
  if (disable) {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
  } else {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}

/**
 * Calculate element's scroll progress (0 to 1)
 * @param {HTMLElement} el - Element to track
 * @returns {number} Progress value
 */
export function getScrollProgress(el) {
  const rect = el.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const elementHeight = rect.height;

  const visibleBefore = viewportHeight - rect.top;
  const visibleAfter = rect.bottom;

  if (rect.top > viewportHeight) return 0; // not yet in view
  if (rect.bottom < 0) return 1; // completely scrolled past

  const total = elementHeight + viewportHeight;
  const visible = Math.min(visibleBefore, elementHeight, visibleAfter);
  return clamp(visible / total, 0, 1);
}

/**
 * Initialize scroll‑based effects (e.g., parallax, sticky nav)
 */
export function initScrollEffects() {
  // Update scrollY on each frame
  onScroll((y) => {
    scrollY = y;
  });

  // Add scroll‑based class to body for CSS hooks
  const scrollThreshold = 80;
  onScroll(() => {
    const past = isScrolledPast(scrollThreshold);
    document.body.classList.toggle('is-scrolled', past);
  }, 100);
}

// Export scrollY for direct access
export { scrollY };
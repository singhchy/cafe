/**
 * Main initialization script for V1
 * Orchestrates all modules and ensures proper loading order
 */

// Import global modules
import { debounce, lerp, clamp, isMobile } from "../../global/js/utils.js";
import { smoothScroll, scrollToSection } from "../../global/js/scroll.js";
import { Cursor } from "../../global/js/cursor.js";
import { initGSAP } from "../../global/animations/gsap-config.js";

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

// Import V1 modules
import { initHero } from "./v1-hero.js";
import { initMenu } from "./v1-menu.js";
import { initCounter } from "./v1-counter.js";
import { initTestimonial } from "./v1-testimonial.js";
import { initNavigation } from "./v1-navigation.js";
import { initSectionEntrances as initEntranceAnimations } from "../animations/v1-entrance.js";
import { initAllInteractions as initInteractions } from "../animations/v1-interactions.js";
import { initObserverScroll } from "./v1-observer-scroll.js";

class V1App {
  constructor() {
    this.cursor = null;
    this.isInitialized = false;
    this.modules = [];

    // Performance tracking
    this.startTime = performance.now();

    // Bind methods
    this.init = this.init.bind(this);
    this.onDOMReady = this.onDOMReady.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 150);
  }

  /**
   * Initialize the application
   */
  init() {
    if (this.isInitialized) return;

    console.log("🌿 Earthen Leaf V1 - Initializing...");

    if (!gsap || !ScrollTrigger) {
      console.error(
        "GSAP or ScrollTrigger is not available. Check script order and CDN loading.",
      );
      return;
    }

    gsap.defaults({
      ease: "power2.out",
      duration: 0.8,
    });

    // Initialize modules in order
    this.initModules();

    // Set up event listeners
    this.setupEvents();

    this.isInitialized = true;

    const initTime = performance.now() - this.startTime;
    console.log(`✅ V1 initialized in ${initTime.toFixed(1)}ms`);
  }

  /**
   * Initialize all modules
   */
  initModules() {
    // 1. Custom cursor (desktop only)
    if (!isMobile()) {
      this.cursor = new Cursor();
      this.modules.push(this.cursor);
    }

    // 2. Navigation
    initNavigation();

    // 3. Hero section
    initHero();

    // 4. Menu interactions
    initMenu();

    // 5. Counter animations
    initCounter();

    // 6. Testimonial slider
    initTestimonial();

    // 7. Entrance animations
    initEntranceAnimations();

    // 8. Micro-interactions
    initInteractions();

    // 9. Smooth scroll
    smoothScroll();

    // 10. Observer Scroll (Slideshow Mode)
    setTimeout(() => {
      initObserverScroll();
    }, 100);

    console.log(`📦 ${this.modules.length} modules initialized`);
  }

  /**
   * Set up event listeners
   */
  setupEvents() {
    window.addEventListener("resize", this.onResize);
    window.addEventListener("orientationchange", this.onResize);

    // Form submission
    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
      bookingForm.addEventListener("submit", this.handleBookingSubmit);
    }

    // Newsletter form
    const newsletterForm = document.querySelector(".newsletter-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", this.handleNewsletterSubmit);
    }
  }

  /**
   * Handle booking form submission
   */
  handleBookingSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Show loading state
    submitBtn.textContent = "Reserving...";
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Show success message
      const successMsg = document.createElement("div");
      successMsg.className = "form-success";
      successMsg.innerHTML = `
        <div class="success-icon">✓</div>
        <h3>Reservation Confirmed!</h3>
        <p>We'll send a confirmation email shortly.</p>
      `;

      form.parentNode.insertBefore(successMsg, form);
      form.style.display = "none";

      // Animate success message
      gsap.from(successMsg, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "back.out(1.2)",
      });

      console.log("📅 Booking submitted:", {
        name: form.name.value,
        date: form.date.value,
        guests: form.guests.value,
      });
    }, 1500);
  }

  /**
   * Handle newsletter subscription
   */
  handleNewsletterSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');

    if (!input.value || !input.value.includes("@")) {
      this.showFormError(form, "Please enter a valid email address.");
      return;
    }

    const originalText = button.textContent;
    button.textContent = "Subscribing...";
    button.disabled = true;

    // Simulate subscription
    setTimeout(() => {
      button.textContent = "Subscribed! ✓";
      button.style.backgroundColor = "var(--color-success)";

      // Reset after 2 seconds
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.backgroundColor = "";
        input.value = "";
      }, 2000);

      console.log("📧 Newsletter subscription:", input.value);
    }, 1000);
  }

  /**
   * Show form error with animation
   */
  showFormError(form, message) {
    // Remove existing error
    const existingError = form.querySelector(".form-error");
    if (existingError) existingError.remove();

    // Create error element
    const errorEl = document.createElement("div");
    errorEl.className = "form-error";
    errorEl.textContent = message;

    form.appendChild(errorEl);

    // Animate error
    gsap.from(errorEl, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: "power2.out",
    });

    // Remove after 5 seconds
    setTimeout(() => {
      if (errorEl.parentNode) {
        gsap.to(errorEl, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          onComplete: () => errorEl.remove(),
        });
      }
    }, 5000);
  }

  /**
   * Handle window resize
   */
  onResize() {
    console.log("🔄 Window resized");

    // Refresh ScrollTrigger
    if (ScrollTrigger) {
      ScrollTrigger.refresh();
    }

    // Notify modules if they have resize methods
    this.modules.forEach((module) => {
      if (module && typeof module.onResize === "function") {
        module.onResize();
      }
    });
  }

  /**
   * DOM ready handler
   */
  onDOMReady() {
    console.log("📄 DOM ready");
    // Can run DOM-dependent initialization here
  }

  /**
   * Window load handler
   */
  onLoad() {
    console.log("🚀 Window loaded");

    // Remove loading state if any
    const loadingEl = document.querySelector(".loading-screen");
    if (loadingEl) {
      gsap.to(loadingEl, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => loadingEl.remove(),
      });
    }

    // Start entrance animations
    gsap.delayedCall(0.3, () => {
      document.body.classList.add("loaded");
    });
  }

  /**
   * Clean up (for SPA transitions)
   */
  destroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("orientationchange", this.onResize);

    // Kill all GSAP animations
    gsap.killTweensOf("*");
    if (ScrollTrigger) {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }

    // Destroy modules
    this.modules.forEach((module) => {
      if (module && typeof module.destroy === "function") {
        module.destroy();
      }
    });

    this.modules = [];
    this.isInitialized = false;

    console.log("🧹 V1 destroyed");
  }
}

// Create and export singleton instance
const app = new V1App();

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", app.onDOMReady);
  window.addEventListener("load", app.onLoad);
} else {
  app.onDOMReady();
  if (document.readyState === "complete") {
    app.onLoad();
  } else {
    window.addEventListener("load", app.onLoad);
  }
}

// Start the app
app.init();

// Export for debugging
window.EarthenLeafV1 = app;

export default app;

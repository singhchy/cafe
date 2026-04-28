// Navigation sticky, mobile menu, scroll detection
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
import { isMobile } from "../../global/js/utils.js";

export function initNavigation() {
  const header = document.querySelector(".nav-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileOverlay = document.querySelector(".mobile-overlay");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (!header || !navToggle || !mobileOverlay) {
    console.error("Navigation elements not found");
    return;
  }

  // Mobile menu toggle
  navToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isActive = navToggle.classList.toggle("active");
    mobileOverlay.classList.toggle("active");
    header.classList.toggle("active", isActive);
    document.body.style.overflow = isActive ? "hidden" : "";
  });

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      mobileOverlay.classList.remove("active");
      header.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Sticky nav
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 80);
  });
}

// Auto-init as backup
if (document.readyState === "complete" || document.readyState === "interactive") {
  initNavigation();
} else {
  document.addEventListener("DOMContentLoaded", initNavigation);
}

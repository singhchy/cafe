// Menu card hover, tilt, parallax, button effects
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
import { tiltEffect } from "../../global/animations/gsap-config.js";
import { isMobile, isFinePointer } from "../../global/js/utils.js";

export function initMenu() {
  const menuSection = document.querySelector(".menu-section");
  if (!menuSection) return;

  // Section header reveal
  const header = menuSection.querySelector(".section-header");
  if (header) {
    gsap.from(header, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: header,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  }

  // Menu cards
  const menuCards = menuSection.querySelectorAll(".menu-card");
  menuCards.forEach((card, idx) => {
    // Entrance animation
    gsap.from(card, {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: idx * 0.1,
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });

    // Tilt effect on desktop with fine pointer
    if (!isMobile() && isFinePointer()) {
      tiltEffect(card, {
        maxRotation: 6,
        perspective: 1000,
        scale: 1.03,
        easing: "power2.out",
      });
    }

    // Button hover fill effect (CSS handles most, but we can add GSAP for extra)
    const buttons = card.querySelectorAll(".btn");
    buttons.forEach((btn) => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out",
        });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });
  });

  // "View All Menu" CTA arrow animation
  const viewAllBtn = menuSection.querySelector(".btn-arrow");
  if (viewAllBtn) {
    const arrow = document.createElement("span");
    arrow.className = "arrow-trail";
    viewAllBtn.appendChild(arrow);

    viewAllBtn.addEventListener("mouseenter", () => {
      gsap.to(arrow, {
        x: 10,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    viewAllBtn.addEventListener("mouseleave", () => {
      gsap.to(arrow, {
        x: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }

  // Horizontal scroll on mobile (if needed)
  if (isMobile()) {
    const menuCardsContainer = menuSection.querySelector(".menu-cards");
    if (menuCardsContainer) {
      let isDown = false;
      let startX;
      let scrollLeft;

      menuCardsContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - menuCardsContainer.offsetLeft;
        scrollLeft = menuCardsContainer.scrollLeft;
      });

      menuCardsContainer.addEventListener("mouseleave", () => {
        isDown = false;
      });

      menuCardsContainer.addEventListener("mouseup", () => {
        isDown = false;
      });

      menuCardsContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - menuCardsContainer.offsetLeft;
        const walk = (x - startX) * 2;
        menuCardsContainer.scrollLeft = scrollLeft - walk;
      });
    }
  }
}

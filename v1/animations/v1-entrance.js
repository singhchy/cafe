// Section entrance animations using ScrollTrigger
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
import { staggerEntrance } from "../../global/animations/gsap-config.js";

export function initSectionEntrances() {
  // Generic section entrance pattern
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    // Skip hero (handled separately)
    if (section.classList.contains("hero")) return;

    const header = section.querySelector(".section-header");
    const cards = section.querySelectorAll(
      ".feature-card, .menu-card, .blog-card",
    );
    const images = section.querySelectorAll("img");

    // Header entrance
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

    // Cards stagger
    if (cards.length) {
      staggerEntrance(cards, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        scrollTrigger: {
          trigger: cards[0].parentElement,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }

    // Images fade up
    if (images.length) {
      gsap.from(images, {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }
  });

  // Why Choose Us feature cards specific
  const featureCards = document.querySelectorAll(".feature-card");
  if (featureCards.length) {
    gsap.from(featureCards, {
      y: 60,
      opacity: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".why-choose",
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });
  }

  // About section split entrance
  const aboutGrid = document.querySelector(".about-grid");
  if (aboutGrid) {
    const left = aboutGrid.querySelector(".about-media");
    const right = aboutGrid.querySelector(".about-content");

    if (left) {
      gsap.from(left, {
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutGrid,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }

    if (right) {
      gsap.from(right, {
        x: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutGrid,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }
  }

  // Stats counter trigger (will be handled by v1-counter.js)
  const statsRow = document.querySelector(".stats-row");
  if (statsRow) {
    ScrollTrigger.create({
      trigger: statsRow,
      start: "top 80%",
      onEnter: () => {
        statsRow.classList.add("counted");
      },
    });
  }

  // Newsletter banner scale + fade
  const newsletter = document.querySelector(".newsletter-banner");
  if (newsletter) {
    gsap.from(newsletter, {
      scale: 0.95,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: newsletter,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }

  // Footer fade up
  const footer = document.querySelector("footer");
  if (footer) {
    gsap.from(footer, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footer,
        start: "top 95%",
        toggleActions: "play none none none",
      },
    });
  }
}

// Initialize all entrance animations
export function initAllEntrances() {
  // Register ScrollTrigger
  if (typeof ScrollTrigger !== "undefined") {
    ScrollTrigger.refresh();
  }

  initSectionEntrances();
  console.log("V1 entrance animations initialized");
}

// Section entrance animations using ScrollTrigger
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
import { staggerEntrance } from "../../global/animations/gsap-config.js";

export function initSectionEntrances() {
  // Global Reveal Pattern for all sections
  const sections = document.querySelectorAll(".section");
  
  sections.forEach((section) => {
    if (section.classList.contains("hero")) return;

    const header = section.querySelector(".section-header");
    const cards = section.querySelectorAll(".feature-card, .menu-card, .blog-card, .testimonial-card");
    const images = section.querySelectorAll(".menu-card-img img, .blog-card-img img, .about-media img, .marquee-item img");

    // 1. Sophisticated Section Header Reveal
    if (header) {
      const children = header.children;
      gsap.from(children, {
        y: 60,
        opacity: 0,
        skewY: 3,
        stagger: 0.2,
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }

    // 2. Premium Image Reveal (Ken Burns style entrance)
    if (images.length) {
      images.forEach((img) => {
        gsap.from(img, {
          scale: 1.5,
          filter: "blur(10px) brightness(0.5)",
          opacity: 0,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: img,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });
    }

    // 3. Staggered Card "Pop" Entrance
    if (cards.length) {
      gsap.from(cards, {
        y: 100,
        opacity: 0,
        scale: 0.9,
        stagger: 0.15,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: {
          trigger: cards[0],
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    }
  });

  // 4. About Section "Sliding" Reveal
  const aboutGrid = document.querySelector(".about-grid");
  if (aboutGrid) {
    const media = aboutGrid.querySelector(".about-media");
    const content = aboutGrid.querySelector(".about-content");

    if (media) {
      gsap.from(media, {
        x: -150,
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
        duration: 1.5,
        ease: "power4.inOut",
        scrollTrigger: {
          trigger: aboutGrid,
          start: "top 70%",
        },
      });
    }

    if (content) {
      gsap.from(content, {
        x: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out",
        delay: 0.3,
        scrollTrigger: {
          trigger: aboutGrid,
          start: "top 70%",
        },
      });
    }
  }

  // 5. Why Choose Us Feature Cards - 3D Spin Entrance
  const featureCards = document.querySelectorAll(".feature-card");
  if (featureCards.length) {
    gsap.from(featureCards, {
      rotationX: -45,
      y: 80,
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: ".why-choose",
        start: "top 75%",
      },
    });
  }

  // 6. Stats Counter Entrance
  const statsRow = document.querySelector(".stats-row");
  if (statsRow) {
    gsap.from(".flip-card", {
      opacity: 0,
      scale: 0.5,
      rotationY: 180,
      stagger: 0.15,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: statsRow,
        start: "top 85%",
        onEnter: () => statsRow.classList.add("counted")
      }
    });
  }

  // 7. Newsletter Banner Reveal
  const newsletter = document.querySelector(".newsletter-banner");
  if (newsletter) {
    gsap.from(newsletter, {
      y: 100,
      scale: 0.9,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: newsletter,
        start: "top 90%",
      },
    });
  }

  // 8. Footer "Slide Up" Reveal
  const footer = document.querySelector(".footer");
  if (footer) {
    gsap.from(footer, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: footer,
        start: "top 100%",
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

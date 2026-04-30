// Hero section animations: word split, floating images, magnetic button, leaf drift
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
import {
  magneticButton,
  floatAnimation,
} from "../../global/animations/gsap-config.js";
import { isMobile } from "../../global/js/utils.js";

export function initHero() {
  const heroSection = document.querySelector(".hero");
  if (!heroSection) return;

  // Split hero title into words
  const title = heroSection.querySelector(".hero-title");
  if (title) {
    const words = title.textContent.split(" ");
    title.innerHTML = words
      .map((word) => `<span class="word">${word}</span>`)
      .join(" ");
    const wordSpans = title.querySelectorAll(".word");

    gsap.from(wordSpans, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      stagger: 0.15,
      delay: 0.3,
    });
  }

  // Floating images with multi-directional entrance and "hanging" feel
  const floatingImgs = heroSection.querySelectorAll(".floating-img");
  floatingImgs.forEach((img, idx) => {
    // Custom starting positions for a dynamic entrance
    let startX = 0;
    let startY = 0;
    let startRotation = 0;

    if (idx === 0) { // img-1: from top-right
      startX = 100;
      startY = -200;
      startRotation = 15;
    } else if (idx === 1) { // img-2: from bottom-left
      startX = -200;
      startY = 100;
      startRotation = -15;
    } else { // img-3: from center-bottom
      startY = 150;
      startRotation = 5;
    }

    gsap.from(img, {
      x: startX,
      y: startY,
      rotation: startRotation,
      scale: 0.5,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
      delay: 0.5 + idx * 0.2,
    });

    // Continuous "Hanging" animation (Desktop only)
    if (!isMobile()) {
      // Gentle swing/rotation
      gsap.to(img, {
        rotation: idx % 2 === 0 ? 2 : -2,
        duration: 3 + idx * 0.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: idx * 0.5
      });
      
      // Vertical float with staggered duration
      floatAnimation(img, {
        y: 15 + idx * 4,
        duration: 4 + idx * 0.6,
        repeat: -1,
        yoyo: true,
        delay: idx * 0.3
      });
    }
  });

  // Leaf elements drift
  const leaves = heroSection.querySelectorAll(".leaf");
  leaves.forEach((leaf, idx) => {
    gsap.to(leaf, {
      rotation: 360,
      duration: 40 + idx * 10,
      repeat: -1,
      ease: "none",
    });

    gsap.to(leaf, {
      x: `+=${30 + idx * 10}`,
      y: `+=${20 + idx * 5}`,
      duration: 15 + idx * 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  // Magnetic button
  const magneticBtns = heroSection.querySelectorAll(".btn-magnetic");
  magneticBtns.forEach((btn) => {
    if (!isMobile()) {
      magneticButton(btn, 0.2);
    }
  });

  // Rating badge entrance
  const ratingBadge = heroSection.querySelector(".hero-rating");
  if (ratingBadge) {
    gsap.from(ratingBadge, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 1.2,
      scrollTrigger: {
        trigger: ratingBadge,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  }

  // Hero Parallax on Scroll
  floatingImgs.forEach((img, idx) => {
    gsap.to(img, {
      y: (idx + 1) * -100,
      ease: "none",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  });

  // ScrollTrigger for hero visibility
  ScrollTrigger.create({
    trigger: heroSection,
    start: "top top",
    end: "bottom top",
    onEnter: () => {
      heroSection.classList.add("hero-visible");
    },
    onLeaveBack: () => {
      heroSection.classList.remove("hero-visible");
    },
  });
}

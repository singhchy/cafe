// Hero section animations: word split, floating images, magnetic button, leaf drift
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
import { ScrollTrigger } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
import { magneticButton, floatAnimation } from '../../global/animations/gsap-config.js';
import { isMobile } from '../../global/js/utils.js';

export function initHero() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  // Split hero title into words
  const title = heroSection.querySelector('.hero-title');
  if (title) {
    const words = title.textContent.split(' ');
    title.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');
    const wordSpans = title.querySelectorAll('.word');
    
    gsap.from(wordSpans, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.15,
      delay: 0.3
    });
  }

  // Floating images
  const floatingImgs = heroSection.querySelectorAll('.floating-img');
  floatingImgs.forEach((img, idx) => {
    gsap.from(img, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.7)',
      delay: 0.5 + idx * 0.2
    });

    // Continuous floating animation
    if (!isMobile()) {
      floatAnimation(img, {
        y: 20 + idx * 5,
        duration: 3 + idx * 0.5,
        repeat: -1,
        yoyo: true
      });
    }
  });

  // Leaf elements drift
  const leaves = heroSection.querySelectorAll('.leaf');
  leaves.forEach((leaf, idx) => {
    gsap.to(leaf, {
      rotation: 360,
      duration: 40 + idx * 10,
      repeat: -1,
      ease: 'none'
    });
    
    gsap.to(leaf, {
      x: `+=${30 + idx * 10}`,
      y: `+=${20 + idx * 5}`,
      duration: 15 + idx * 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });

  // Magnetic button
  const magneticBtns = heroSection.querySelectorAll('.btn-magnetic');
  magneticBtns.forEach(btn => {
    if (!isMobile()) {
      magneticButton(btn, 0.2);
    }
  });

  // Rating badge entrance
  const ratingBadge = heroSection.querySelector('.hero-rating');
  if (ratingBadge) {
    gsap.from(ratingBadge, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 1.2,
      scrollTrigger: {
        trigger: ratingBadge,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  }

  // ScrollTrigger for hero section
  ScrollTrigger.create({
    trigger: heroSection,
    start: 'top top',
    end: 'bottom top',
    onEnter: () => {
      heroSection.classList.add('hero-visible');
    },
    onLeaveBack: () => {
      heroSection.classList.remove('hero-visible');
    }
  });
}
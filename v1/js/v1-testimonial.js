// Testimonial slider/marquee with GSAP
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
import { ScrollTrigger } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';

export function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  const track = slider?.querySelector('.slider-track');
  const cards = track?.querySelectorAll('.testimonial-card');
  const prevBtn = slider?.querySelector('.slider-prev');
  const nextBtn = slider?.querySelector('.slider-next');

  if (!slider || !track || !cards.length) {
    console.warn('Testimonial slider elements not found');
    return;
  }

  const cardCount = cards.length;
  const cardWidth = cards[0].offsetWidth + parseFloat(getComputedStyle(track).gap);
  let currentIndex = 0;
  let autoSlideInterval;

  // Set initial position
  gsap.set(track, { x: 0 });

  // Function to move slider
  function goToSlide(index, animate = true) {
    const clamped = (index + cardCount) % cardCount;
    currentIndex = clamped;
    const x = -currentIndex * cardWidth;

    if (animate) {
      gsap.to(track, {
        x,
        duration: 0.7,
        ease: 'power3.inOut',
        onUpdate: updateButtons
      });
    } else {
      gsap.set(track, { x });
      updateButtons();
    }
  }

  // Update button states
  function updateButtons() {
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= cardCount - 3; // assuming 3 visible
  }

  // Next/prev button handlers
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }

  // Auto‑advance every 5 seconds
  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);

  // Initialize
  updateButtons();
  startAutoSlide();

  // ScrollTrigger for section entrance
  const section = slider.closest('.testimonials');
  if (section) {
    gsap.from(section.querySelector('.section-header'), {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    gsap.from(cards, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: slider,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  // Responsive: adjust card width on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newCardWidth = cards[0].offsetWidth + parseFloat(getComputedStyle(track).gap);
      if (newCardWidth !== cardWidth) {
        // Re‑calculate and reposition
        goToSlide(currentIndex, false);
      }
    }, 250);
  });

  // Cleanup
  return () => {
    stopAutoSlide();
    slider.removeEventListener('mouseenter', stopAutoSlide);
    slider.removeEventListener('mouseleave', startAutoSlide);
    if (nextBtn) nextBtn.removeEventListener('click', () => goToSlide(currentIndex + 1));
    if (prevBtn) prevBtn.removeEventListener('click', () => goToSlide(currentIndex - 1));
    window.removeEventListener('resize', resizeTimer);
  };
}

// Marquee for Instagram gallery (horizontal auto‑scroll)
export function initInstagramMarquee() {
  const marquee = document.querySelector('.instagram-marquee');
  if (!marquee) return;

  const track = marquee.querySelector('.marquee-track');
  if (!track) return;

  const items = track.querySelectorAll('.marquee-item');
  if (items.length < 2) return;

  // Duplicate items for seamless loop
  items.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  const totalWidth = track.scrollWidth / 2; // because we duplicated
  const duration = totalWidth / 30; // pixels per second

  const tl = gsap.timeline({ repeat: -1 });
  tl.to(track, {
    x: -totalWidth,
    duration,
    ease: 'none',
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
    }
  });

  // Pause on hover
  marquee.addEventListener('mouseenter', () => tl.pause());
  marquee.addEventListener('mouseleave', () => tl.resume());
}

// Combined initialization for both testimonial slider and Instagram marquee
export function initTestimonial() {
  console.log('🎭 Initializing testimonial slider and Instagram marquee...');
  
  // Initialize testimonial slider
  const sliderCleanup = initTestimonialSlider();
  
  // Initialize Instagram marquee
  initInstagramMarquee();
  
  // Return cleanup function
  return () => {
    if (sliderCleanup) sliderCleanup();
    // Instagram marquee cleanup would need to be added if needed
  };
}
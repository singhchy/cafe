const gsap = window.gsap;

export function initTestimonial() {
  initTestimonialSlider();
  initInstagramMarquee();
}

export function initTestimonialSlider() {
  const slider = document.querySelector(".testimonial-slider");
  const track = slider?.querySelector(".slider-track");
  const originalCards = Array.from(track?.querySelectorAll(".testimonial-card") || []);
  const prevBtn = slider?.querySelector(".slider-prev");
  const nextBtn = slider?.querySelector(".slider-next");

  if (!slider || !track || !originalCards.length) return;

  // Clone items for infinite loop (before and after)
  originalCards.forEach(card => {
    track.prepend(card.cloneNode(true));
    track.appendChild(card.cloneNode(true));
  });

  const allCards = Array.from(track.querySelectorAll(".testimonial-card"));
  const originalCount = originalCards.length;
  let currentIndex = originalCount;
  let isTransitioning = false;

  const updateTrack = (animate = true) => {
    const cardWidth = allCards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = -(currentIndex * (cardWidth + gap));

    if (animate) {
      isTransitioning = true;
      gsap.to(track, {
        x: offset,
        duration: 0.7,
        ease: "power3.inOut",
        onComplete: () => {
          isTransitioning = false;
          if (currentIndex >= originalCount * 2) {
            currentIndex = originalCount;
            gsap.set(track, { x: -(currentIndex * (cardWidth + gap)) });
          } else if (currentIndex < originalCount) {
            currentIndex = originalCount * 2 - 1;
            gsap.set(track, { x: -(currentIndex * (cardWidth + gap)) });
          }
        }
      });
    } else {
      gsap.set(track, { x: offset });
    }
  };

  const nextSlide = () => { if (!isTransitioning) { currentIndex++; updateTrack(); } };
  const prevSlide = () => { if (!isTransitioning) { currentIndex--; updateTrack(); } };

  nextBtn?.addEventListener("click", (e) => { e.preventDefault(); nextSlide(); });
  prevBtn?.addEventListener("click", (e) => { e.preventDefault(); prevSlide(); });

  let autoSlide = setInterval(nextSlide, 5000);
  slider.addEventListener("mouseenter", () => clearInterval(autoSlide));
  slider.addEventListener("mouseleave", () => {
    clearInterval(autoSlide);
    autoSlide = setInterval(nextSlide, 5000);
  });

  window.addEventListener("load", () => updateTrack(false));
  window.addEventListener("resize", () => updateTrack(false));
  setTimeout(() => updateTrack(false), 500);
}

export function initInstagramMarquee() {
  const marquee = document.querySelector(".instagram-marquee");
  const track = marquee?.querySelector(".marquee-track");
  if (!marquee || !track) return;

  const items = Array.from(track.querySelectorAll(".marquee-item"));
  items.forEach(item => track.appendChild(item.cloneNode(true)));

  const totalWidth = track.scrollWidth / 2;
  const duration = totalWidth / 40;

  const tl = gsap.timeline({ repeat: -1 });
  tl.to(track, {
    x: -totalWidth,
    duration,
    ease: "none",
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
    }
  });

  marquee.addEventListener("mouseenter", () => tl.pause());
  marquee.addEventListener("mouseleave", () => tl.resume());
}

// Auto-init as backup
if (document.readyState === "complete" || document.readyState === "interactive") {
  initTestimonial();
} else {
  window.addEventListener("load", initTestimonial);
}

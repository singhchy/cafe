/* ─── NAV ─────────────────────────────────────────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const nav = document.getElementById("nav");
const links = document.querySelectorAll(".mobile-link");
let open = false;

const navTl = gsap.timeline({ paused: true });
navTl
  .to(menu, { opacity: 1, pointerEvents: "all", duration: 0.35, ease: "power2.out" })
  .to(menu, { scale: 1, duration: 0.5, ease: "power3.out" }, "<")
  .to(links, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" }, "-=0.25");

hamburger.addEventListener("click", () => {
  open = !open;
  open ? navTl.play() : navTl.reverse();
  gsap.to(".line:nth-child(1)", { rotate: open ? 45 : 0, y: open ? 8.75 : 0, duration: 0.3 });
  gsap.to(".line:nth-child(2)", { opacity: open ? 0 : 1, duration: 0.2 });
  gsap.to(".line:nth-child(3)", { rotate: open ? -45 : 0, y: open ? -8.75 : 0, duration: 0.3 });

  if (open) {
    if (window.lenis) window.lenis.stop();
    document.body.style.overflow = "hidden";
  } else {
    if (window.lenis) window.lenis.start();
    document.body.style.overflow = "";
  }
});

links.forEach((link) => {
  link.addEventListener("click", () => { 
    open = false; 
    navTl.reverse(); 
    gsap.to(".line:nth-child(1)", { rotate: 0, y: 0, duration: 0.3 });
    gsap.to(".line:nth-child(2)", { opacity: 1, duration: 0.2 });
    gsap.to(".line:nth-child(3)", { rotate: 0, y: 0, duration: 0.3 });

    if (window.lenis) window.lenis.start();
    document.body.style.overflow = "";
  });
});

let lastScrollY = window.scrollY;
window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > 50) {
    nav.classList.add("scrolled");
    if (currentScrollY > lastScrollY && !open) {
      nav.classList.add("nav-hidden");
    } else {
      nav.classList.remove("nav-hidden");
    }
  } else {
    nav.classList.remove("scrolled", "nav-hidden");
  }
  lastScrollY = currentScrollY;
});

/* ─── HERO SLIDESHOW ─────────────────────────────────────────────────────────
 *
 *  Two-image cross-fade strategy:
 *  ┌──────────────────────────────────────────────────────────────────────┐
 *  │  .image-mask                                                         │
 *  │  ├─ #foodImage     (bottom layer, current slide, opacity: 1)        │
 *  │  └─ #foodImageNext (top layer,    next slide,    opacity: 0)        │
 *  └──────────────────────────────────────────────────────────────────────┘
 *
 *  Cycle (5 s total):
 *   0.0 s  → outline begins drawing in                  [1.8 s]
 *   1.8 s  → outline fully drawn, image holds
 *   3.5 s  → cross-fade starts: next fades IN, current fades OUT [0.9 s]
 *   4.4 s  → swap complete; pointers swap; outline resets
 *   4.4 s  → brief pause before next cycle starts at 5.0 s
 *
 * ─────────────────────────────────────────────────────────────────────────── */

const SLIDE_IMAGES = [
  "/assets/img/image1.webp",
  "/assets/img/image2.webp",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=900&q=80",
];

const CYCLE = 5.0;
const DRAW_DUR = 1.8;
const XFADE_START = 3.5;
const XFADE_DUR = 0.9;

let slideIndex = 0;

let imgCurrent = document.getElementById("foodImage");
let imgNext = document.getElementById("foodImageNext");

if (imgCurrent && imgNext) {
  gsap.set(imgNext, { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0, zIndex: 1 });
  gsap.set(imgCurrent, { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 1, zIndex: 0 });
}

if (typeof DrawSVGPlugin !== "undefined") {
  gsap.registerPlugin(DrawSVGPlugin);
}

const outlinePath = document.querySelector(".outline-path");

function preload(src) {
  const img = new Image();
  img.src = src;
}

function runSlide() {
  const nextIndex = (slideIndex + 1) % SLIDE_IMAGES.length;
  preload(SLIDE_IMAGES[(nextIndex + 1) % SLIDE_IMAGES.length]);
  imgNext.src = SLIDE_IMAGES[nextIndex];

  const tl = gsap.timeline({
    onComplete: () => {
      slideIndex = nextIndex;
      gsap.set(imgCurrent, { opacity: 0, zIndex: 0 });
      gsap.set(imgNext, { opacity: 1, zIndex: 0 });
      [imgCurrent, imgNext] = [imgNext, imgCurrent];
      gsap.set(imgNext, { zIndex: 1, opacity: 0 });
      runSlide();
    },
  });

  if (outlinePath && typeof DrawSVGPlugin !== "undefined") {
    tl.fromTo(
      outlinePath,
      { drawSVG: "0%", opacity: 1 },
      { drawSVG: "100%", duration: DRAW_DUR, ease: "power2.inOut" },
      0
    );
  }

  tl.to(imgNext, { opacity: 1, duration: XFADE_DUR, ease: "power2.inOut" }, XFADE_START);
  tl.to(imgCurrent, { opacity: 0, duration: XFADE_DUR, ease: "power2.inOut" }, XFADE_START);

  if (outlinePath) {
    tl.to(outlinePath, { opacity: 0, duration: XFADE_DUR * 0.6, ease: "power1.in" }, XFADE_START);
  }

  const holdDur = CYCLE - (XFADE_START + XFADE_DUR);
  if (holdDur > 0) tl.to({}, { duration: holdDur });
}

if (imgCurrent && imgNext) {
  gsap.delayedCall(0.8, runSlide);
}

/* ─── MENU ITEMS ANIMATION (STAGGERED INTERSECTION OBSERVER) ─────────────── */
const menuObserver = new IntersectionObserver((entries) => {
  let delay = 0;
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains("in-view")) {
      entry.target.style.transitionDelay = `${delay}s`;
      entry.target.classList.add("in-view");
      delay += 0.15;
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll('.menu-anim-item').forEach(el => {
  menuObserver.observe(el);
});

/* ─── PACKAGE SCROLLSPY TABS ─────────────────────────────────────────────── */
const tabBtns = document.querySelectorAll('.tab-btn');
const menuCategories = document.querySelectorAll('.menu-category');

tabBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const targetCategory = document.getElementById(btn.getAttribute('data-target'));
    if (targetCategory) targetCategory.scrollIntoView({ behavior: 'smooth' });
  });
});

const categoryObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      tabBtns.forEach(b => b.classList.remove('active'));
      const activeBtn = document.querySelector(`.tab-btn[data-target="${entry.target.id}"]`);
      if (activeBtn) activeBtn.classList.add('active');
    }
  });
}, { rootMargin: "-40% 0px -50% 0px" });

menuCategories.forEach(c => categoryObserver.observe(c));

/* ─── SERVICES SLIDER MOUSE ANIMATION ───────────────────────────────────── */
const servicesSection = document.querySelector('.services-section');
const sliderTrack = document.getElementById('sliderTrack');

if (servicesSection && sliderTrack) {
  servicesSection.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const windowWidth = window.innerWidth;
    const mousePercent = mouseX / windowWidth;

    const trackWidth = sliderTrack.scrollWidth;
    const maxMove = Math.max(0, trackWidth - windowWidth + 200);
    const targetX = -maxMove * mousePercent + 100;

    gsap.to(sliderTrack, {
      x: targetX,
      duration: 2,
      ease: "power2.out",
      overwrite: "auto"
    });
  });
}

/* ─── NATIVE IMAGE PARALLAX (NO SCROLLTRIGGER) ─────────────────────────── */
function initNativeParallax() {
  const parallaxItems = document.querySelectorAll('[data-speed]');
  if (!parallaxItems.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    parallaxItems.forEach(item => {
      const speed = parseFloat(item.getAttribute('data-speed')) || 0.1;
      const rect = item.getBoundingClientRect();
      const itemTop = rect.top + scrollY;
      
      // Calculate distance from center of viewport
      const viewportCenter = scrollY + (window.innerHeight / 2);
      const itemCenter = itemTop + (rect.height / 2);
      const distance = viewportCenter - itemCenter;
      
      // Apply transform based on speed
      const yPos = distance * speed;
      item.style.transform = `translateY(${yPos}px)`;
    });
  }, { passive: true });
}

/* ─── HOVER VIDEO INTERACTION ─────────────────────────────────────────── */
function initHoverVideo() {
    const video = document.getElementById('hoverVideo');
    if (!video) return;

    const section = video.closest('.video-section');
    
    section.addEventListener('mouseenter', () => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                console.log("Video is playing");
            }).catch(error => {
                console.error("Autoplay was prevented:", error);
            });
        }
    });

    section.addEventListener('mouseleave', () => {
        video.pause();
    });
}

/* ─── TESTIMONIAL SLIDER ──────────────────────────────────────────────── */
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const items = document.querySelectorAll('.testimonial-item');
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');
    
    if (!track || items.length === 0) return;

    let currentIndex = 0;

    function updateSlider() {
        gsap.to(track, {
            xPercent: -100 * currentIndex,
            duration: 0.5,
            ease: "power2.inOut"
        });
    }

    if(nextBtn) nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateSlider();
    });

    if(prevBtn) prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateSlider();
    });
}

/* ─── SECTION FADE ON SCROLL ───────────────────────────────────────────── */
function initSectionFade() {
    const sections = document.querySelectorAll('.section');
    if (!sections.length) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {
            if (index === sections.length - 1) return; // Last section doesn't fade out

            const nextSection = sections[index + 1];
            const nextTop = nextSection.offsetTop;
            const distanceToTop = nextTop - scrollY;

            if (distanceToTop <= windowHeight && distanceToTop >= 0) {
                const progress = distanceToTop / windowHeight;
                
                // Steeper opacity curve for a more "atmospheric" fade
                section.style.opacity = (progress * progress).toString();
                
                // "Pushing inside" effect: Scale down slightly as it recedes
                const scale = 0.92 + (0.08 * progress);
                // We keep it centered and stick it to the top
                section.style.transform = `scale(${scale})`;
                section.style.transformOrigin = 'center center';
                
            } else if (distanceToTop > windowHeight) {
                section.style.opacity = '1';
                section.style.transform = 'scale(1)';
            } else if (distanceToTop < 0) {
                section.style.opacity = '0';
                section.style.transform = 'scale(0.92)';
            }
        });
    }, { passive: true });
}

// Initialize all custom components
document.addEventListener('DOMContentLoaded', () => {
    initNativeParallax();
    initHoverVideo();
    initTestimonialSlider();
    initSectionFade();
});

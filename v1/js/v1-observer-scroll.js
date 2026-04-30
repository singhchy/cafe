/**
 * Observer-based fullscreen section scrolling
 * Adapted from GreenSock Observer demo
 */
const gsap = window.gsap;
const Observer = window.Observer;

export function initObserverScroll() {
  // Only enable for desktop and larger tablets
  if (window.innerWidth < 1024) {
    console.log("ℹ️ Observer Scroll disabled on mobile");
    return;
  }

  if (!gsap || !Observer) {
    console.warn("⚠️ GSAP or Observer plugin not found");
    return;
  }

  // Register plugin
  gsap.registerPlugin(Observer);

  const sections = document.querySelectorAll(".section");
  if (!sections.length) {
    console.warn("⚠️ No sections found for Observer Scroll");
    return;
  }

  console.log(`🚀 Initializing Observer Scroll with ${sections.length} sections...`);

  // Add active class to body
  document.body.classList.add("slideshow-active");

  // Prepare each section by wrapping its content non-destructively
  sections.forEach((section) => {
    section.classList.add("fullscreen-slide");
    
    // Create wrappers
    const outer = document.createElement("div");
    outer.className = "slide-outer";
    const inner = document.createElement("div");
    inner.className = "slide-inner";
    const contentWrap = document.createElement("div");
    contentWrap.className = "slide-content-wrap";
    
    // Move existing content into wrappers
    while (section.firstChild) {
      contentWrap.appendChild(section.firstChild);
    }
    
    inner.appendChild(contentWrap);
    outer.appendChild(inner);
    section.appendChild(outer);
  });

  const outerWrappers = gsap.utils.toArray(".slide-outer");
  const innerWrappers = gsap.utils.toArray(".slide-inner");
  const sectionSlides = gsap.utils.toArray(".fullscreen-slide");
  const wrap = gsap.utils.wrap(0, sectionSlides.length);
  
  let currentIndex = -1;
  let animating = false;

  // Set initial states
  gsap.set(outerWrappers, { yPercent: 100 });
  gsap.set(innerWrappers, { yPercent: -100 });
  gsap.set(sectionSlides, { autoAlpha: 0, zIndex: 0 });

  function gotoSection(index, direction) {
    if (animating || index === currentIndex) return;
    
    index = wrap(index);
    animating = true;
    
    const fromTop = direction === -1;
    const dFactor = fromTop ? -1 : 1;
    
    const tl = gsap.timeline({
      defaults: { duration: 1.25, ease: "power2.inOut" },
      onComplete: () => {
        animating = false;
      }
    });

    // Animate current section out
    if (currentIndex >= 0) {
      gsap.set(sectionSlides[currentIndex], { zIndex: 1 });
      tl.to(sectionSlides[currentIndex], { 
        autoAlpha: 0,
        duration: 0.8
      }, 0);
    }

    // Animate new section in
    gsap.set(sectionSlides[index], { autoAlpha: 1, zIndex: 10 });
    
    tl.fromTo([outerWrappers[index], innerWrappers[index]], 
      { 
        yPercent: i => i ? -100 * dFactor : 100 * dFactor
      }, 
      { 
        yPercent: 0,
        duration: 1.25
      }, 0
    );

    // Directional Content Reveal
    const contentElements = sectionSlides[index].querySelectorAll(".section-title, .section-subtitle, .badge, .feature-card, .menu-card, .blog-card, .about-content, .about-media, .hero-content, .hero-images");
    
    if (contentElements.length) {
      tl.fromTo(contentElements, {
        y: 60 * dFactor,
        opacity: 0,
        skewY: 2 * dFactor
      }, {
        y: 0,
        opacity: 1,
        skewY: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all"
      }, 0.5);
    }

    currentIndex = index;
  }

  // Create Observer
  Observer.create({
    type: "wheel,touch,pointer",
    wheelSpeed: -1,
    onDown: () => !animating && gotoSection(currentIndex - 1, -1),
    onUp: () => !animating && gotoSection(currentIndex + 1, 1),
    tolerance: 10,
    preventDefault: true
  });

  // Handle Navigation Links
  const navLinks = document.querySelectorAll('.nav-link, .nav-logo, .footer-links a, .nav-cta, a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (!targetId || targetId === '') {
           e.preventDefault();
           gotoSection(0, -1);
           return;
        }
        
        const targetIndex = Array.from(sectionSlides).findIndex(s => s.id === targetId || s.classList.contains(targetId));
        
        if (targetIndex !== -1) {
          console.log(`🔗 Navigating to slide ${targetIndex} (#${targetId})`);
          e.preventDefault();
          const direction = targetIndex > currentIndex ? 1 : -1;
          gotoSection(targetIndex, direction);
        }
      }
    });
  });

  // Initial Hash Check
  const hash = window.location.hash;
  if (hash) {
    const targetId = hash.substring(1);
    const targetIndex = Array.from(sectionSlides).findIndex(s => s.id === targetId);
    if (targetIndex !== -1) {
      console.log(`📍 Starting at hashed section: ${targetId}`);
      gotoSection(targetIndex, 1);
    } else {
      gotoSection(0, 1);
    }
  } else {
    gotoSection(0, 1);
  }
}

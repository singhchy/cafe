(function () {
  const slides = [
    {
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&auto=format&fit=crop&q=80",
      video: "",
      label: "Explore the Benefits of Hot Yoga",
      headline: "Transform Your Mind and Body with Daily Yoga",
      btn: "Know more",
    },
    {
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&auto=format&fit=crop&q=80",
      video: "",
      label: "Discover Ancient Healing",
      headline: "Restore Balance with Ayurveda Therapy",
      btn: "Learn more",
    },
    {
      image:
        "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1600&auto=format&fit=crop&q=80",
      video: "",
      label: "Find Your Inner Peace",
      headline: "Breathe. Release. Renew Your Soul.",
      btn: "Explore now",
    },
    {
      image:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1600&auto=format&fit=crop&q=80",
      video: "",
      label: "Holistic Treatment Programs",
      headline: "Your Journey to Wellness Starts Here",
      btn: "Book now",
    },
  ];

  const DURATION = 5000;
  const EXIT_DUR = 600; // how long exit animation takes
  const ENTER_GAP = 120; // pause between exit finish and enter start
  const STAGGER = 200; // ms between each element entering

  const bgA = document.getElementById("heroBgA");
  const bgB = document.getElementById("heroBgB");
  const videoEl = document.getElementById("heroVideo");
  const labelEl = document.getElementById("heroLabel");
  const headlineEl = document.getElementById("heroHeadline");
  const btnEl = document.getElementById("heroBtn");
  const tabs = Array.from(document.querySelectorAll(".ay-hero__tab"));
  const header = document.getElementById("ayHeader");

  if (!bgA || !bgB) return;

  let current = 0;
  let activeLayer = bgA;
  let rafId = null;
  let startTime = null;
  let isAnimating = false;

  // ── HEADER SCROLL — hide on scroll down, show on scroll up
  let lastScrollY = 0;
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY <= 80) {
      // at top — transparent, no bg
      header.classList.remove("is-scrolled", "is-hidden");
    } else if (scrollY > lastScrollY + 5) {
      // scrolling down — hide
      header.classList.add("is-hidden");
      header.classList.remove("is-scrolled");
    } else if (scrollY < lastScrollY - 5) {
      // scrolling up — show with bg
      header.classList.remove("is-hidden");
      header.classList.add("is-scrolled");
    }
    lastScrollY = scrollY;
  });

  // ── CROSSFADE BG
  function crossfade(slide) {
    if (slide.video) {
      videoEl.src = slide.video;
      videoEl.play().catch(() => { });
      videoEl.classList.add("is-active");
      bgA.classList.remove("is-active");
      bgB.classList.remove("is-active");
    } else {
      videoEl.classList.remove("is-active");
      const next = activeLayer === bgA ? bgB : bgA;
      const prev = activeLayer;
      next.style.backgroundImage = `url('${slide.image}')`;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          next.classList.add("is-active");
          prev.classList.remove("is-active");
          activeLayer = next;
        }),
      );
    }
  }

  // ── UPDATE CONTENT
  function updateContent(slide) {
    labelEl.textContent = slide.label;
    headlineEl.textContent = slide.headline;
    const icon = btnEl.querySelector("i");
    btnEl.textContent = slide.btn + " ";
    if (icon) btnEl.appendChild(icon);
  }

  const els = () => [labelEl, headlineEl, btnEl];

  // ── EXIT — all slide up & fade out together
  function exit() {
    els().forEach((el) => {
      el.classList.remove("hero-enter");
      void el.offsetWidth;
      el.classList.add("hero-exit");
    });
  }

  // ── ENTER — each drops in from top, one by one with stagger
  function enter() {
    els().forEach((el, i) => {
      setTimeout(() => {
        el.classList.remove("hero-exit");
        void el.offsetWidth;
        el.classList.add("hero-enter");
      }, i * STAGGER);
    });
  }

  // ── INIT ENTER (page load — no exit, just enter)
  function initEnter() {
    els().forEach((el, i) => {
      setTimeout(
        () => {
          el.classList.add("hero-enter");
        },
        200 + i * STAGGER,
      );
    });
  }

  // ── CHANGE SLIDE
  function goTo(index) {
    if (isAnimating) return;
    isAnimating = true;

    // reset tabs
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.querySelector(".ay-hero__tab-progress").style.width = "0%";
    });

    // 1. EXIT
    exit();

    setTimeout(() => {
      // 2. SWAP content + bg
      current = index;
      tabs[current]?.classList.add("active");
      updateContent(slides[current]);
      crossfade(slides[current]);

      setTimeout(() => {
        // 3. ENTER serially
        enter();
        isAnimating = false;
      }, ENTER_GAP);
    }, EXIT_DUR);

    startProgress();
  }

  // ── PROGRESS
  function startProgress() {
    cancelAnimationFrame(rafId);
    startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min((elapsed / DURATION) * 100, 100);
      const activeTab = tabs[current];
      if (activeTab)
        activeTab.querySelector(".ay-hero__tab-progress").style.width =
          progress + "%";
      if (progress < 100) rafId = requestAnimationFrame(tick);
      else {
        const next = (current + 1) % slides.length;
        goTo(next);
      }
    }
    rafId = requestAnimationFrame(tick);
  }

  // ── TAB CLICKS
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      if (i === current) return;
      cancelAnimationFrame(rafId);
      goTo(i);
    });
  });

  // ── INIT
  bgA.style.backgroundImage = `url('${slides[0].image}')`;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => bgA.classList.add("is-active")),
  );
  updateContent(slides[0]);
  tabs[0]?.classList.add("active");
  initEnter();
  startProgress();
})();
// SIDEBAR

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarOverlay = document.getElementById("sidebarOverlay");

// ── OPEN ─────────────────────────────────
function openSidebar() {
  sidebar.classList.add("is-open");
  sidebarToggle.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

// ── CLOSE ────────────────────────────────
function closeSidebar() {
  sidebar.classList.remove("is-open");
  sidebarToggle.classList.remove("is-open");
  document.body.style.overflow = "";
}

// ── EVENTS ───────────────────────────────
sidebarToggle.addEventListener("click", () => {
  sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
});

sidebarClose.addEventListener("click", closeSidebar);

// click on the blurred overlay (left of panel) closes sidebar
sidebarOverlay.addEventListener("click", (e) => {
  // only close if clicking the overlay itself, not the panel
  if (
    e.target === sidebarOverlay ||
    e.target.classList.contains("sidebar__blur-bg")
  ) {
    closeSidebar();
  }
});

// Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeSidebar();
});

// ── ACTIVE LINK ──────────────────────────
document.querySelectorAll(".sidebar__link").forEach((link) => {
  link.addEventListener("click", function () {
    document
      .querySelectorAll(".sidebar__link")
      .forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  });
});

// ── AUTO-CLOSE ON DESKTOP RESIZE ─────────
// Prevents sidebar staying open if user drags window wider than breakpoint
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeSidebar();
  }
});

// team js
(function () {
  const slider = document.getElementById("teamSlider");
  const btnPrev = document.getElementById("teamPrev");
  const btnNext = document.getElementById("teamNext");
  if (!slider || !btnPrev || !btnNext) return;

  // clone all cards and append for infinite loop
  const origCards = Array.from(slider.querySelectorAll(".ay-team__card"));
  const total = origCards.length;

  // clone set at end and beginning
  origCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    slider.appendChild(clone);
  });
  origCards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    slider.insertBefore(clone, slider.firstChild);
  });

  const allCards = Array.from(slider.querySelectorAll(".ay-team__card"));
  const GAP = 20;
  let current = total; // start at first real card (after clones)
  let isAnimating = false;

  function getVisible() {
    if (window.innerWidth <= 525) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getCardWidth() {
    return allCards[0].offsetWidth + GAP;
  }

  // jump without animation (for infinite reset)
  function jumpTo(index) {
    slider.style.transition = "none";
    current = index;
    slider.style.transform = `translateX(-${getCardWidth() * current}px)`;
  }

  // animate to index
  function slideTo(index) {
    if (isAnimating) return;
    isAnimating = true;
    current = index;
    slider.style.transition = "transform 0.55s cubic-bezier(0.16,1,0.3,1)";
    slider.style.transform = `translateX(-${getCardWidth() * current}px)`;
  }

  slider.addEventListener("transitionend", () => {
    isAnimating = false;
    // if past the last real card — jump to first real
    if (current >= total * 2) {
      jumpTo(total);
    }
    // if before the first real card — jump to last real
    if (current < total) {
      jumpTo(total * 2 - getVisible());
    }
  });

  btnNext.addEventListener("click", () => slideTo(current + 1));
  btnPrev.addEventListener("click", () => slideTo(current - 1));

  // init styles
  slider.style.display = "flex";
  slider.style.overflow = "visible";
  slider.parentElement.style.overflow = "hidden";

  function init() {
    jumpTo(total);
  }

  window.addEventListener("resize", init);
  init();
})();

// package js
(function () {
  const track = document.getElementById("pkTrack");
  const btnPrev = document.getElementById("pkPrev");
  const btnNext = document.getElementById("pkNext");
  if (!track || !btnPrev || !btnNext) return;

  const slides = Array.from(track.querySelectorAll(".ay-pkslider__slide"));
  const total = slides.length;
  const GAP = 20;
  let current = 0;
  let isAnim = false;

  function getSlideW() {
    return slides[0].offsetWidth + GAP;
  }

  function getCenterOffset() {
    const vw = track.parentElement.offsetWidth;
    const slideW = slides[0].offsetWidth;
    return (vw - slideW) / 2;
  }

  function update(animate = true) {
    track.style.transition = animate
      ? "transform 0.65s cubic-bezier(0.16,1,0.3,1)"
      : "none";

    const offset = getCenterOffset() - current * getSlideW();
    track.style.transform = `translateX(${offset}px)`;

    slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
  }

  function goTo(index) {
    if (isAnim) return;
    isAnim = true;
    current = ((index % total) + total) % total;
    update(true);
    setTimeout(() => {
      isAnim = false;
    }, 700);
  }

  btnNext.addEventListener("click", () => goTo(current + 1));
  btnPrev.addEventListener("click", () => goTo(current - 1));

  // click side slides to go to them
  slides.forEach((s, i) => {
    s.addEventListener("click", () => {
      if (i !== current) goTo(i);
    });
  });

  // drag
  let dragStartX = 0,
    dragging = false;

  track.addEventListener("mousedown", (e) => {
    dragging = true;
    dragStartX = e.clientX;
    track.style.transition = "none";
    track.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    const diff = e.clientX - dragStartX;
    const offset = getCenterOffset() - current * getSlideW() + diff;
    track.style.transform = `translateX(${offset}px)`;
  });

  window.addEventListener("mouseup", (e) => {
    if (!dragging) return;
    dragging = false;
    track.style.cursor = "";
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 60) goTo(diff < 0 ? current + 1 : current - 1);
    else update(true);
    isAnim = false;
  });

  // touch
  let touchStartX = 0;
  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener("resize", () => update(false));

  // start at index 1 so left side always has a neighbour
  current = 1;
  update(false);
})();

// testi js
(function () {
  const slider = document.getElementById("testiSlider");
  if (!slider) return;

  const origCards = Array.from(slider.querySelectorAll(".ay-testi__card"));
  const total = origCards.length;
  const GAP = 20;
  const AUTO_DELAY = 2500;

  let current = total;
  let isAnimating = false;
  let autoTimer = null;

  // ── clone for infinite loop ──
  origCards.forEach((c) => slider.appendChild(c.cloneNode(true)));
  origCards.forEach((c) =>
    slider.insertBefore(c.cloneNode(true), slider.firstChild),
  );

  const allCards = Array.from(slider.querySelectorAll(".ay-testi__card"));

  function getVisible() {
    if (window.innerWidth <= 525) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getCardWidth() {
    return allCards[0].offsetWidth + GAP;
  }

  function jumpTo(index) {
    slider.style.transition = "none";
    current = index;
    slider.style.transform = `translateX(-${getCardWidth() * current}px)`;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        slider.style.transition = "transform 0.55s cubic-bezier(0.16,1,0.3,1)";
      }),
    );
  }

  function goTo(index) {
    if (isAnimating) return;
    isAnimating = true;
    current = index;
    slider.style.transform = `translateX(-${getCardWidth() * current}px)`;
  }

  slider.addEventListener("transitionend", () => {
    isAnimating = false;
    if (current >= total * 2) jumpTo(total);
    if (current < total) jumpTo(total * 2 - getVisible());
  });

  // ── auto play ──
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), AUTO_DELAY);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  // ── drag (mouse) ──
  let dragStartX = 0;
  let dragCurrent = 0;
  let isDragging = false;

  slider.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragCurrent = getCardWidth() * current;
    slider.style.transition = "none";
    slider.style.cursor = "grabbing";
    stopAuto();
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStartX;
    slider.style.transform = `translateX(-${dragCurrent - diff}px)`;
  });

  window.addEventListener("mouseup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    slider.style.cursor = "";
    slider.style.transition = "transform 0.55s cubic-bezier(0.16,1,0.3,1)";
    const diff = e.clientX - dragStartX;
    if (Math.abs(diff) > 60) {
      goTo(diff < 0 ? current + 1 : current - 1);
    } else {
      slider.style.transform = `translateX(-${getCardWidth() * current}px)`;
      isAnimating = false;
    }
    startAuto();
  });

  // ── swipe (touch) ──
  let touchStartX = 0;

  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    },
    { passive: true },
  );

  slider.addEventListener(
    "touchmove",
    (e) => {
      if (!touchStartX) return;
      const diff = touchStartX - e.touches[0].clientX;
      slider.style.transition = "none";
      slider.style.transform = `translateX(-${getCardWidth() * current + diff}px)`;
    },
    { passive: true },
  );

  slider.addEventListener("touchend", (e) => {
    slider.style.transition = "transform 0.55s cubic-bezier(0.16,1,0.3,1)";
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
    } else {
      slider.style.transform = `translateX(-${getCardWidth() * current}px)`;
      isAnimating = false;
    }
    touchStartX = 0;
    startAuto();
  });

  // pause on hover
  slider.addEventListener("mouseenter", stopAuto);
  slider.addEventListener("mouseleave", startAuto);

  function init() {
    jumpTo(total);
    startAuto();
  }

  window.addEventListener("resize", init);
  init();
})();

// about js
(function () {
  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  // observe counters — animate when visible
  const counters = document.querySelectorAll(
    ".ay-about__counter-num, .ay-about__stat-num",
  );
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );

  counters.forEach((el) => observer.observe(el));
})();

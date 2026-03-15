//banner js with animations and floating petals
const colors = ["#d4c9c0", "#c8d4c4", "#d4c8d0", "#c4ccd4"];
for (let i = 0; i < 14; i++) {
  const p = document.createElement("div");
  p.className = "petal";
  const size = 8 + Math.random() * 14;
  p.style.cssText = `
    width:${size}px;
    height:${size}px;
    left:${Math.random() * 100}vw;
    background:${colors[Math.floor(Math.random() * colors.length)]};
    animation-duration:${14 + Math.random() * 18}s;
    animation-delay:${Math.random() * 12}s;
  `;
  document.body.appendChild(p);
}

// ── SLIDER DATA
const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600",
    headline: "Transform Body, Transform Soul",
    sub: "Discover a sanctuary where movement meets mindfulness. Every breath brings you closer to the life you deserve.",
    btn: "Read More",
  },
  {
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600",
    headline: "Find Your Inner Rhythm",
    sub: "Flow through each session with intention and grace. Movement is medicine — and it starts right here.",
    btn: "Explore Classes",
  },
  {
    image:
      "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8eW9nYXxlbnwwfHwwfHx8MA%3D%3D",
    headline: "Breathe. Release. Renew.",
    sub: "Step into stillness and rediscover the power that lives within every exhale.",
    btn: "Begin Today",
  },
];

// ── ELEMENT REFS ─────────────────────────────────────────
const layerA = document.getElementById("imgBgA");
const layerB = document.getElementById("imgBgB");
const flowerBg = document.querySelector(".flower-bg");
const headline = document.querySelector(".headline");
const divider = document.querySelector(".divider");
const subtext = document.querySelector(".subtext");
const btnWrap = document.querySelector(".btn-wrap");
const btnLink = document.querySelector(".btn");
const btnPrev = document.querySelector(".nav-btn.prev");
const btnNext = document.querySelector(".nav-btn.next");

const elements = [flowerBg, headline, divider, subtext, btnWrap];

let current = 0;
let activeLayer = layerA; // which layer is currently on top
let isAnimating = false;

function crossfadeImage(url) {
  const next = activeLayer === layerA ? layerB : layerA;
  const prev = activeLayer;

  // load the new image on the inactive layer
  next.style.backgroundImage = `url('${url}')`;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.classList.add("is-active");
      prev.classList.remove("is-active");
      activeLayer = next;
    });
  });
}

// ── RENDER TEXT ──────────────────────────────────────────
function renderText(idx) {
  const s = slides[idx];
  headline.textContent = s.headline;
  subtext.textContent = s.sub;
  btnLink.childNodes[0].textContent = s.btn + " ";
}

// ── CHANGE SLIDE ─────────────────────────────────────────
function changeSlide(direction) {
  if (isAnimating) return;
  isAnimating = true;
  document.body.classList.add("is-animating");

  // 1. EXIT — elements hide upward
  elements.forEach((el) => {
    el.classList.remove("rise-up");
    void el.offsetWidth;
    el.classList.add("hide-down");
  });

  setTimeout(() => {
    // 2. SWAP — crossfade image + update text
    current =
      direction === "next"
        ? (current + 1) % slides.length
        : (current - 1 + slides.length) % slides.length;

    crossfadeImage(slides[current].image);
    renderText(current);

    setTimeout(() => {
      // 3. RE-ENTER — elements rise from below
      elements.forEach((el) => {
        el.classList.remove("hide-down");
        void el.offsetWidth;
        el.classList.add("rise-up");
      });

      setTimeout(() => {
        isAnimating = false;
        document.body.classList.remove("is-animating");
      }, 1600);
    }, 120);
  }, 1050);
}

// ── ARROWS ───────────────────────────────────────────────
btnNext.addEventListener("click", () => changeSlide("next"));
btnPrev.addEventListener("click", () => changeSlide("prev"));

// ── INIT — show first image ──────────────────────────────
layerA.style.backgroundImage = `url('${slides[0].image}')`;
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    layerA.classList.add("is-active");
  });
});
renderText(0);

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

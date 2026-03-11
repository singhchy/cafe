// ANIMATIONS.JS — global scroll & reveal
// Depends on: Lenis (loaded via CDN below)
//
// HOW TO USE:
//   Add to any element:
//     data-reveal="up"     — rises from below  (default)
//     data-reveal="down"   — drops from above
//     data-reveal="left"   — slides from left
//     data-reveal="right"  — slides from right
//     data-reveal="fade"   — fades only
//     data-reveal="scale"  — scales up
//     data-delay="200"     — delay in ms (0,100,200...1000)
//
//   Text reveal:
//     Add class="text-reveal" to any heading or paragraph
//     JS will split it into lines automatically
//
//   Counter:
//     Add data-count="500" to any element — counts up to that number on reveal

// ─── LENIS SMOOTH SCROLL ─────────────────
let lenis;

function initLenis() {
  // Lenis must be loaded via CDN in your HTML:
  // <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js"></script>
  if (typeof Lenis === "undefined") {
    console.warn("Lenis not found — falling back to native scroll");
    return;
  }

  lenis = new Lenis({
    duration: 1.1, // scroll duration feel
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false, // native on touch devices
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // expose globally so other scripts can pause/resume
  window.lenis = lenis;
}

// ─── SCROLL REVEAL ───────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -48px 0px", // trigger slightly before fully in view
    },
  );

  els.forEach((el) => observer.observe(el));
}

// ─── AUTO DIRECTION (left / right by position) ───
// Elements in the left half of the page get data-reveal="left"
// Elements in the right half get data-reveal="right"
// Only applies to elements with data-reveal="auto"

function initAutoDirection() {
  const els = document.querySelectorAll('[data-reveal="auto"]');
  const mid = window.innerWidth / 2;

  els.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    el.setAttribute("data-reveal", center < mid ? "left" : "right");
  });
}

// ─── TEXT REVEAL ─────────────────────────
// Splits .text-reveal elements into per-line spans

function initTextReveal() {
  const els = document.querySelectorAll(".text-reveal");
  if (!els.length) return;

  els.forEach((el) => {
    // skip if already split
    if (el.querySelector(".text-reveal__line")) return;

    const original = el.innerHTML;
    el.innerHTML = "";

    // create a temporary element to measure line breaks
    const temp = document.createElement("div");
    temp.style.cssText = `
      position: absolute;
      visibility: hidden;
      width: ${el.offsetWidth}px;
      font: ${getComputedStyle(el).font};
      letter-spacing: ${getComputedStyle(el).letterSpacing};
    `;
    temp.innerHTML = original;
    document.body.appendChild(temp);

    // split by words, group into visual lines
    const words = original.split(/(\s+)/);
    const lineEls = [];
    let lineEl = document.createElement("span");
    lineEl.className = "text-reveal__line";
    let testEl = document.createElement("span");
    testEl.style.cssText =
      "position:absolute;visibility:hidden;white-space:nowrap";
    document.body.appendChild(testEl);

    let currentLine = "";
    words.forEach((word) => {
      const test = currentLine + word;
      testEl.textContent = test;
      if (testEl.offsetWidth > el.offsetWidth && currentLine.trim()) {
        lineEl.textContent = currentLine.trim();
        lineEls.push(lineEl);
        lineEl = document.createElement("span");
        lineEl.className = "text-reveal__line";
        currentLine = word;
      } else {
        currentLine = test;
      }
    });

    // last line
    if (currentLine.trim()) {
      lineEl.textContent = currentLine.trim();
      lineEls.push(lineEl);
    }

    document.body.removeChild(temp);
    document.body.removeChild(testEl);

    lineEls.forEach((l) => el.appendChild(l));
  });

  // observe text-reveal elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -32px 0px",
    },
  );

  els.forEach((el) => observer.observe(el));
}

// ─── HEADER SCROLL STATE ─────────────────
function initHeaderScroll() {
  const header = document.querySelector(".ay-header");
  if (!header) return;

  const threshold = 20;

  function update() {
    const scrollY = lenis ? lenis.scroll : window.scrollY;
    header.classList.toggle("is-scrolled", scrollY > threshold);
  }

  if (lenis) {
    lenis.on("scroll", update);
  } else {
    window.addEventListener("scroll", update, { passive: true });
  }

  update(); // run once on load
}

// ─── COUNTER ANIMATION ───────────────────
function initCounters() {
  const els = document.querySelectorAll("[data-count]");
  if (!els.length) return;

  function animateCount(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const duration = 1400; // ms
    const suffix = el.getAttribute("data-count-suffix") || "";
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  els.forEach((el) => observer.observe(el));
}

// ─── INIT ────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initAutoDirection();
  initLenis();
  // slight delay so Lenis is ready before we hook scroll events
  requestAnimationFrame(() => {
    initScrollReveal();
    initTextReveal();
    initHeaderScroll();
    initCounters();
  });
});

// BACK TO TOP — wave fills with scroll progress

(function () {
  const btn = document.getElementById("backToTop");
  const wavePath = btn?.querySelector(".ay-btt__wave-path");
  if (!btn || !wavePath) return;

  const W = 56; // svg viewBox width
  const H = 56; // svg viewBox height
  const R = 26; // circle radius (matches clipPath)

  // generate a wavy fill path that rises from bottom
  // fillY = Y position of the wave's midline (0 = full, H = empty)
  function buildWavePath(fillY, time) {
    const amp = 3.5; // wave amplitude
    const freq = (2 * Math.PI) / W; // one full wave across width
    const phase = time * 0.04; // animate wave horizontally

    let d = `M 0 ${H} `; // start bottom-left

    // top wavy edge — left to right
    for (let x = 0; x <= W; x += 2) {
      const y =
        fillY +
        Math.sin(x * freq + phase) * amp +
        Math.sin(x * freq * 1.7 + phase * 0.8) * (amp * 0.4);
      d += `L ${x} ${y} `;
    }

    d += `L ${W} ${H} Z`; // close to bottom-right then bottom-left
    return d;
  }

  let animFrame;
  let tick = 0;
  let currentFillY = H;
  let targetFillY = H;

  function animateWave() {
    tick++;
    // smooth interpolation toward target
    currentFillY += (targetFillY - currentFillY) * 0.08;
    wavePath.setAttribute("d", buildWavePath(currentFillY, tick));
    animFrame = requestAnimationFrame(animateWave);
  }

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

    // show/hide button
    if (scrollTop > 200) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }

    // wave rises as progress increases
    // fillY: H (empty at 0%) → 0 (full at 100%)
    targetFillY = H - progress * H;

    // flip arrow color when >50% filled
    if (progress > 0.5) {
      btn.classList.add("is-filled");
    } else {
      btn.classList.remove("is-filled");
    }
  }

  // scroll to top on click
  btn.addEventListener("click", () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // use lenis scroll event if available, else native
  function hookScroll() {
    if (window.lenis) {
      window.lenis.on("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    onScroll(); // run once on load
  }

  // start wave animation loop
  animateWave();

  // hook after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hookScroll);
  } else {
    // slight delay to let lenis init first
    setTimeout(hookScroll, 200);
  }
})();

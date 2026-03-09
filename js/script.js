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

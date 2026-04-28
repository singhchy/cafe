// Stats counter animation (scroll‑triggered number count‑up)
import { gsap } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
import { ScrollTrigger } from 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';

export function initCounter() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count') || counter.textContent, 10);
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';
    
    // Set initial value to 0
    counter.textContent = '0';

    // Create ScrollTrigger
    ScrollTrigger.create({
      trigger: counter.closest('.stats-row') || counter,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          innerText: target,
          duration: 2.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function() {
            const value = Math.floor(this.targets()[0].innerText);
            counter.textContent = prefix + value + suffix;
          }
        });
      }
    });
  });
}

// Alternative: batch animation for all counters in a section
export function initCounterBatch(container = '.stats-row') {
  const row = document.querySelector(container);
  if (!row) return;

  const counters = row.querySelectorAll('.stat-number');
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: row,
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  counters.forEach((counter, idx) => {
    const target = parseInt(counter.getAttribute('data-count') || counter.textContent, 10);
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';
    
    counter.textContent = '0';

    tl.to(counter, {
      innerText: target,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      onUpdate: function() {
        const value = Math.floor(this.targets()[0].innerText);
        counter.textContent = prefix + value + suffix;
      }
    }, idx * 0.2);
  });
}
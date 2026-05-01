// Custom cursor with GSAP ticker
import { lerp, clamp, isFinePointer, isMobile } from './utils.js';

class CustomCursor {
  constructor() {
    // Only enable on desktop with fine pointer
    if (isMobile() || !isFinePointer()) {
      this.disable();
      return;
    }

    this.DOM = {
      cursor: null,
      follower: null
    };

    this.state = {
      mouseX: 0,
      mouseY: 0,
      cursorX: 0,
      cursorY: 0,
      followerX: 0,
      followerY: 0,
      scale: 1,
      followerScale: 1,
      isHoveringButton: false,
      isHoveringCard: false,
      isActive: true
    };

    this.settings = {
      ease: 0.15,          // cursor follow speed
      followerEase: 0.08,  // follower follow speed
      buttonScale: 3.67,   // 44px / 12px ≈ 3.67
      cardLabel: 'VIEW',
      cardScale: 2.5
    };

    this.init();
  }

  /**
   * Initialize cursor elements and events
   */
  init() {
    // Create cursor elements
    this.DOM.cursor = document.createElement('div');
    this.DOM.cursor.className = 'cursor';
    this.DOM.follower = document.createElement('div');
    this.DOM.follower.className = 'cursor-follower';

    // Append to body
    document.body.appendChild(this.DOM.cursor);
    document.body.appendChild(this.DOM.follower);

    // Set initial styles
    Object.assign(this.DOM.cursor.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: 'var(--v1-primary)',
      pointerEvents: 'none',
      zIndex: 'var(--z-cursor)',
      transform: 'translate(-50%, -50%)',
      willChange: 'transform',
      mixBlendMode: 'normal',
      transition: 'background-color 0.2s ease, mix-blend-mode 0.2s ease'
    });

    Object.assign(this.DOM.follower.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '4px',
      height: '4px',
      borderRadius: '50%',
      backgroundColor: 'var(--v1-accent)',
      pointerEvents: 'none',
      zIndex: 'var(--z-cursor)',
      transform: 'translate(-50%, -50%)',
      willChange: 'transform'
    });

    // Bind event listeners
    this.bindEvents();
    // Start animation loop
    this.animate();
  }

  /**
   * Bind mouse and hover events
   */
  bindEvents() {
    window.addEventListener('mousemove', (e) => {
      this.state.mouseX = e.clientX;
      this.state.mouseY = e.clientY;
    });

    // Hover over buttons
    const buttons = document.querySelectorAll('button, a[href], .btn, .cta');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => this.onButtonEnter());
      btn.addEventListener('mouseleave', () => this.onButtonLeave());
    });

    // Hover over menu cards
    const cards = document.querySelectorAll('.menu-card, .food-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => this.onCardEnter());
      card.addEventListener('mouseleave', () => this.onCardLeave());
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => this.hide());
    document.addEventListener('mouseenter', () => this.show());
  }

  /**
   * Animation loop using GSAP ticker (or requestAnimationFrame)
   */
  animate() {
    const update = () => {
      // Lerp cursor position
      this.state.cursorX = lerp(this.state.cursorX, this.state.mouseX, this.settings.ease);
      this.state.cursorY = lerp(this.state.cursorY, this.state.mouseY, this.settings.ease);

      // Lerp follower position
      this.state.followerX = lerp(this.state.followerX, this.state.mouseX, this.settings.followerEase);
      this.state.followerY = lerp(this.state.followerY, this.state.mouseY, this.settings.followerEase);

      // Apply transforms
      this.DOM.cursor.style.transform = `translate(${this.state.cursorX}px, ${this.state.cursorY}px) scale(${this.state.scale})`;
      this.DOM.follower.style.transform = `translate(${this.state.followerX}px, ${this.state.followerY}px) scale(${this.state.followerScale})`;

      // Continue loop
      requestAnimationFrame(update);
    };

    // Use GSAP ticker if available
    if (window.gsap && gsap.ticker) {
      gsap.ticker.add(update);
    } else {
      requestAnimationFrame(update);
    }
  }

  /**
   * Handle button hover enter
   */
  onButtonEnter() {
    this.state.isHoveringButton = true;
    this.state.scale = this.settings.buttonScale;
    this.DOM.cursor.style.mixBlendMode = 'difference';
    this.DOM.cursor.style.backgroundColor = '#FFF';
  }

  /**
   * Handle button hover leave
   */
  onButtonLeave() {
    this.state.isHoveringButton = false;
    this.state.scale = 1;
    this.DOM.cursor.style.mixBlendMode = 'normal';
    this.DOM.cursor.style.backgroundColor = 'var(--v1-primary)';
  }

  /**
   * Handle card hover enter
   */
  onCardEnter() {
    this.state.isHoveringCard = true;
    this.state.scale = this.settings.cardScale;
    this.DOM.cursor.textContent = this.settings.cardLabel;
    this.DOM.cursor.style.width = '60px';
    this.DOM.cursor.style.height = '60px';
    this.DOM.cursor.style.backgroundColor = 'var(--v1-accent)';
    this.DOM.cursor.style.color = 'var(--v1-surface)';
    this.DOM.cursor.style.display = 'flex';
    this.DOM.cursor.style.alignItems = 'center';
    this.DOM.cursor.style.justifyContent = 'center';
    this.DOM.cursor.style.fontSize = '0.7rem';
    this.DOM.cursor.style.fontWeight = '600';
    this.DOM.cursor.style.letterSpacing = '0.05em';
  }

  /**
   * Handle card hover leave
   */
  onCardLeave() {
    this.state.isHoveringCard = false;
    this.state.scale = 1;
    this.DOM.cursor.textContent = '';
    this.DOM.cursor.style.width = '12px';
    this.DOM.cursor.style.height = '12px';
    this.DOM.cursor.style.backgroundColor = 'var(--v1-primary)';
    this.DOM.cursor.style.color = '';
    this.DOM.cursor.style.display = '';
    this.DOM.cursor.style.alignItems = '';
    this.DOM.cursor.style.justifyContent = '';
    this.DOM.cursor.style.fontSize = '';
    this.DOM.cursor.style.fontWeight = '';
    this.DOM.cursor.style.letterSpacing = '';
  }

  /**
   * Hide cursor
   */
  hide() {
    this.state.isActive = false;
    this.DOM.cursor.style.opacity = '0';
    this.DOM.follower.style.opacity = '0';
  }

  /**
   * Show cursor
   */
  show() {
    this.state.isActive = true;
    this.DOM.cursor.style.opacity = '1';
    this.DOM.follower.style.opacity = '1';
  }

  /**
   * Disable custom cursor (fallback to default)
   */
  disable() {
    document.body.style.cursor = 'auto';
    // Add class to body for CSS hooks
    document.body.classList.add('cursor-disabled');
  }

  /**
   * Update settings
   * @param {Object} newSettings - Partial settings object
   */
  updateSettings(newSettings) {
    Object.assign(this.settings, newSettings);
  }

  /**
   * Destroy cursor and clean up
   */
  destroy() {
    if (this.DOM.cursor && this.DOM.cursor.parentNode) {
      this.DOM.cursor.parentNode.removeChild(this.DOM.cursor);
    }
    if (this.DOM.follower && this.DOM.follower.parentNode) {
      this.DOM.follower.parentNode.removeChild(this.DOM.follower);
    }
    // Remove event listeners if needed
  }
}

// Export singleton instance
let instance = null;

export function initCursor() {
  if (!instance) {
    instance = new CustomCursor();
  }
  return instance;
}

export function getCursor() {
  return instance;
}

export function destroyCursor() {
  if (instance) {
    instance.destroy();
    instance = null;
  }
}
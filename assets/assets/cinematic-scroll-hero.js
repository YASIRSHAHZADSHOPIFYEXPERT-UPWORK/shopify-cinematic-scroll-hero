/**
 * Cinematic Scroll Hero - JavaScript
 * Version: 1.0.0
 * Description: GSAP-powered cinematic scroll animation controller
 * License: MIT
 * Dependencies: GSAP 3.x, ScrollTrigger plugin
 */

class CinematicScrollHero {
  /**
   * Initialize a new CinematicScrollHero instance
   * @param {HTMLElement} section - The section DOM element
   */
  constructor(section) {
    // Store references
    this.section = section;
    this.sectionId = section.dataset.sectionId;
    
    // DOM elements
    this.container = section.querySelector('.cinematic__container');
    this.layers = section.querySelectorAll('.cinematic__layer');
    this.heading = section.querySelector('.cinematic__heading');
    this.subheading = section.querySelector('.cinematic__subheading');
    this.richText = section.querySelector('.cinematic__rich-text');
    this.ctas = section.querySelector('.cinematic__ctas');
    this.cards = section.querySelector('.cinematic__cards');
    this.scrollIndicator = section.querySelector('.cinematic__scroll-indicator');
    
    // Settings from data attributes
    this.animationEnabled = section.dataset.animationEnabled === 'true';
    this.floatingEnabled = section.dataset.floatingEnabled === 'true';
    
    // Animation state
    this.timeline = null;
    this.scrollTrigger = null;
    this.floatingAnimation = null;
    this.isInitialized = false;
    this.isDestroyed = false;
    
    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);
    
    // Initialize
    this.init();
  }
  
  /**
   * Initialize the cinematic hero
   */
  init() {
    if (this.isDestroyed) return;
    
    // Check for GSAP availability
    if (typeof gsap === 'undefined') {
      console.warn('GSAP is not loaded. Cinematic Scroll Hero requires GSAP.');
      this.fallbackInit();
      return;
    }
    
    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    } else {
      console.warn('ScrollTrigger plugin is not available. Scroll animations disabled.');
      this.fallbackInit();
      return;
    }
    
    // Set initial state
    this.setInitialState();
    
    // Build animations if enabled
    if (this.animationEnabled) {
      this.buildTimeline();
      this.buildFloatingAnimation();
    }
    
    // Mark as initialized
    this.section.classList.add('is-initialized');
    this.isInitialized = true;
    
    // Add event listeners
    this.addEventListeners();
    
    // Dispatch custom event
    this.section.dispatchEvent(new CustomEvent('cinematic:initialized', {
      detail: { sectionId: this.sectionId }
    }));
  }
  
  /**
   * Set initial state for GSAP animations
   */
  setInitialState() {
    if (!this.animationEnabled) {
      // Show content immediately if animations are disabled
      this.showContentImmediately();
      return;
    }
    
    // Position layers at their start positions
    this.layers.forEach((layer) => {
      const startPosition = layer.dataset.startPosition || 'center';
      const direction = layer.dataset.direction || 'none';
      
      // Apply initial transform based on start position
      gsap.set(layer, { clearProps: 'all' });
      
      // Store initial transform for animation
      layer._initialTransform = this.getInitialTransform(startPosition, direction);
    });
    
    // Set content hidden states
    if (this.heading) {
      gsap.set(this.heading, { opacity: 0, y: 30 });
    }
    if (this.subheading) {
      gsap.set(this.subheading, { opacity: 0, y: 20 });
    }
    if (this.richText) {
      gsap.set(this.richText, { opacity: 0, y: 20 });
    }
    if (this.ctas) {
      gsap.set(this.ctas, { opacity: 0, y: 20 });
    }
    if (this.cards) {
      gsap.set(this.cards, { opacity: 0, y: 20 });
    }
  }
  
  /**
   * Get initial transform values for a layer
   * @param {string} position - Start position
   * @param {string} direction - Animation direction
   * @returns {Object} Transform values
   */
  getInitialTransform(position, direction) {
    const spread = this.getCSSVariable('--cinematic-layer-spread') || 80;
    const rotation = this.getCSSVariable('--cinematic-rotation-amount') || 3;
    
    const transforms = {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 0.8
    };
    
    // Apply rotation based on position
    if (position.includes('left')) transforms.rotation = rotation;
    if (position.includes('right')) transforms.rotation = -rotation;
    
    // Apply offset based on direction
    switch (direction) {
      case 'left':
        transforms.x = -spread * 2;
        break;
      case 'right':
        transforms.x = spread * 2;
        break;
      case 'top':
        transforms.y = -spread * 2;
        break;
      case 'bottom':
        transforms.y = spread * 2;
        break;
      case 'none':
        transforms.scale = 1;
        break;
    }
    
    return transforms;
  }
  
  /**
   * Build the main GSAP timeline
   */
  buildTimeline() {
    const scrollSpeed = this.getCSSVariable('--cinematic-scroll-speed') || 1;
    const duration = 1.5 * scrollSpeed;
    
    // Create timeline
    this.timeline = gsap.timeline({
      defaults: {
        ease: 'power2.inOut',
        duration: duration
      }
    });
    
    // Animate layers
    this.layers.forEach((layer, index) => {
      const initialTransform = layer._initialTransform;
      
      if (initialTransform) {
        this.timeline.to(layer, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: duration * (1 + index * 0.2)
        }, 0);
      }
    });
    
    // Animate content
    if (this.heading) {
      this.timeline.to(this.heading, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, 0.3);
    }
    
    if (this.subheading) {
      this.timeline.to(this.subheading, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, 0.5);
    }
    
    if (this.richText) {
      this.timeline.to(this.richText, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, 0.6);
    }
    
    if (this.ctas) {
      this.timeline.to(this.ctas, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, 0.8);
    }
    
    if (this.cards) {
      this.timeline.to(this.cards, {
        opacity: 1,
        y: 0,
        duration: 0.8
      }, 1);
    }
    
    // Create ScrollTrigger
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.section,
      start: 'top top',
      end: 'bottom top',
      animation: this.timeline,
      scrub: 1,
      pin: false,
      anticipatePin: 1,
      onUpdate: (self) => {
        this.handleScrollUpdate(self.progress);
      },
      onLeave: () => {
        this.section.classList.add('is-scrolled');
      },
      onEnterBack: () => {
        this.section.classList.remove('is-scrolled');
      }
    });
  }
  
  /**
   * Build floating animation for layers
   */
  buildFloatingAnimation() {
    if (!this.floatingEnabled) return;
    
    const intensity = this.getCSSVariable('--cinematic-floating-intensity') || 20;
    
    this.layers.forEach((layer, index) => {
      const delay = index * 0.5;
      const duration = 3 + index * 0.5;
      
      gsap.to(layer, {
        y: `-=${intensity * 0.5}`,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay
      });
      
      gsap.to(layer, {
        x: `${(index % 2 === 0 ? 1 : -1) * intensity * 0.3}`,
        duration: duration * 1.3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: delay + 0.3
      });
    });
  }
  
  /**
   * Handle scroll update
   * @param {number} progress - Scroll progress (0-1)
   */
  handleScrollUpdate(progress) {
    // Hide scroll indicator when scrolling starts
    if (progress > 0.05 && this.scrollIndicator) {
      gsap.to(this.scrollIndicator, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    } else if (progress <= 0.05 && this.scrollIndicator) {
      gsap.to(this.scrollIndicator, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }
  
  /**
   * Show content immediately (fallback for no animation)
   */
  showContentImmediately() {
    if (this.heading) {
      this.heading.style.opacity = '1';
      this.heading.style.transform = 'translateY(0)';
    }
    if (this.subheading) {
      this.subheading.style.opacity = '1';
      this.subheading.style.transform = 'translateY(0)';
    }
    if (this.richText) {
      this.richText.style.opacity = '1';
      this.richText.style.transform = 'translateY(0)';
    }
    if (this.ctas) {
      this.ctas.style.opacity = '1';
      this.ctas.style.transform = 'translateY(0)';
    }
    if (this.cards) {
      this.cards.style.opacity = '1';
      this.cards.style.transform = 'translateY(0)';
    }
  }
  
  /**
   * Fallback initialization without GSAP
   */
  fallbackInit() {
    this.showContentImmediately();
    this.section.classList.add('is-initialized');
    this.isInitialized = true;
  }
  
  /**
   * Add event listeners
   */
  addEventListeners() {
    // Handle window resize
    this.resizeTimeout = null;
    window.addEventListener('resize', this.handleResize, { passive: true });
    
    // Handle Shopify theme editor events
    if (typeof Shopify !== 'undefined' && Shopify.designMode) {
      document.addEventListener('shopify:section:load', this.handleSectionLoad.bind(this));
      document.addEventListener('shopify:section:unload', this.handleSectionUnload.bind(this));
      document.addEventListener('shopify:section:select', this.handleSectionSelect.bind(this));
      document.addEventListener('shopify:section:deselect', this.handleSectionDeselect.bind(this));
      document.addEventListener('shopify:block:select', this.handleBlockSelect.bind(this));
      document.addEventListener('shopify:block:deselect', this.handleBlockDeselect.bind(this));
    }
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    if (this.isDestroyed) return;
    
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      // Refresh ScrollTrigger
      if (this.scrollTrigger) {
        ScrollTrigger.refresh();
      }
      
      // Dispatch resize event
      this.section.dispatchEvent(new CustomEvent('cinematic:resize', {
        detail: { sectionId: this.sectionId }
      }));
    }, 250);
  }
  
  /**
   * Handle Shopify section load
   */
  handleSectionLoad(event) {
    if (event.detail.sectionId === this.sectionId) {
      this.destroy();
      this.init();
    }
  }
  
  /**
   * Handle Shopify section unload
   */
  handleSectionUnload(event) {
    if (event.detail.sectionId === this.sectionId) {
      this.destroy();
    }
  }
  
  /**
   * Handle Shopify section select
   */
  handleSectionSelect(event) {
    if (event.detail.sectionId === this.sectionId) {
      this.section.classList.add('is-selected');
      
      // Refresh ScrollTrigger
      if (this.scrollTrigger) {
        ScrollTrigger.refresh();
      }
    }
  }
  
  /**
   * Handle Shopify section deselect
   */
  handleSectionDeselect(event) {
    if (event.detail.sectionId === this.sectionId) {
      this.section.classList.remove('is-selected');
    }
  }
  
  /**
   * Handle Shopify block select
   */
  handleBlockSelect(event) {
    if (event.detail.sectionId === this.sectionId) {
      // Refresh on block selection
      if (this.scrollTrigger) {
        setTimeout(() => ScrollTrigger.refresh(), 100);
      }
    }
  }
  
  /**
   * Handle Shopify block deselect
   */
  handleBlockDeselect(event) {
    if (event.detail.sectionId === this.sectionId) {
      // Refresh on block deselection
      if (this.scrollTrigger) {
        setTimeout(() => ScrollTrigger.refresh(), 100);
      }
    }
  }
  
  /**
   * Get CSS custom property value
   * @param {string} property - CSS custom property name
   * @returns {number|null} Parsed numeric value
   */
  getCSSVariable(property) {
    const value = getComputedStyle(this.section).getPropertyValue(property).trim();
    const numericValue = parseFloat(value);
    return isNaN(numericValue) ? null : numericValue;
  }
  
  /**
   * Clean up and destroy the instance
   */
  destroy() {
    if (this.isDestroyed) return;
    
    // Kill ScrollTrigger
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }
    
    // Kill timeline
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
    
    // Kill any GSAP animations on layers
    if (typeof gsap !== 'undefined') {
      this.layers.forEach((layer) => {
        gsap.killTweensOf(layer);
      });
      
      if (this.heading) gsap.killTweensOf(this.heading);
      if (this.subheading) gsap.killTweensOf(this.subheading);
      if (this.richText) gsap.killTweensOf(this.richText);
      if (this.ctas) gsap.killTweensOf(this.ctas);
      if (this.cards) gsap.killTweensOf(this.cards);
      if (this.scrollIndicator) gsap.killTweensOf(this.scrollIndicator);
    }
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    
    if (typeof Shopify !== 'undefined' && Shopify.designMode) {
      document.removeEventListener('shopify:section:load', this.handleSectionLoad);
      document.removeEventListener('shopify:section:unload', this.handleSectionUnload);
      document.removeEventListener('shopify:section:select', this.handleSectionSelect);
      document.removeEventListener('shopify:section:deselect', this.handleSectionDeselect);
      document.removeEventListener('shopify:block:select', this.handleBlockSelect);
      document.removeEventListener('shopify:block:deselect', this.handleBlockDeselect);
    }
    
    // Clear timeout
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    // Remove classes
    this.section.classList.remove('is-initialized', 'is-scrolled', 'is-selected');
    
    // Dispatch destroyed event
    this.section.dispatchEvent(new CustomEvent('cinematic:destroyed', {
      detail: { sectionId: this.sectionId }
    }));
    
    // Mark as destroyed
    this.isDestroyed = true;
    this.isInitialized = false;
  }
}

/**
 * Initialize all cinematic scroll hero sections on the page
 */
function initializeCinematicHeroes() {
  const sections = document.querySelectorAll('.cinematic[data-section-id]');
  
  sections.forEach((section) => {
    // Prevent duplicate initialization
    if (section._cinematicHero) {
      section._cinematicHero.destroy();
    }
    
    // Create new instance and store reference
    section._cinematicHero = new CinematicScrollHero(section);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCinematicHeroes);
} else {
  initializeCinematicHeroes();
}

// Support dynamic section rendering in Theme Editor
if (typeof Shopify !== 'undefined' && Shopify.designMode) {
  document.addEventListener('shopify:section:load', (event) => {
    const section = document.querySelector(`#cinematic-${event.detail.sectionId}`);
    if (section && !section._cinematicHero) {
      section._cinematicHero = new CinematicScrollHero(section);
    }
  });
}

// Export for external use
if (typeof window !== 'undefined') {
  window.CinematicScrollHero = CinematicScrollHero;
  window.initializeCinematicHeroes = initializeCinematicHeroes;
}

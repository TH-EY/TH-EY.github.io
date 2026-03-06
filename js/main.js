document.addEventListener('DOMContentLoaded', () => {

  // =============================================================
  // 1. SCROLL-TRIGGERED ANIMATIONS
  // =============================================================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {
    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // one-time trigger
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => scrollObserver.observe(el));
  }


  // =============================================================
  // 2. STICKY NAVIGATION
  // =============================================================
  const siteHeader = document.querySelector('.site-header');
  const heroSection = document.querySelector('#hero');

  if (siteHeader && heroSection) {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          siteHeader.classList.remove('scrolled');
        } else {
          siteHeader.classList.add('scrolled');
        }
      });
    }, {
      threshold: 0
    });

    headerObserver.observe(heroSection);
  }


  // =============================================================
  // 3. MOBILE NAVIGATION
  // =============================================================
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  const body = document.body;

  /**
   * Close the mobile navigation menu and reset all related state.
   */
  function closeMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  /**
   * Open the mobile navigation menu.
   */
  function openMobileNav() {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.add('active');
    mobileNav.classList.add('active');
    body.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  if (hamburger && mobileNav) {
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('active');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close menu when any mobile nav link is clicked
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        closeMobileNav();
        hamburger.focus(); // return focus to trigger element
      }
    });
  }


  // =============================================================
  // 4. FAQ ACCORDION
  // =============================================================
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (!questionBtn) return;

      questionBtn.addEventListener('click', () => {
        const isAlreadyActive = item.classList.contains('active');

        // Close all items first
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // If the clicked item was not active, open it
        if (!isAlreadyActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }


  // =============================================================
  // 5. STATS COUNTER ANIMATION
  // =============================================================
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0) {
    /**
     * Animate a counter element from 0 to its data-target value.
     * Uses cubic ease-out easing over ~2 seconds via requestAnimationFrame.
     * @param {HTMLElement} el - The element to animate.
     */
    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 2000; // ms
      let startTime = null;

      function tick(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / duration, 1); // clamp to [0, 1]

        // Cubic ease-out: progress = 1 - (1 - t)^3
        const progress = 1 - Math.pow(1 - t, 3);
        const currentValue = progress * target;

        el.textContent = Math.floor(currentValue);

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = target; // ensure exact final value
        }
      }

      requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // animate only once
        }
      });
    }, {
      threshold: 0.5
    });

    statNumbers.forEach(el => counterObserver.observe(el));
  }


  // =============================================================
  // 6. SMOOTH SCROLL
  // =============================================================
  const HEADER_OFFSET = 80; // px — height of the fixed header

  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  if (anchorLinks.length > 0) {
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Ignore bare "#" links
        if (!href || href === '#') return;

        const targetEl = document.querySelector(href);
        if (!targetEl) return;

        e.preventDefault();

        // Close mobile nav first if open
        if (mobileNav && mobileNav.classList.contains('active')) {
          closeMobileNav();
        }

        const top = targetEl.offsetTop - HEADER_OFFSET;

        window.scrollTo({
          top: Math.max(0, top),
          behavior: 'smooth'
        });
      });
    });
  }


  // =============================================================
  // 7. TESTIMONIAL CAROUSEL
  // =============================================================
  const carousel = document.querySelector('.testimonial-carousel');
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');

  if (carousel && testimonials.length > 0) {
    let currentSlide = 0;
    let autoRotateInterval = null;
    const AUTO_ROTATE_DELAY = 5000; // ms

    /**
     * Show the slide at the given index and update dot indicators.
     * @param {number} index - Slide index to display.
     */
    function showSlide(index) {
      // Wrap index within bounds
      currentSlide = (index + testimonials.length) % testimonials.length;

      testimonials.forEach(t => t.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));

      testimonials[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
      }
    }

    /**
     * Start the auto-rotation interval.
     */
    function startAutoRotate() {
      autoRotateInterval = setInterval(() => {
        showSlide(currentSlide + 1);
      }, AUTO_ROTATE_DELAY);
    }

    /**
     * Stop the auto-rotation interval.
     */
    function stopAutoRotate() {
      if (autoRotateInterval !== null) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
      }
    }

    // Initialize first slide
    showSlide(0);
    startAutoRotate();

    // Dot click handlers
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        stopAutoRotate();
        startAutoRotate(); // reset interval
      });
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      stopAutoRotate();
    });

    carousel.addEventListener('mouseleave', () => {
      startAutoRotate();
    });

    // Keyboard navigation when carousel is focused
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showSlide(currentSlide - 1);
        stopAutoRotate();
        startAutoRotate();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showSlide(currentSlide + 1);
        stopAutoRotate();
        startAutoRotate();
      }
    });
  }


  // =============================================================
  // 8. SCROLLSPY — ACTIVE NAV LINK
  // =============================================================
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links a');
  const mobileNavSpyLinks = document.querySelectorAll('.mobile-nav a');

  if (sections.length > 0 && (desktopNavLinks.length > 0 || mobileNavSpyLinks.length > 0)) {
    /**
     * Set the active nav link for a given section id.
     * Clears active state from all other links in both navs.
     * @param {string} id - The section id.
     */
    function setActiveNavLink(id) {
      const href = `#${id}`;

      desktopNavLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === href);
      });

      mobileNavSpyLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === href);
      });
    }

    const scrollspyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveNavLink(entry.target.id);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => scrollspyObserver.observe(section));
  }

  // =============================================================
  // 9. CONTACT FORM VALIDATION
  // =============================================================
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const fields = [
        { el: document.getElementById('contact-name'), msg: 'Please enter your name' },
        { el: document.getElementById('contact-email'), msg: 'Please enter a valid email' },
        { el: document.getElementById('contact-message'), msg: 'Please describe your project' }
      ];

      fields.forEach(({ el, msg }) => {
        const errorSpan = el.parentElement.querySelector('.form-error');
        const value = el.value.trim();
        let fieldValid = value.length > 0;

        if (el.type === 'email' && fieldValid) {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        if (!fieldValid) {
          el.classList.add('error');
          if (errorSpan) errorSpan.textContent = msg;
          isValid = false;
        } else {
          el.classList.remove('error');
          if (errorSpan) errorSpan.textContent = '';
        }
      });

      if (isValid) {
        contactForm.style.display = 'none';
        const successEl = document.getElementById('form-success');
        if (successEl) successEl.hidden = false;
      }
    });

    // Clear errors on input
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errorSpan = field.parentElement.querySelector('.form-error');
        if (errorSpan) errorSpan.textContent = '';
      });
    });
  }


  // =============================================================
  // 10. DYNAMIC COPYRIGHT YEAR
  // =============================================================
  const copyrightEl = document.getElementById('copyright-year');
  if (copyrightEl) {
    copyrightEl.textContent = new Date().getFullYear();
  }

}); // end DOMContentLoaded

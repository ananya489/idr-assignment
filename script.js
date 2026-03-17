/**
 * IDR — Institute of Digital Risk
 * script.js
 * ─────────────────────────────────────────────────────────────
 * Features:
 *  1. Sticky navbar — adds shadow class on scroll
 *  2. Mobile hamburger menu toggle
 *  3. Smooth scrolling with navbar offset
 *  4. Active nav link highlight based on scroll position
 *  5. Scroll-triggered entrance animations (IntersectionObserver)
 *  6. Contact form validation and submission feedback
 * ─────────────────────────────────────────────────────────────
 */

/* ==============================================================
   1. STICKY NAV — add/remove .scrolled shadow class
   ============================================================== */
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Listen for scroll (passive for performance)
  window.addEventListener('scroll', handleScroll, { passive: true });
  // Run once immediately in case page is already scrolled
  handleScroll();
})();


/* ==============================================================
   2. MOBILE HAMBURGER MENU TOGGLE
   ============================================================== */
(function () {
  var hamburger = document.getElementById('hamburger');
  var navMenu   = document.getElementById('nav-menu');
  if (!hamburger || !navMenu) return;

  // Toggle open/close when button is clicked
  hamburger.addEventListener('click', function () {
    var isOpen = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    navMenu.classList.toggle('open');
  });

  // Close menu when any nav link is clicked
  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    });
  });

  // Close menu when clicking outside it
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('open');
    }
  });
})();


/* ==============================================================
   3. SMOOTH SCROLLING WITH NAVBAR OFFSET
   CSS scroll-behavior: smooth handles basic cases, but this
   ensures the sticky navbar doesn't cover the section heading.
   ============================================================== */
(function () {
  var NAV_OFFSET = 72; // matches --nav-height in CSS

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = this.getAttribute('href').slice(1);
      if (!id) return;

      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      var targetTop = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      // Move keyboard focus to the section for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
})();


/* ==============================================================
   4. ACTIVE NAV LINK — highlight based on scroll position
   ============================================================== */
(function () {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');
  var NAV_OFFSET = 80;

  function setActive() {
    var currentId = '';

    sections.forEach(function (section) {
      var rect = section.getBoundingClientRect();
      // Section is in the viewport area just below the navbar
      if (rect.top <= NAV_OFFSET + 30) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('nav-active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('nav-active');
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive(); // run once on load
})();


/* ==============================================================
   5. SCROLL-TRIGGERED ENTRANCE ANIMATIONS
   Uses IntersectionObserver to add .visible class when
   elements enter the viewport, triggering CSS transitions.
   ============================================================== */
(function () {
  // Add .fade-in to elements we want to animate
  var selectors = [
    '.pillar-card',
    '.feature-card',
    '.pipeline-step',
    '.comm-box',
    '.section-title',
    '.section-label',
    '.about-text',
    '.about-features',
    '.community-text',
    '.community-panels',
    '.contact-info',
    '.contact-form'
  ].join(', ');

  document.querySelectorAll(selectors).forEach(function (el) {
    el.classList.add('fade-in');
  });

  // Add stagger delays to card groups
  document.querySelectorAll('.pillars-grid .pillar-card').forEach(function (card, i) {
    if (i === 1) card.classList.add('delay-1');
    if (i === 2) card.classList.add('delay-2');
  });

  document.querySelectorAll('.about-features .feature-card').forEach(function (card, i) {
    if (i === 1) card.classList.add('delay-1');
    if (i === 2) card.classList.add('delay-2');
    if (i === 3) card.classList.add('delay-3');
  });

  document.querySelectorAll('.pipeline-step').forEach(function (step, i) {
    if (i === 1) step.classList.add('delay-1');
    if (i === 2) step.classList.add('delay-2');
    if (i === 3) step.classList.add('delay-3');
  });

  // If browser supports IntersectionObserver, use it
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      {
        threshold: 0.12,         // trigger when 12% of element is visible
        rootMargin: '0px 0px -30px 0px' // slight offset from bottom
      }
    );

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });

  } else {
    // Fallback for older browsers: show everything immediately
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();


/* ==============================================================
   6. CONTACT FORM VALIDATION & SUBMISSION FEEDBACK
   ============================================================== */
(function () {
  var form       = document.getElementById('contact-form');
  var statusEl   = document.getElementById('form-status');
  var nameInput  = document.getElementById('full-name');
  var emailInput = document.getElementById('email-address');
  var nameError  = document.getElementById('name-error');
  var emailError = document.getElementById('email-error');

  if (!form) return;

  /* ---- Utility functions ---- */

  // Mark a field as invalid with a message
  function showError(input, errorEl, message) {
    input.classList.add('input-error');
    errorEl.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  // Clear a field's error state
  function clearError(input, errorEl) {
    input.classList.remove('input-error');
    errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  // Basic email format check
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /* ---- Live validation on blur ---- */

  nameInput.addEventListener('blur', function () {
    if (!this.value.trim()) {
      showError(this, nameError, 'Please enter your full name.');
    } else {
      clearError(this, nameError);
    }
  });

  emailInput.addEventListener('blur', function () {
    if (!this.value.trim()) {
      showError(this, emailError, 'Please enter your email address.');
    } else if (!isValidEmail(this.value.trim())) {
      showError(this, emailError, 'Please enter a valid email address.');
    } else {
      clearError(this, emailError);
    }
  });

  /* ---- Form submit handler ---- */

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent default browser submission

    var valid = true;

    // Validate name
    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, 'Please enter your full name.');
      valid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Validate email
    if (!emailInput.value.trim()) {
      showError(emailInput, emailError, 'Please enter your email address.');
      valid = false;
    } else if (!isValidEmail(emailInput.value.trim())) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // If validation failed, stop here
    if (!valid) return;

    // Disable submit button to prevent double-submit
    var submitBtn = form.querySelector('[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // Clear previous status
    statusEl.className = 'form-status';
    statusEl.textContent = '';

    // Simulate async form submission (replace with real fetch() in production)
    setTimeout(function () {
      // Simulate success
      statusEl.className = 'form-status success';
      statusEl.textContent = '✓ Thank you! Your message has been received. We\'ll be in touch shortly.';

      // Reset form
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Clear status message after 8 seconds
      setTimeout(function () {
        statusEl.className = 'form-status';
        statusEl.textContent = '';
      }, 8000);

    }, 1200); // simulated 1.2s network delay
  });
})();
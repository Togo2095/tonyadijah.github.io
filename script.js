/* ============================================
   TONY ADIJAH — PORTFOLIO JAVASCRIPT
   Performance-optimized for all devices
   Works on: Chrome, Firefox, Safari, Edge,
   iOS Safari, Samsung Internet, Opera
   ============================================ */

(function () {
  'use strict';

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initMobileMenu();
    initScrollReveal();
    initSmoothScroll();
    initContactForm();
    initCursor();
  }

  /* ===== MOBILE MENU ===== */
  function initMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      var isActive = menu.classList.toggle('active');
      btn.classList.toggle('active');
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        menu.classList.remove('active');
        btn.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }

  /* ===== SCROLL REVEAL ===== */
  function initScrollReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Use IntersectionObserver if available
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
              entries[i].target.classList.add('visible');
              observer.unobserve(entries[i].target);
            }
          }
        },
        {
          root: null,
          rootMargin: '0px 0px -30px 0px',
          threshold: 0.05,
        }
      );

      for (var i = 0; i < elements.length; i++) {
        observer.observe(elements[i]);
      }
    } else {
      // Fallback: show everything immediately
      for (var j = 0; j < elements.length; j++) {
        elements[j].classList.add('visible');
      }
    }
  }

  /* ===== SMOOTH SCROLL ===== */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');

    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Check if browser supports smooth scrolling
        if ('scrollBehavior' in document.documentElement.style) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Safari fallback
          var y = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo(0, y);
        }
      });
    }
  }

  /* ===== CONTACT FORM ===== */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      var originalHTML = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      setTimeout(function () {
        btn.innerHTML = '✓ Message Sent!';
        btn.style.background = '#00ff88';
        btn.style.boxShadow = '0 0 40px rgba(0, 255, 136, 0.5)';

        setTimeout(function () {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.style.boxShadow = '';
          btn.disabled = false;
          btn.style.opacity = '1';
          form.reset();
        }, 2500);
      }, 1500);
    });
  }

  /* ===== CUSTOM CURSOR (Desktop Only) ===== */
  function initCursor() {
    // Detect device capabilities
    var isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    var prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    var isDesktop = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;

    // Only enable cursor on desktop with mouse
    if (isTouchDevice || prefersReducedMotion || !isDesktop) return;

    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    var glow = document.getElementById('cursor-glow');

    if (!dot || !ring || !glow) return;

    // Get trail elements
    var trails = [];
    for (var t = 1; t <= 5; t++) {
      var trail = document.getElementById('trail-' + t);
      if (trail) trails.push(trail);
    }

    // Show cursor elements
    dot.style.display = 'block';
    ring.style.display = 'block';
    glow.style.display = 'block';
    for (var i = 0; i < trails.length; i++) {
      trails[i].style.display = 'block';
    }

    // Position tracking
    var mouseX = 0,
      mouseY = 0;
    var dotX = 0,
      dotY = 0;
    var ringX = 0,
      ringY = 0;
    var glowX = 0,
      glowY = 0;
    var isMoving = false;
    var moveTimeout;

    // Trail positions
    var trailPositions = [];
    for (var j = 0; j < trails.length; j++) {
      trailPositions.push({ x: 0, y: 0 });
    }

    // Mouse move handler (passive for performance)
    document.addEventListener(
      'mousemove',
      function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(function () {
          isMoving = false;
        }, 100);
      },
      { passive: true }
    );

    // Click burst effect
    document.addEventListener('click', function (e) {
      createClickBurst(e.clientX, e.clientY);
    });

    function createClickBurst(x, y) {
      var colors = ['#00ff88', '#ff006e', '#00d4ff'];

      for (var i = 0; i < 8; i++) {
        var particle = document.createElement('div');
        particle.style.cssText =
          'position:fixed;width:4px;height:4px;border-radius:50%;pointer-events:none;z-index:99999;will-change:transform,opacity;';

        var color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.boxShadow = '0 0 6px ' + color;

        document.body.appendChild(particle);

        var angle = (Math.PI * 2 / 8) * i + Math.random() * 0.5;
        var velocity = 60 + Math.random() * 40;
        var targetX = x + Math.cos(angle) * velocity;
        var targetY = y + Math.sin(angle) * velocity;

        animateParticle(particle, x, y, targetX, targetY);
      }
    }

    function animateParticle(el, startX, startY, endX, endY) {
      var startTime = performance.now();
      var duration = 600;

      function tick(now) {
        var elapsed = now - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);

        el.style.left = startX + (endX - startX) * eased + 'px';
        el.style.top = startY + (endY - startY) * eased + 'px';
        el.style.opacity = 1 - progress;
        el.style.transform = 'scale(' + (1 - progress * 0.5) + ')';

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          if (el.parentNode) el.parentNode.removeChild(el);
        }
      }

      requestAnimationFrame(tick);
    }

    // Main animation loop using requestAnimationFrame
    function animateCursor(now) {
      // Smooth follow - dot (fastest)
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;
      dot.style.left = dotX + 'px';
      dot.style.top = dotY + 'px';

      // Ring (medium speed)
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';

      // Glow (slowest)
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';

      // Trails
      for (var i = 0; i < trails.length; i++) {
        var target =
          i === 0 ? { x: dotX, y: dotY } : trailPositions[i - 1];
        var speed = 0.2 - i * 0.03;

        trailPositions[i].x += (target.x - trailPositions[i].x) * speed;
        trailPositions[i].y += (target.y - trailPositions[i].y) * speed;

        trails[i].style.left = trailPositions[i].x + 'px';
        trails[i].style.top = trailPositions[i].y + 'px';

        if (isMoving) {
          var trailOpacity = 0.4 - i * 0.07;
          var trailSize = 5 - i;
          trails[i].style.opacity = trailOpacity;
          trails[i].style.width = trailSize + 'px';
          trails[i].style.height = trailSize + 'px';
          trails[i].style.background =
            i % 2 === 0
              ? 'rgba(0, 255, 136, 0.6)'
              : 'rgba(0, 212, 255, 0.6)';
          trails[i].style.boxShadow =
            '0 0 ' + (trailSize + 2) + 'px ' + trails[i].style.background;
        } else {
          trails[i].style.opacity = 0;
        }
      }

      // Ring distortion based on speed
      var dx = mouseX - ringX;
      var dy = mouseY - ringY;
      var speed = Math.sqrt(dx * dx + dy * dy);
      var skew = Math.min(speed * 0.3, 15);
      var angle = Math.atan2(dy, dx) * (180 / Math.PI);

      var ringTransform =
        'translate(-50%, -50%) rotate(' +
        angle +
        'deg) scaleX(' +
        (1 + skew * 0.01) +
        ')';
      ring.style.webkitTransform = ringTransform;
      ring.style.transform = ringTransform;

      requestAnimationFrame(animateCursor);
    }

    requestAnimationFrame(animateCursor);

    // Hover effects on interactive elements
    var hoverTargets = document.querySelectorAll(
      'a, button, .service-card, .case-card, .result-card, .cert-card, .social-icon, .tech-item, .btn-primary, .btn-secondary, .magnetic-target'
    );

    for (var h = 0; h < hoverTargets.length; h++) {
      hoverTargets[h].addEventListener('mouseenter', function () {
        dot.classList.add('cursor-hover');
        ring.classList.add('cursor-hover');
      });
      hoverTargets[h].addEventListener('mouseleave', function () {
        dot.classList.remove('cursor-hover');
        ring.classList.remove('cursor-hover');
      });
    }

    // Text cursor for inputs
    var textTargets = document.querySelectorAll('input, textarea');
    for (var tt = 0; tt < textTargets.length; tt++) {
      textTargets[tt].addEventListener('mouseenter', function () {
        dot.classList.add('cursor-text');
        ring.classList.add('cursor-text');
        dot.classList.remove('cursor-hover');
        ring.classList.remove('cursor-hover');
      });
      textTargets[tt].addEventListener('mouseleave', function () {
        dot.classList.remove('cursor-text');
        ring.classList.remove('cursor-text');
      });
    }

    // Magnetic effect on targets
    var magneticEls = document.querySelectorAll('.magnetic-target');
    for (var m = 0; m < magneticEls.length; m++) {
      magneticEls[m].addEventListener(
        'mousemove',
        function (e) {
          var rect = this.getBoundingClientRect();
          var centerX = rect.left + rect.width / 2;
          var centerY = rect.top + rect.height / 2;
          var deltaX = (e.clientX - centerX) * 0.2;
          var deltaY = (e.clientY - centerY) * 0.2;
          var t = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
          this.style.webkitTransform = t;
          this.style.transform = t;
        }
      );
      magneticEls[m].addEventListener('mouseleave', function () {
        this.style.webkitTransform = '';
        this.style.transform = '';
      });
    }

    // Hide cursor when mouse leaves window
    document.addEventListener('mouseleave', function () {
      dot.classList.add('cursor-hidden');
      ring.classList.add('cursor-hidden');
      glow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.classList.remove('cursor-hidden');
      ring.classList.remove('cursor-hidden');
      glow.style.opacity = '1';
    });
  }
})();
/* ============================================
   TONY ADIJAH — PORTFOLIO JS
   v5.0 — Bulletproof animations
   ============================================ */

(function () {
  'use strict';

  /* ===== DEVICE DETECTION ===== */
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  /* ===== INIT ===== */
  // Try to run ASAP
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(startApp, 0);
  } else {
    document.addEventListener('DOMContentLoaded', startApp);
  }

  // Also run on window load as backup
  window.addEventListener('load', function () {
    revealVisible();
  });

  function startApp() {
    // Debug: confirm script is running
    console.log('✅ Portfolio script loaded successfully');

    initMobileMenu();
    initRevealAnimations();
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
      if (isIOS) {
        document.body.style.position = isActive ? 'fixed' : '';
        document.body.style.width = isActive ? '100%' : '';
      }
    });

    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        menu.classList.remove('active');
        btn.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      });
    }

    console.log('✅ Mobile menu ready');
  }

  /* ===== REVEAL ANIMATIONS ===== */
  function initRevealAnimations() {
    // ★ STEP 1: Immediately reveal elements in viewport
    revealVisible();

    // ★ STEP 2: Set up observer for below-fold elements
    setupObserver();

    // ★ STEP 3: Multiple timed checks (catches edge cases)
    setTimeout(revealVisible, 50);
    setTimeout(revealVisible, 200);
    setTimeout(revealVisible, 500);
    setTimeout(revealVisible, 1000);
    setTimeout(revealVisible, 2000);

    // ★ STEP 4: Check on scroll
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          revealVisible();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // ★ STEP 5: Check on resize
    window.addEventListener('resize', function () {
      setTimeout(revealVisible, 100);
    }, { passive: true });

    console.log('✅ Reveal animations ready');
  }

  function setupObserver() {
    var elements = document.querySelectorAll('.reveal:not(.visible)');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('visible');
            observer.unobserve(entries[i].target);
          }
        }
      }, {
        root: null,
        rootMargin: '200px 0px 0px 0px',
        threshold: 0
      });

      for (var i = 0; i < elements.length; i++) {
        observer.observe(elements[i]);
      }
    } else {
      // No IntersectionObserver support — show everything
      showAll();
    }
  }

  // ★ Core: reveal elements currently in viewport
  function revealVisible() {
    var elements = document.querySelectorAll('.reveal:not(.visible)');
    if (!elements.length) return;

    var vh = window.innerHeight || document.documentElement.clientHeight;

    for (var i = 0; i < elements.length; i++) {
      var rect = elements[i].getBoundingClientRect();

      if (rect.top < vh + 150 && rect.bottom > -150) {
        elements[i].classList.add('visible');
      }
    }
  }

  // Fallback: show everything
  function showAll() {
    var elements = document.querySelectorAll('.reveal');
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.add('visible');
    }
    console.log('✅ All elements revealed (fallback)');
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
        var targetY = target.getBoundingClientRect().top + window.pageYOffset - 80;

        if (isIOS || !('scrollBehavior' in document.documentElement.style)) {
          smoothScrollTo(targetY, 600);
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  function smoothScrollTo(targetY, duration) {
    var startY = window.pageYOffset;
    var diff = targetY - startY;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startY + diff * eased);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ===== CONTACT FORM ===== */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      var orig = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      setTimeout(function () {
        btn.innerHTML = '✓ Message Sent!';
        btn.style.background = '#00ff88';
        btn.style.boxShadow = '0 0 40px rgba(0,255,136,.5)';

        setTimeout(function () {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.style.boxShadow = '';
          btn.disabled = false;
          btn.style.opacity = '1';
          form.reset();
        }, 2500);
      }, 1500);
    });
  }

  /* ===== CUSTOM CURSOR ===== */
  function initCursor() {
    if (isTouchDevice || isIOS) return;

    var prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var desk = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prm || !desk) return;

    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    var glow = document.getElementById('cursor-glow');
    if (!dot || !ring || !glow) return;

    var trails = [];
    for (var t = 1; t <= 5; t++) {
      var el = document.getElementById('trail-' + t);
      if (el) trails.push(el);
    }

    dot.style.display = 'block';
    ring.style.display = 'block';
    glow.style.display = 'block';
    for (var i = 0; i < trails.length; i++) trails[i].style.display = 'block';

    var mX = 0, mY = 0, dX = 0, dY = 0, rX = 0, rY = 0, gX = 0, gY = 0;
    var moving = false, mt;
    var tp = [];
    for (var j = 0; j < trails.length; j++) tp.push({ x: 0, y: 0 });

    document.addEventListener('mousemove', function (e) {
      mX = e.clientX; mY = e.clientY;
      moving = true;
      clearTimeout(mt);
      mt = setTimeout(function () { moving = false; }, 100);
    }, { passive: true });

    document.addEventListener('click', function (e) { burst(e.clientX, e.clientY); });

    function burst(x, y) {
      var cols = ['#00ff88', '#ff006e', '#00d4ff'];
      for (var i = 0; i < 8; i++) {
        var p = document.createElement('div');
        p.style.cssText = 'position:fixed;width:4px;height:4px;border-radius:50%;pointer-events:none;z-index:99999;will-change:transform,opacity;';
        var c = cols[Math.floor(Math.random() * cols.length)];
        p.style.background = c;
        p.style.left = x + 'px';
        p.style.top = y + 'px';
        p.style.boxShadow = '0 0 6px ' + c;
        document.body.appendChild(p);
        var a = (Math.PI * 2 / 8) * i + Math.random() * 0.5;
        var v = 60 + Math.random() * 40;
        animParticle(p, x, y, x + Math.cos(a) * v, y + Math.sin(a) * v);
      }
    }

    function animParticle(el, sx, sy, ex, ey) {
      var st = performance.now(), d = 600;
      function tk(now) {
        var pr = Math.min((now - st) / d, 1);
        var ea = 1 - Math.pow(1 - pr, 3);
        el.style.left = sx + (ex - sx) * ea + 'px';
        el.style.top = sy + (ey - sy) * ea + 'px';
        el.style.opacity = 1 - pr;
        el.style.transform = 'scale(' + (1 - pr * 0.5) + ')';
        if (pr < 1) requestAnimationFrame(tk);
        else if (el.parentNode) el.parentNode.removeChild(el);
      }
      requestAnimationFrame(tk);
    }

    function loop() {
      dX += (mX - dX) * 0.35; dY += (mY - dY) * 0.35;
      dot.style.left = dX + 'px'; dot.style.top = dY + 'px';

      rX += (mX - rX) * 0.15; rY += (mY - rY) * 0.15;
      ring.style.left = rX + 'px'; ring.style.top = rY + 'px';

      gX += (mX - gX) * 0.08; gY += (mY - gY) * 0.08;
      glow.style.left = gX + 'px'; glow.style.top = gY + 'px';

      for (var i = 0; i < trails.length; i++) {
        var tg = i === 0 ? { x: dX, y: dY } : tp[i - 1];
        var sp = 0.2 - i * 0.03;
        tp[i].x += (tg.x - tp[i].x) * sp;
        tp[i].y += (tg.y - tp[i].y) * sp;
        trails[i].style.left = tp[i].x + 'px';
        trails[i].style.top = tp[i].y + 'px';

        if (moving) {
          var to = 0.4 - i * 0.07, ts = 5 - i;
          trails[i].style.opacity = to;
          trails[i].style.width = ts + 'px';
          trails[i].style.height = ts + 'px';
          trails[i].style.background = i % 2 === 0 ? 'rgba(0,255,136,.6)' : 'rgba(0,212,255,.6)';
          trails[i].style.boxShadow = '0 0 ' + (ts + 2) + 'px ' + trails[i].style.background;
        } else {
          trails[i].style.opacity = 0;
        }
      }

      var dx = mX - rX, dy = mY - rY;
      var speed = Math.sqrt(dx * dx + dy * dy);
      var sk = Math.min(speed * 0.3, 15);
      var angle = Math.atan2(dy, dx) * (180 / Math.PI);
      var rt = 'translate(-50%,-50%) rotate(' + angle + 'deg) scaleX(' + (1 + sk * 0.01) + ') translateZ(0)';
      ring.style.webkitTransform = rt;
      ring.style.transform = rt;

      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    // Hover effects
    var hEls = document.querySelectorAll('a,button,.service-card,.case-card,.result-card,.cert-card,.social-icon,.tech-item,.btn-primary,.btn-secondary,.magnetic-target');
    for (var h = 0; h < hEls.length; h++) {
      hEls[h].addEventListener('mouseenter', function () { dot.classList.add('cursor-hover'); ring.classList.add('cursor-hover'); });
      hEls[h].addEventListener('mouseleave', function () { dot.classList.remove('cursor-hover'); ring.classList.remove('cursor-hover'); });
    }

    // Text cursor
    var tEls = document.querySelectorAll('input,textarea');
    for (var tt = 0; tt < tEls.length; tt++) {
      tEls[tt].addEventListener('mouseenter', function () {
        dot.classList.add('cursor-text'); ring.classList.add('cursor-text');
        dot.classList.remove('cursor-hover'); ring.classList.remove('cursor-hover');
      });
      tEls[tt].addEventListener('mouseleave', function () {
        dot.classList.remove('cursor-text'); ring.classList.remove('cursor-text');
      });
    }

    // Magnetic
    var mEls = document.querySelectorAll('.magnetic-target');
    for (var m = 0; m < mEls.length; m++) {
      mEls[m].addEventListener('mousemove', function (e) {
        var r = this.getBoundingClientRect();
        var t = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.2) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.2) + 'px)';
        this.style.webkitTransform = t; this.style.transform = t;
      });
      mEls[m].addEventListener('mouseleave', function () {
        this.style.webkitTransform = ''; this.style.transform = '';
      });
    }

    // Hide/show
    document.addEventListener('mouseleave', function () {
      dot.classList.add('cursor-hidden'); ring.classList.add('cursor-hidden');
      glow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function () {
      dot.classList.remove('cursor-hidden'); ring.classList.remove('cursor-hidden');
      glow.style.opacity = '1';
    });

    console.log('✅ Custom cursor ready');
  }
})();

// =============================================
// Bhoomi Codes — Interactions
// =============================================

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Loader ----------
  const loader = document.getElementById('loader');
  const loaderFill = document.querySelector('.loader-bar-fill');
  const loaderPercent = document.getElementById('loaderPercent');
  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 14 + 5;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.add('loaded');
        triggerInitialReveals();
      }, 350);
    }
    loaderFill.style.width = pct + '%';
    loaderPercent.textContent = String(Math.round(pct)).padStart(3, '0');
  }, 80);

  // ---------- Year ----------
  document.getElementById('year').textContent = new Date().getFullYear();

  // ==========================================
  // Split text — wrap chars / words for animation
  // ==========================================
  function splitChars(el) {
    const text = el.textContent;
    el.innerHTML = '';
    const frag = document.createDocumentFragment();
    text.split('').forEach((ch, i) => {
      if (ch === ' ') {
        frag.appendChild(document.createTextNode(' '));
        return;
      }
      const span = document.createElement('span');
      span.className = 'split-char';
      span.textContent = ch;
      span.style.transitionDelay = (i * 0.018) + 's';
      frag.appendChild(span);
    });
    el.appendChild(frag);
  }
  document.querySelectorAll('[data-split]').forEach(el => {
    // Only wrap chars on smaller text — for huge headlines we already animate the line
    if (!el.closest('.hero-title') && !el.closest('.section-title') && !el.closest('.big-text') && !el.closest('.cta-title') && !el.closest('.footer-big')) {
      splitChars(el);
    }
  });

  // Wrap words for word reveals
  document.querySelectorAll('[data-reveal="words"]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = '';
    words.forEach((w, i) => {
      const wrap = document.createElement('span');
      wrap.className = 'word';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = w;
      inner.style.transitionDelay = (i * 0.04) + 's';
      wrap.appendChild(inner);
      el.appendChild(wrap);
    });
  });

  // ==========================================
  // Custom cursor with hover states + label
  // ==========================================
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  const cursorLabel = document.getElementById('cursorLabel');
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });
  function followLoop() {
    fx += (mx - fx) * 0.18;
    fy += (my - fy) * 0.18;
    follower.style.transform = `translate(${fx}px, ${fy}px) translate(-50%, -50%)`;
    requestAnimationFrame(followLoop);
  }
  followLoop();

  // Hover state for interactive elements
  document.querySelectorAll('a, button, input, textarea, select, .work-item, .work-card-small, .intro-card, .testimonial')
    .forEach(el => {
      el.addEventListener('mouseenter', () => follower.classList.add('hover'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });

  // Special "media" cursor with label for project items
  document.querySelectorAll('[data-cursor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorLabel.textContent = el.dataset.cursor;
      follower.classList.add('media');
    });
    el.addEventListener('mouseleave', () => {
      follower.classList.remove('media');
    });
  });

  // Dark sections — invert cursor
  const darkSections = document.querySelectorAll('.contact, .stats, .footer, .marquee-section');
  darkSections.forEach(s => {
    s.addEventListener('mouseenter', () => {
      cursor.classList.add('dark');
      follower.classList.add('dark');
    });
    s.addEventListener('mouseleave', () => {
      cursor.classList.remove('dark');
      follower.classList.remove('dark');
    });
  });

  // ==========================================
  // Magnetic buttons (subtle pull toward cursor)
  // ==========================================
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = 0.35;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      const inner = el.querySelector('.btn-arrow, .cta-text, span');
      if (inner) inner.style.transform = `translate(${dx * strength * 0.5}px, ${dy * strength * 0.5}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      const inner = el.querySelector('.btn-arrow, .cta-text, span');
      if (inner) inner.style.transform = '';
    });
  });

  // ==========================================
  // Scroll-triggered reveals
  // ==========================================
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('in');
        // Activate child line-inner / split-char too
        el.querySelectorAll('.line-inner, .split-char').forEach(c => c.classList.add('in'));
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

  function triggerInitialReveals() {
    // Hero animations should fire immediately after loader
    document.querySelectorAll('.hero .line-inner, .hero .split-char').forEach(el => el.classList.add('in'));
    document.querySelectorAll('.hero [data-reveal]').forEach(el => {
      el.classList.add('in');
      el.querySelectorAll('.line-inner, .split-char, .word-inner').forEach(c => c.classList.add('in'));
    });
  }

  // Observe non-hero reveal containers
  document.querySelectorAll('[data-reveal], .section-title, .big-text, .cta-title, .work-item, .footer-big')
    .forEach(el => {
      if (el.closest('.hero')) return;
      io.observe(el);
    });

  // Activate line-inner / split-char inside section titles when they enter
  document.querySelectorAll('.section-title, .big-text, .cta-title, .footer-big').forEach(el => {
    const titleIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.line-inner, .split-char').forEach(c => c.classList.add('in'));
          titleIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    titleIO.observe(el);
  });

  // ==========================================
  // Stats counter
  // ==========================================
  const stats = document.querySelectorAll('.stat-num');
  const statIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        const dur = 1800;
        const start = performance.now();
        const animate = (now) => {
          const t = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        statIO.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => statIO.observe(s));

  // ==========================================
  // Hover-play videos on work items
  // ==========================================
  document.querySelectorAll('.work-item--video').forEach(item => {
    const video = item.querySelector('.work-video');
    if (!video) return;
    video.preload = 'auto';

    item.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
    });
    item.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });

    // Play if visible (mobile / non-hover devices)
    const visIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && window.matchMedia('(hover: none)').matches) {
          video.play().catch(() => {});
        } else if (!entry.isIntersecting) {
          video.pause();
        }
      });
    }, { threshold: 0.5 });
    visIO.observe(item);
  });

  // ==========================================
  // Subtle 3D tilt on small work cards
  // ==========================================
  document.querySelectorAll('.work-card-small').forEach(card => {
    const img = card.querySelector('.work-card-img > *');
    if (!img) return;
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) scale(1.04)`;
    });
    card.addEventListener('mouseleave', () => { img.style.transform = ''; });
  });

  // ==========================================
  // Nav scrolled state
  // ==========================================
  const nav = document.getElementById('nav');
  let lastY = 0;
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    lastY = window.scrollY;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ==========================================
  // Mobile menu
  // ==========================================
  const toggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // ==========================================
  // Smooth anchor scroll
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ==========================================
  // Form
  // ==========================================
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Sending…</span>';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = '<span>✓ Message sent</span>';
      form.reset();
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
      }, 3500);
    }, 900);
  });

  // ==========================================
  // Subtle parallax on service images & marquee speed
  // ==========================================
  const parallaxImgs = document.querySelectorAll('.service-image img');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    parallaxImgs.forEach(img => {
      const r = img.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        const off = (r.top - window.innerHeight / 2) * 0.04;
        img.style.transform = `translateY(${off}px)`;
      }
    });
  }, { passive: true });

});

/* ══════════════════════════════════════════════════════════
   REGINA VILLA — Main JavaScript
   ══════════════════════════════════════════════════════════ */

// ── Navbar Scroll ────────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// ── Mobile Menu ──────────────────────────────────────────────
function toggleMenu() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const links = document.getElementById('navLinks');
    if (links) links.classList.remove('open');
  });
});

// ── Hero Slideshow ───────────────────────────────────────────
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.hero-indicator');
let slideInterval;

function goToSlide(index) {
  if (!slides.length) return;
  slides[currentSlide].classList.remove('active');
  if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');

  currentSlide = index;
  slides[currentSlide].classList.add('active');
  if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  goToSlide(next);
}

if (slides.length > 1) {
  slideInterval = setInterval(nextSlide, 5500);
}

// ── Fade-In on Scroll ────────────────────────────────────────
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeEls.forEach(el => observer.observe(el));

// ── Lightbox ─────────────────────────────────────────────────
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!lb || !img) return;
  img.src = src;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ── Load Contact Info ────────────────────────────────────────
async function loadContactInfo() {
  try {
    const res = await fetch('/api/contact');
    const data = await res.json();

    // Map section
    const phone = document.getElementById('contact-phone');
    const address = document.getElementById('contact-address');
    const email = document.getElementById('contact-email');
    if (phone) phone.textContent = data.phone;
    if (address) address.textContent = data.address;
    if (email) email.textContent = data.email;

    // Footer
    const fp = document.getElementById('footer-phone');
    const fa = document.getElementById('footer-address');
    const fe = document.getElementById('footer-email');
    if (fp) fp.textContent = data.phone;
    if (fa) fa.textContent = data.address;
    if (fe) fe.textContent = data.email;
  } catch (e) {
    console.log('Could not load contact info');
  }
}

loadContactInfo();

// ── Booking Inquiry Form ─────────────────────────────────────
async function submitInquiry(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Sending...';
  }

  const payload = {
    name:     document.getElementById('inq-name')?.value,
    email:    document.getElementById('inq-email')?.value,
    phone:    document.getElementById('inq-phone')?.value,
    checkIn:  document.getElementById('inq-checkin')?.value,
    duration: document.getElementById('inq-duration')?.value,
    message:  document.getElementById('inq-message')?.value,
  };

  try {
    const res = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (data.success) {
      const form = document.getElementById('inquiryForm');
      const success = document.getElementById('formSuccess');
      if (form) form.style.display = 'none';
      if (success) success.classList.add('show');
    }
  } catch (err) {
    alert('Something went wrong. Please try again or contact us directly.');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Inquiry`;
    }
  }
}

// ── Set active nav link ──────────────────────────────────────
(function setActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '/' && href === '/') ||
        (path !== '/' && href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ── Smooth number counter animation ─────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const text = el.textContent;
    const num = parseFloat(text);
    if (isNaN(num)) return;
    let start = 0;
    const duration = 1500;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = text.replace(String(num), Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = text;
    };
    requestAnimationFrame(step);
  });
}

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      statsObs.disconnect();
    }
  }, { threshold: 0.3 });
  statsObs.observe(statsBar);
}

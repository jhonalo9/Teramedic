/* ── NAVBAR SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ── ACTIVE NAV LINK ── */
const navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

function setActiveLink() {
  const path = window.location.pathname;
  const page = path.split("/").pop() || 'index.html';

  navLinks.forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}
setActiveLink();

/* ══════════════════════════════
   MODAL RESERVAR CITA
══════════════════════════════ */
const modal   = document.getElementById('reservaModal');
const overlay = modal;

// Abrir / cerrar
function openModal(e) {
  if (e) e.preventDefault();
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  goStep(1);
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.getElementById('modalClose').addEventListener('click', closeModal);

// Exponer para botones en HTML
window.openModal = openModal;
window.closeModal = closeModal;

/* ─── Pasos ─── */
let currentStep = 1;
const totalSteps = 4;

function goStep(n) {
  // Desactivar todos
  document.querySelectorAll('.modal-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step-dot').forEach((d,i) => {
    d.classList.toggle('active', i + 1 === n);
    d.classList.toggle('done',   i + 1 <  n);
  });
  document.querySelectorAll('.step-line').forEach((l,i) => {
    l.classList.toggle('done', i + 1 < n);
  });
  document.getElementById('step' + n).classList.add('active');
  currentStep = n;
}

window.nextStep = function() {
  if (currentStep < totalSteps) goStep(currentStep + 1);
};
window.prevStep = function() {
  if (currentStep > 1) goStep(currentStep - 1);
};

/* ─── Selección de opciones ─── */
function makeSelectable(selector, groupClass) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll(groupClass).forEach(x => x.classList.remove('chosen'));
      el.classList.add('chosen');
    });
  });
}
makeSelectable('.svc-opt',  '.svc-opt');
makeSelectable('.th-opt',   '.th-opt');
makeSelectable('.tslot',    '.tslot');

/* ─── Mini-calendario en modal ─── */
let modalDate = new Date(2026, 1, 1); // Feb 2026

function renderMiniCal() {
  const grid     = document.getElementById('miniCalDays');
  const monthLbl = document.getElementById('miniCalMonth');
  if (!grid) return;
  const y = modalDate.getFullYear(), m = modalDate.getMonth();
  monthLbl.textContent = modalDate.toLocaleDateString('es', { month:'long', year:'numeric' })
                           .replace(/^\w/, c => c.toUpperCase());
  grid.innerHTML = '';
  const weekdays = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];
  weekdays.forEach(w => {
    const d = document.createElement('div');
    d.className = 'mini-cal-weekday'; d.textContent = w;
    grid.appendChild(d);
  });
  let first = new Date(y, m, 1).getDay();
  first = first === 0 ? 6 : first - 1;
  const prev = new Date(y, m, 0).getDate();
  const total = new Date(y, m+1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < first; i++) {
    const d = document.createElement('div');
    d.className = 'mday other'; d.textContent = prev - first + 1 + i;
    grid.appendChild(d);
  }
  for (let d = 1; d <= total; d++) {
    const el = document.createElement('div');
    const isPast = new Date(y, m, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    el.className = 'mday' + (isPast ? ' disabled' : '');
    if (d === today.getDate() && m === today.getMonth() && y === today.getFullYear()) el.classList.add('today');
    el.textContent = d;
    if (!isPast) el.addEventListener('click', () => {
      document.querySelectorAll('.mday').forEach(x => { x.classList.remove('today','chosen'); });
      el.classList.add('chosen');
    });
    grid.appendChild(el);
  }
}

window.miniCalPrev = function() { modalDate.setMonth(modalDate.getMonth()-1); renderMiniCal(); };
window.miniCalNext = function() { modalDate.setMonth(modalDate.getMonth()+1); renderMiniCal(); };

// Render on DOMContentLoaded
document.addEventListener('DOMContentLoaded', renderMiniCal);

/* ─── Confirmación final ─── */
window.confirmReserva = function() {
  const svc = document.querySelector('.svc-opt.chosen .name')?.textContent   || 'Terapia seleccionada';
  const doc = document.querySelector('.th-opt.chosen .th-name')?.textContent || 'Terapeuta seleccionado';
  const day = document.querySelector('.mday.chosen')?.textContent             || '—';
  const time = document.querySelector('.tslot.chosen')?.textContent           || '—';
  document.getElementById('summaryText').innerHTML =
    `<strong>${svc}</strong> con <strong>${doc}</strong><br>📅 ${day} del mes seleccionado · ⏰ ${time}`;
  goStep(4);
};

/* ── HERO CAROUSEL ── */
let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dots .dot');
let slideInterval;

function showSlide(n) {
  if (n >= slides.length) slideIndex = 0;
  if (n < 0) slideIndex = slides.length - 1;
  
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  if(slides[slideIndex]) slides[slideIndex].classList.add('active');
  if(dots[slideIndex]) dots[slideIndex].classList.add('active');
}

window.moveSlide = function(n) {
  clearInterval(slideInterval);
  showSlide(slideIndex += n);
  startAutoSlide();
};

window.currentSlide = function(n) {
  clearInterval(slideInterval);
  slideIndex = n;
  showSlide(slideIndex);
  startAutoSlide();
};

function startAutoSlide() {
  slideInterval = setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);
  }, 5000);
}

if (slides.length > 0) {
  showSlide(slideIndex);
  startAutoSlide();
}

/* ── TESTIMONIALS CAROUSEL ── */
const testiTrack = document.getElementById('testiTrack');
const testiCards = document.querySelectorAll('.testi-card');
const testiDotsContainer = document.getElementById('testiDots');
let testiIndex = 0;

function getItemsVisible() {
  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function updateTestiCarousel() {
  if (!testiTrack) return;
  const itemsVisible = getItemsVisible();
  const totalItems = testiCards.length;
  const maxIndex = totalItems - itemsVisible;
  
  if (testiIndex > maxIndex) testiIndex = 0;
  if (testiIndex < 0) testiIndex = maxIndex;

  const cardWidth = testiCards[0].offsetWidth;
  const gap = parseFloat(window.getComputedStyle(testiTrack).gap) || 0;
  const moveAmount = (cardWidth + gap) * testiIndex;
  
  testiTrack.style.transform = `translateX(-${moveAmount}px)`;
  
  // Update dots
  document.querySelectorAll('.t-dot').forEach((d, i) => {
    d.classList.toggle('active', i === testiIndex);
  });
}

window.moveTestimonial = function(n) {
  testiIndex += n;
  updateTestiCarousel();
};

function initTestiDots() {
  if (!testiDotsContainer) return;
  testiDotsContainer.innerHTML = '';
  const count = testiCards.length - getItemsVisible() + 1;
  for(let i=0; i<count; i++) {
    const dot = document.createElement('div');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => { testiIndex = i; updateTestiCarousel(); };
    testiDotsContainer.appendChild(dot);
  }
}

window.addEventListener('resize', () => {
  initTestiDots();
  updateTestiCarousel();
});

// Init Testimonials
initTestiDots();
updateTestiCarousel();

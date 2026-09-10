document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const closeMobileNav = () => {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  };
  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileNav));

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Popup ---------- */
  const popupOverlay = document.getElementById('popupOverlay');
  const popupClose = document.getElementById('popupClose');
  const popupDismiss = document.getElementById('popupDismiss');
  const popupCta = document.getElementById('popupCta');
  const POPUP_KEY = 'aurea_popup_shown';
  const showPopup = () => {
    if (sessionStorage && sessionStorage.getItem(POPUP_KEY)) return;
    popupOverlay.classList.add('visible');
  };
  const hidePopup = () => {
    popupOverlay.classList.remove('visible');
    try { sessionStorage.setItem(POPUP_KEY, '1'); } catch (e) {}
  };
  setTimeout(showPopup, 7000);
  popupClose.addEventListener('click', hidePopup);
  popupDismiss.addEventListener('click', hidePopup);
  popupCta.addEventListener('click', hidePopup);
  popupOverlay.addEventListener('click', (e) => { if (e.target === popupOverlay) hidePopup(); });

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.add('visible');
    form.reset();
    setTimeout(() => success.classList.remove('visible'), 5000);
  });

  /* ---------- WhatsApp IA conversation ---------- */
  const waBody = document.getElementById('waBody');
  const waTyping = document.getElementById('waTyping');
  const replayBtn = document.getElementById('replayChat');
  const waSection = document.getElementById('whatsapp-ia');

  const waScript = [
    { from: 'user', text: 'Hola, quisiera sacar un turno.', time: '10:02' },
    { from: 'bot', text: '¡Hola! 😊 Claro. ¿Qué tratamiento querés reservar?', time: '10:02' },
    { from: 'user', text: 'Limpieza dental.', time: '10:03' },
    { from: 'bot', text: 'Perfecto. Tengo disponibilidad el martes a las 10:00 o jueves a las 16:00 hs. ¿Cuál preferís?', time: '10:03' },
    { from: 'user', text: 'Jueves 16:00.', time: '10:04' },
    { from: 'bot', text: '✅ Turno confirmado. Te enviaremos un recordatorio.', time: '10:04' }
  ];

  let waPlaying = false;

  function playWaScript() {
    if (waPlaying) return;
    waPlaying = true;
    waBody.innerHTML = '';
    let delay = 300;
    waScript.forEach((msg) => {
      const showTyping = msg.from === 'bot';
      if (showTyping) {
        setTimeout(() => waTyping.classList.add('visible'), Math.max(delay - 500, 0));
      }
      setTimeout(() => {
        waTyping.classList.remove('visible');
        const bubble = document.createElement('div');
        bubble.className = 'wa-bubble ' + (msg.from === 'user' ? 'user' : 'bot');
        bubble.innerHTML = msg.text + '<span class="wa-time">' + msg.time + '</span>';
        waBody.appendChild(bubble);
        waBody.scrollTop = waBody.scrollHeight;
      }, delay);
      delay += 1300;
    });
    setTimeout(() => { waPlaying = false; }, delay);
  }

  let waStarted = false;
  const waObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !waStarted) {
        waStarted = true;
        playWaScript();
      }
    });
  }, { threshold: 0.4 });
  if (waSection) waObserver.observe(waSection);

  replayBtn.addEventListener('click', () => {
    if (waPlaying) return;
    playWaScript();
  });

  /* ---------- Agenda interactive ---------- */
  const scheduleData = {
    'Lunes': ['10:00', '11:30', '16:00'],
    'Martes': ['09:30', '10:00', '15:30'],
    'Miércoles': ['10:00', '16:00']
  };

  const dayButtons = document.querySelectorAll('.agenda-day');
  const slotsContainer = document.getElementById('agendaSlots');
  const summaryText = document.getElementById('agendaSummaryText');
  const summaryBox = document.getElementById('agendaSummary');
  const confirmBtn = document.getElementById('agendaConfirm');

  let currentDay = 'Lunes';
  let currentSlot = null;

  function renderSlots(day) {
    slotsContainer.innerHTML = '';
    currentSlot = null;
    confirmBtn.disabled = true;
    summaryBox.classList.remove('confirmed');
    summaryText.textContent = 'Elegí un horario disponible.';
    scheduleData[day].forEach(time => {
      const btn = document.createElement('button');
      btn.className = 'agenda-slot';
      btn.textContent = time;
      btn.type = 'button';
      btn.addEventListener('click', () => {
        slotsContainer.querySelectorAll('.agenda-slot').forEach(s => s.classList.remove('selected'));
        btn.classList.add('selected');
        currentSlot = time;
        confirmBtn.disabled = false;
        summaryBox.classList.remove('confirmed');
        summaryText.textContent = 'Turno seleccionado: ' + day + ' ' + time + ' hs.';
      });
      slotsContainer.appendChild(btn);
    });
  }

  dayButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dayButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDay = btn.dataset.day;
      renderSlots(currentDay);
    });
  });

  confirmBtn.addEventListener('click', () => {
    if (!currentSlot) return;
    summaryBox.classList.add('confirmed');
    summaryText.textContent = '✓ Turno confirmado: ' + currentDay + ' ' + currentSlot + ' hs.';
    confirmBtn.disabled = true;
  });

  renderSlots(currentDay);

});

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

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Popup ---------- */
  const popupOverlay = document.getElementById('popupOverlay');
  const popupClose = document.getElementById('popupClose');
  const popupDismiss = document.getElementById('popupDismiss');
  const popupCta = document.getElementById('popupCta');
  const POPUP_KEY = 'sonrisa_popup_shown';

  const showPopup = () => {
    if (sessionStorage && sessionStorage.getItem(POPUP_KEY)) return;
    popupOverlay.classList.add('visible');
  };
  const hidePopup = () => {
    popupOverlay.classList.remove('visible');
    try { sessionStorage.setItem(POPUP_KEY, '1'); } catch (e) {}
  };

  setTimeout(showPopup, 6000);
  popupClose.addEventListener('click', hidePopup);
  popupDismiss.addEventListener('click', hidePopup);
  popupCta.addEventListener('click', hidePopup);
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) hidePopup();
  });

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.add('visible');
    form.reset();
    setTimeout(() => success.classList.remove('visible'), 5000);
  });

  /* ---------- Chat widget demo ---------- */
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatBody = document.getElementById('chatBody');
  const chatTyping = document.getElementById('chatTyping');
  const chatCta = document.getElementById('chatCta');
  const chatCtaBtn = document.getElementById('chatCtaBtn');

  const script = [
    { from: 'user', text: 'Hola, quería consultar por un tratamiento.' },
    { from: 'bot', text: '¡Hola! 😊 Claro. ¿Sobre qué tratamiento querés información?' },
    { from: 'user', text: 'Blanqueamiento.' },
    { from: 'bot', text: 'Te contamos todo sobre el tratamiento. Si querés, también podés solicitar un turno.' }
  ];

  let played = false;

  function playScript() {
    if (played) return;
    played = true;
    let delay = 400;
    script.forEach((msg, i) => {
      const showTyping = msg.from === 'bot';
      setTimeout(() => {
        if (showTyping) chatTyping.classList.add('visible');
      }, delay - 350 > 0 ? delay - 350 : 0);

      setTimeout(() => {
        chatTyping.classList.remove('visible');
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ' + (msg.from === 'user' ? 'user' : 'bot');
        bubble.textContent = msg.text;
        chatBody.appendChild(bubble);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, delay);

      delay += 1100;
    });

    setTimeout(() => {
      chatCta.classList.add('visible');
    }, delay);
  }

  function openChat() {
    chatWindow.classList.add('open');
    playScript();
  }
  function closeChat() {
    chatWindow.classList.remove('open');
  }

  chatToggle.addEventListener('click', () => {
    chatWindow.classList.contains('open') ? closeChat() : openChat();
  });
  chatClose.addEventListener('click', closeChat);
  chatCtaBtn.addEventListener('click', closeChat);

});

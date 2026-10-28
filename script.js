/**
 * JEEVIRAJ V PORTFOLIO — INTERACTIVE SCRIPTS
 * Spotlight & Octocat Minimalist Template with User Photo Default & Red Theme
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. HANGING BADGE CARD: SWAY PHYSICS & SWITCHER
  // ------------------------------------------------------------------------
  const hangingCard = document.getElementById('hangingCard');
  const heroSection = document.querySelector('.hero-section');
  const cardToggleBtn = document.getElementById('cardToggleBtn');
  const mascotView = document.getElementById('mascotView');
  const portraitView = document.getElementById('portraitView');
  const toggleMascot = document.getElementById('toggleMascot');
  const togglePhoto = document.getElementById('togglePhoto');

  let baseAngle = 5.5; // Natural resting tilt of the hanging card

  // Realistic mouse-reactive sway
  if (heroSection && hangingCard) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = hangingCard.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const mouseDeltaX = (e.clientX - cardCenterX) / window.innerWidth;
      
      const dynamicTilt = baseAngle + (mouseDeltaX * 12);
      hangingCard.style.transform = `rotate(${dynamicTilt.toFixed(2)}deg)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      hangingCard.style.transform = `rotate(${baseAngle}deg)`;
    });
  }

  // Toggle between Photo and Mascot (Photo is default)
  function setCardView(view) {
    if (view === 'photo') {
      portraitView.classList.add('active');
      mascotView.classList.remove('active');
      togglePhoto.classList.add('active');
      toggleMascot.classList.remove('active');
    } else {
      mascotView.classList.add('active');
      portraitView.classList.remove('active');
      toggleMascot.classList.add('active');
      togglePhoto.classList.remove('active');
    }
  }

  if (cardToggleBtn) {
    cardToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isPhoto = portraitView.classList.contains('active');
      setCardView(isPhoto ? 'mascot' : 'photo');
    });
  }

  if (hangingCard) {
    hangingCard.addEventListener('click', (e) => {
      if (e.target.closest('#cardToggleBtn')) return;
      const isPhoto = portraitView.classList.contains('active');
      setCardView(isPhoto ? 'mascot' : 'photo');
    });
  }


  // ------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION MENU
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }


  // ------------------------------------------------------------------------
  // 3. SCROLL SPY ACTIVE NAV LINK
  // ------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });


  // ------------------------------------------------------------------------
  // 4. CERTIFICATES FILTERING & SEARCH
  // ------------------------------------------------------------------------
  const certTabBtns = document.querySelectorAll('.cert-tab-btn');
  const certItems = document.querySelectorAll('.cert-item');
  const certSearchInput = document.getElementById('certSearchInput');

  function filterCertificates() {
    const activeTab = document.querySelector('.cert-tab-btn.active');
    const filter = activeTab ? activeTab.dataset.filter : 'all';
    const query = certSearchInput ? certSearchInput.value.trim().toLowerCase() : '';

    certItems.forEach(item => {
      const cat = item.dataset.cat || '';
      const title = (item.dataset.title || '').toLowerCase();
      const issuer = (item.dataset.issuer || '').toLowerCase();

      const cats = cat.split(/\s+/);
      const matchesCat = (filter === 'all' || cats.includes(filter) || cat === filter);
      const matchesQuery = (query === '' || title.includes(query) || issuer.includes(query));

      if (matchesCat && matchesQuery) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  certTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      certTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCertificates();
    });
  });

  if (certSearchInput) {
    certSearchInput.addEventListener('input', filterCertificates);
  }


  // ------------------------------------------------------------------------
  // 5. LIGHTBOX MODAL FOR CERTIFICATES & TROPHY PREVIEWS
  // ------------------------------------------------------------------------
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  function openLightbox(fullSrc, title) {
    if (lightboxImage && fullSrc) {
      lightboxImage.src = fullSrc;
      lightboxTitle.textContent = title || 'Preview';
      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  document.querySelectorAll('.cert-item').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(item.dataset.full, item.dataset.title);
    });
  });

  document.querySelectorAll('[data-lightbox-img]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(el.dataset.lightboxImg, el.dataset.lightboxTitle);
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('open')) {
      closeLightbox();
    }
  });


  // ------------------------------------------------------------------------
  // 6. COPY TO CLIPBOARD & TOAST POPUP
  // ------------------------------------------------------------------------
  const toastPopup = document.getElementById('toastPopup');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(msg) {
    if (!toastPopup || !toastMessage) return;
    toastMessage.textContent = msg;
    toastPopup.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastPopup.classList.remove('show');
    }, 3000);
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast(`Copied: ${textToCopy}`);
      });
    });
  });

});

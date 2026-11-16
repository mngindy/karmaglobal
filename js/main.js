/* =========================================================
   KARMA GLOBAL - MAIN JAVASCRIPT
   ========================================================= */

// 1. GOOGLE TRANSLATE FUNCTIONS
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'ar,en,fr',
    autoDisplay: false
  }, 'google_translate_element');

  var savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang && savedLang !== 'en') {
    applyTranslation('en|' + savedLang);
  }
}

function doGTranslate(lang_pair) {
  if (lang_pair.value) lang_pair = lang_pair.value;
  if (lang_pair === '') return;

  var lang = lang_pair.split('|')[1];
  localStorage.setItem('selectedLanguage', lang);
  applyTranslation(lang_pair);
}

function applyTranslation(lang_pair) {
  var lang = lang_pair.split('|')[1];
  var teCombo = document.querySelector('select.goog-te-combo');

  if (teCombo == null || teCombo.innerHTML === '') {
    setTimeout(function() { applyTranslation(lang_pair); }, 300);
  } else {
    teCombo.value = lang;
    teCombo.dispatchEvent(new Event('change'));
  }
}

// 2. RUN INTERACTIVE FEATURES ONCE PAGE LOADS
document.addEventListener('DOMContentLoaded', () => {

  // --- A. Language Dropdown (Mobile Tap & Desktop Click Support) ---
  const langSelector = document.querySelector('.lang-selector');
  const langBtn = document.querySelector('.lang-btn');

  if (langBtn && langSelector) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langSelector.classList.toggle('open');
    });

    // Close dropdown when tapping anywhere outside
    document.addEventListener('click', (e) => {
      if (!langSelector.contains(e.target)) {
        langSelector.classList.remove('open');
      }
    });
  }

  // --- B. Hero Slider (Only runs on pages that have .hero-slider) ---
  const sliderContainer = document.querySelector('.hero-slider');
  const slides = document.querySelectorAll('.hero-slider .slide');

  if (sliderContainer && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    }

    let slideInterval = setInterval(nextSlide, 5000);

    function resetInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    // Arrow buttons
    const nextBtn = document.querySelector('.next-slide');
    const prevBtn = document.querySelector('.prev-slide');

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
      });

      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
      });
    }

    // Touch-swipe support for phones
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50;

      if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
        resetInterval();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide();
        resetInterval();
      }
    }, { passive: true });
  }
});
// ===== AVIRAMA SOVEREIGN MOTION & INTERACTION ENGINE (GSAP 3) =====

document.addEventListener('DOMContentLoaded', () => {
  const hasGSAP = typeof gsap !== 'undefined';

  if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 1. HERO ENTRANCE TIMELINE
  if (hasGSAP) {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.85 } });
    heroTl
      .from('#mainHeader', { y: -25, opacity: 0, duration: 0.7 })
      .from('#heroBadge', { y: 15, opacity: 0, scale: 0.96 }, '-=0.4')
      .from('#heroTitle', { y: 30, opacity: 0, duration: 0.9 }, '-=0.5')
      .from('#heroDesc', { y: 20, opacity: 0 }, '-=0.6')
      .from('#heroEngineCards .engine-card', { y: 20, opacity: 0, stagger: 0.1 }, '-=0.5')
      .from('#heroCTA', { y: 18, opacity: 0, scale: 0.96 }, '-=0.5')
      .from('#heroSlider', { x: 25, opacity: 0, duration: 1.0, ease: 'power3.out' }, '-=0.7');

    // Ambient floating on Wordmark
    gsap.to('#heroWordmark', {
      scale: 1.03,
      opacity: 0.035,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // 2. SCROLL TRIGGER STAGGER REVEAL FOR PRODUCT CARDS
    gsap.utils.toArray('.catalog-section').forEach((section) => {
      const headline = section.querySelector('.section-headline-box');
      const cards = section.querySelectorAll('.product-card');

      if (headline) {
        gsap.from(headline, {
          y: 30,
          opacity: 0,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headline,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        });
      }

      if (cards.length > 0) {
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          scale: 0.97,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    });
  }

  // 3. 3D CARD TILT ON MOUSEMOVE
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / (rect.height / 2)) * 5;
      const rotateY = (x / (rect.width / 2)) * 5;

      if (hasGSAP) {
        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          duration: 0.2,
          ease: 'power1.out'
        });
      }
    });

    card.addEventListener('mouseleave', () => {
      if (hasGSAP) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.45,
          ease: 'power2.out'
        });
      }
    });
  });

  // 4. MAGNETIC POP ON CHAMPAGNE BUTTONS
  document.querySelectorAll('.btn-sand-cart').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      if (hasGSAP) {
        gsap.to(btn, { scale: 1.04, duration: 0.25, ease: 'back.out(2.2)' });
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (hasGSAP) {
        gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.out' });
      }
    });
  });

  // 5. HERO AUTO-SLIDER ENGINE
  let currentSlide = 0;
  const totalSlides = 6;
  let sliderInterval = null;

  function updateSliderUI() {
    const track = document.getElementById('sliderTrack');
    const dots = document.querySelectorAll('.slider-dot');
    const slides = document.querySelectorAll('.slide-item');
    
    if (track) {
      track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    }
    
    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, index) => {
      if (index === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  window.nextSlide = function() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSliderUI();
  };

  window.prevSlide = function() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSliderUI();
  };

  window.goToSlide = function(index) {
    currentSlide = index;
    updateSliderUI();
    resetAutoplay();
  };

  function startAutoplay() {
    if (!sliderInterval) {
      sliderInterval = setInterval(window.nextSlide, 3500);
    }
  }

  function stopAutoplay() {
    if (sliderInterval) {
      clearInterval(sliderInterval);
      sliderInterval = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  const heroSlider = document.getElementById('heroSlider');
  if (heroSlider) {
    heroSlider.addEventListener('mouseenter', stopAutoplay);
    heroSlider.addEventListener('mouseleave', startAutoplay);
  }

  updateSliderUI();
  startAutoplay();

  // 6. CATEGORY FILTER
  window.filterCategory = function(category, btnElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
      btnElement.classList.add('active');
    }

    const groups = document.querySelectorAll('.category-group');
    groups.forEach(group => {
      const groupCat = group.getAttribute('data-category');
      const isMatch = (category === 'all' || groupCat === category);

      if (isMatch) {
        group.style.display = 'block';
        if (hasGSAP) {
          gsap.fromTo(group, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
        } else {
          group.style.opacity = '1';
        }
      } else {
        if (hasGSAP) {
          gsap.to(group, {
            opacity: 0,
            y: 12,
            duration: 0.25,
            ease: 'power2.in',
            onComplete: () => { group.style.display = 'none'; }
          });
        } else {
          group.style.display = 'none';
        }
      }
    });

    if (hasGSAP && ScrollTrigger) {
      setTimeout(() => ScrollTrigger.refresh(), 350);
    }
  };

  // 7. SMOOTH HASH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});

/**
* Template Name: FlexStart
* Template URL: https://bootstrapmade.com/flexstart-bootstrap-startup-template/
* Updated: Nov 01 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();

/* FAQ accordion logic
   - accessible (Enter/Space)
   - aria-expanded, hidden attributes managed
   - option: allowMultiple = false  -> fecha outras quando abrir
   - persistOpenIndex: save in localStorage (optional)
*/
(function () {
  const faqRoot = document.getElementById('faq');
  if (!faqRoot) return;

  const allowMultiple = false; // colocar true se quiser múltiplos abertos
  const persistKey = 'conecta_faq_open'; // chave opcional do localStorage

  function initFAQ() {
    const items = Array.from(faqRoot.querySelectorAll('.faq-item'));
    items.forEach((item, idx) => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');

      // keyboard support already as button; ensure attributes
      trigger.setAttribute('aria-expanded', 'false');
      content.setAttribute('hidden', '');

      // click toggler
      trigger.addEventListener('click', () => toggleItem(item, idx));
      // keyboard: button handles Enter/Space natively, but ensure role semantics if changing element
    });

    // restore persisted open
    try {
      const stored = localStorage.getItem(persistKey);
      if (stored) {
        const index = parseInt(stored, 10);
        if (!isNaN(index)) openIndex(index);
      }
    } catch (e) { /* ignore storage errors */ }
  }

  function toggleItem(item, idx) {
    const isOpen = item.classList.contains('open');
    if (isOpen) {
      closeItem(item);
      try { localStorage.removeItem(persistKey); } catch (e) { }
    } else {
      if (!allowMultiple) {
        // close others
        const others = faqRoot.querySelectorAll('.faq-item.open');
        others.forEach(closeItem);
      }
      openItem(item);
      try { localStorage.setItem(persistKey, idx); } catch (e) { }
    }
  }

  function openItem(item) {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    item.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    content.removeAttribute('hidden');

    // animate max-height (use scrollHeight)
    content.style.maxHeight = content.scrollHeight + 'px';
    content.style.opacity = '1';
  }

  function closeItem(item) {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    item.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');

    // animate close
    content.style.maxHeight = content.scrollHeight + 'px'; // set current height for transition
    // force repaint to make transition work
    /* eslint-disable no-unused-expressions */
    content.offsetHeight;
    content.style.maxHeight = '0';
    content.style.opacity = '0';

    // after transition remove hidden to keep DOM tidy
    setTimeout(() => {
      content.setAttribute('hidden', '');
    }, 350);
  }

  function openIndex(i) {
    const item = faqRoot.querySelector(`.faq-item[data-index="${i}"]`);
    if (item) openItem(item);
  }

  // init on DOMContentLoaded in case script is in head or deferred
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFAQ);
  } else {
    initFAQ();
  }
})();

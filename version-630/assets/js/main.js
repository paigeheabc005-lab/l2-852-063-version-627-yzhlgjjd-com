(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  var toggle = qs('.nav-toggle');
  var nav = qs('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.textContent = isOpen ? '×' : '☰';
    });
  }

  qsa('[data-hero]').forEach(function (hero) {
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('.hero-dot', hero);
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        play();
      });
    });

    if (slides.length > 1) {
      play();
    }
  });

  qsa('.local-filter').forEach(function (input) {
    var grid = input.closest('main').querySelector('.movie-grid, .list-grid');
    if (!grid) {
      return;
    }

    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();
      qsa('.movie-card', grid).forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year'),
          card.textContent
        ].join(' ').toLowerCase();
        card.classList.toggle('is-filtered-out', value && text.indexOf(value) === -1);
      });
    });
  });
})();

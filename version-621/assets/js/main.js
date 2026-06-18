
(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    initNavigation();
    initHeroCarousel();
    initLocalFilters();
  });

  function initNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-nav-menu]');

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function initHeroCarousel() {
    var hero = document.querySelector('[data-hero]');

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(active - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(active + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initLocalFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

    scopes.forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var type = scope.querySelector('[data-filter-type]');
      var year = scope.querySelector('[data-filter-year]');
      var reset = scope.querySelector('[data-filter-reset]');
      var count = scope.querySelector('[data-filter-count]');
      var list = document.querySelector('[data-filter-list]');

      if (!list) {
        return;
      }

      var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));

      function apply() {
        var keyword = normalize(input ? input.value : '');
        var selectedType = type ? type.value : '';
        var selectedYear = year ? year.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize([
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.tags
          ].join(' '));

          var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchedType = !selectedType || card.dataset.type === selectedType;
          var matchedYear = !selectedYear || card.dataset.year === selectedYear;
          var matched = matchedKeyword && matchedType && matchedYear;

          card.classList.toggle('is-hidden', !matched);

          if (matched) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = visible + ' 部影片';
        }
      }

      [input, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });

      if (reset) {
        reset.addEventListener('click', function () {
          if (input) {
            input.value = '';
          }
          if (type) {
            type.value = '';
          }
          if (year) {
            year.value = '';
          }
          apply();
        });
      }

      apply();
    });
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }
})();

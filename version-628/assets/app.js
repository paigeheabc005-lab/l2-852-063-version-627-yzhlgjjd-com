(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var index = 0;
    var timer = null;
    var show = function (next) {
      if (!slides.length) return;
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    };
    var play = function () {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        if (timer) {
          window.clearInterval(timer);
          play();
        }
      });
    });
    play();
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';
  var searchInput = document.querySelector('[data-search-input]');
  if (searchInput && query) {
    searchInput.value = query;
  }

  var filterInputs = Array.prototype.slice.call(document.querySelectorAll('[data-page-filter], [data-search-input]'));
  var selects = Array.prototype.slice.call(document.querySelectorAll('[data-page-select]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));

  var applyFilter = function () {
    var keyword = '';
    filterInputs.forEach(function (input) {
      if (input.value.trim()) {
        keyword = input.value.trim().toLowerCase();
      }
    });
    var selected = '';
    selects.forEach(function (select) {
      if (select.value) {
        selected = select.value.toLowerCase();
      }
    });
    cards.forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-region') || '',
        card.getAttribute('data-type') || '',
        card.getAttribute('data-genre') || '',
        card.textContent || ''
      ].join(' ').toLowerCase();
      var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var matchType = !selected || haystack.indexOf(selected) !== -1;
      card.classList.toggle('is-hidden', !(matchKeyword && matchType));
    });
  };

  filterInputs.forEach(function (input) {
    input.addEventListener('input', applyFilter);
  });
  selects.forEach(function (select) {
    select.addEventListener('change', applyFilter);
  });
  if (query && cards.length) {
    applyFilter();
  }
})();

(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-mobile-menu-button]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!button || !menu) {
      return;
    }
    button.addEventListener('click', function () {
      var opened = menu.classList.toggle('open');
      button.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
    panels.forEach(function (panel) {
      var scope = panel.parentElement || document;
      var grid = scope.querySelector('[data-filter-grid]');
      if (!grid) {
        return;
      }
      var keyword = panel.querySelector('[data-filter-keyword]');
      var type = panel.querySelector('[data-filter-type]');
      var decade = panel.querySelector('[data-filter-decade]');
      var category = panel.querySelector('[data-filter-category]');
      var reset = panel.querySelector('[data-filter-reset]');
      var empty = scope.querySelector('[data-empty-state]');
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));

      function valueOf(element) {
        return element ? String(element.value || '').trim().toLowerCase() : '';
      }

      function apply() {
        var q = valueOf(keyword);
        var t = valueOf(type);
        var d = valueOf(decade);
        var c = valueOf(category);
        var visible = 0;

        cards.forEach(function (card) {
          var search = String(card.getAttribute('data-search') || '').toLowerCase();
          var cardType = String(card.getAttribute('data-type') || '').toLowerCase();
          var cardDecade = String(card.getAttribute('data-decade') || '').toLowerCase();
          var cardCategory = String(card.getAttribute('data-category') || '').toLowerCase();
          var matched = true;

          if (q && search.indexOf(q) === -1) {
            matched = false;
          }
          if (t && cardType !== t) {
            matched = false;
          }
          if (d && cardDecade !== d) {
            matched = false;
          }
          if (c && cardCategory !== c) {
            matched = false;
          }

          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [keyword, type, decade, category].forEach(function (element) {
        if (element) {
          element.addEventListener('input', apply);
          element.addEventListener('change', apply);
        }
      });

      if (reset) {
        reset.addEventListener('click', function () {
          [keyword, type, decade, category].forEach(function (element) {
            if (element) {
              element.value = '';
            }
          });
          apply();
        });
      }

      apply();
    });
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('.js-player'));
    players.forEach(function (player) {
      var video = player.querySelector('.js-player-video');
      var button = player.querySelector('.js-play-button');
      if (!video || !button) {
        return;
      }
      var source = video.getAttribute('data-src');
      var hls = null;
      var attached = false;
      var readyToPlay = false;
      var pendingPlay = false;

      function requestPlay() {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      function attachSource() {
        if (!source) {
          return false;
        }
        if (attached) {
          return readyToPlay;
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          attached = true;
          readyToPlay = true;
          return true;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            readyToPlay = true;
            if (pendingPlay) {
              requestPlay();
            }
          });
          hls.loadSource(source);
          hls.attachMedia(video);
          attached = true;
          return false;
        }
        video.src = source;
        attached = true;
        readyToPlay = true;
        return true;
      }

      function play() {
        pendingPlay = true;
        button.classList.add('is-hidden');
        var canPlayNow = attachSource();
        if (canPlayNow || readyToPlay || video.readyState > 0) {
          requestPlay();
        }
      }

      button.addEventListener('click', play);
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener('play', function () {
        button.classList.add('is-hidden');
      });
      video.addEventListener('ended', function () {
        pendingPlay = false;
        button.classList.remove('is-hidden');
      });
      window.addEventListener('pagehide', function () {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      });
    });
  }

  ready(function () {
    setupMobileMenu();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();

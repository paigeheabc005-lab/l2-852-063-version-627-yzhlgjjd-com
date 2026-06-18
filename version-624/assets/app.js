(function () {
  var ready = function (fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  };

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var mobile = document.querySelector("[data-mobile-nav]");
    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        mobile.classList.toggle("is-open");
      });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var thumbs = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-thumb]"));
      if (!slides.length) {
        return;
      }
      var current = 0;
      var setSlide = function (next) {
        current = (next + slides.length) % slides.length;
        slides.forEach(function (slide, index) {
          slide.classList.toggle("is-active", index === current);
        });
        dots.forEach(function (dot, index) {
          dot.classList.toggle("is-active", index === current);
        });
        thumbs.forEach(function (thumb, index) {
          thumb.classList.toggle("is-active", index === current);
        });
      };
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          setSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });
      window.setInterval(function () {
        setSlide(current + 1);
      }, 5200);
    });

    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    document.querySelectorAll("[data-search-input]").forEach(function (input) {
      if (initialQuery) {
        input.value = initialQuery;
      }
      var panel = input.closest(".content-section") || document;
      var cards = Array.prototype.slice.call(panel.querySelectorAll("[data-card]"));
      var buttons = Array.prototype.slice.call(panel.querySelectorAll("[data-filter]"));
      var activeFilter = "all";
      var apply = function () {
        var query = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region"),
            card.getAttribute("data-tags")
          ].join(" ").toLowerCase();
          var category = card.getAttribute("data-category") || "";
          var genre = card.getAttribute("data-genre") || "";
          var filterOk = activeFilter === "all" || category === activeFilter || genre.indexOf(activeFilter) !== -1 || text.indexOf(activeFilter.toLowerCase()) !== -1;
          var queryOk = !query || text.indexOf(query) !== -1;
          card.style.display = filterOk && queryOk ? "" : "none";
        });
      };
      input.addEventListener("input", apply);
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          activeFilter = button.getAttribute("data-filter") || "all";
          buttons.forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          apply();
        });
      });
      apply();
    });

    var attachPlayer = function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play-button]");
      if (!video) {
        return;
      }
      var src = player.getAttribute("data-stream") || video.getAttribute("data-stream");
      var started = false;
      var start = function () {
        if (!src) {
          return;
        }
        player.classList.add("is-playing");
        if (!started) {
          started = true;
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({ enableWorker: true });
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(function () {});
            });
          } else {
            video.src = src;
            video.play().catch(function () {});
          }
        } else {
          video.play().catch(function () {});
        }
      };
      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          start();
        });
      }
      player.addEventListener("click", function (event) {
        if (event.target === video) {
          return;
        }
        start();
      });
    };

    document.querySelectorAll("[data-player]").forEach(attachPlayer);
  });
})();

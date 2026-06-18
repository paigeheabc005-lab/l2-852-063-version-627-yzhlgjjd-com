(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
      menuButton.addEventListener("click", function () {
        mobilePanel.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
    var activeSlide = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeSlide = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === activeSlide);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === activeSlide);
      });
    }

    if (slides.length) {
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          showSlide(index);
        });
      });

      setInterval(function () {
        showSlide(activeSlide + 1);
      }, 5600);
    }

    Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]")).forEach(function (root) {
      var keyword = root.querySelector("[data-filter-keyword]");
      var year = root.querySelector("[data-filter-year]");
      var type = root.querySelector("[data-filter-type]");
      var region = root.querySelector("[data-filter-region]");
      var empty = root.querySelector("[data-empty-result]");
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
      var params = new URLSearchParams(window.location.search);
      var queryValue = params.get("q") || "";

      if (keyword && queryValue) {
        keyword.value = queryValue;
      }

      function normalize(value) {
        return String(value || "").toLowerCase().trim();
      }

      function filterCards() {
        var k = normalize(keyword && keyword.value);
        var y = normalize(year && year.value);
        var t = normalize(type && type.value);
        var r = normalize(region && region.value);
        var visible = 0;

        cards.forEach(function (card) {
          var text = normalize([
            card.dataset.title,
            card.dataset.year,
            card.dataset.region,
            card.dataset.type,
            card.dataset.tags
          ].join(" "));

          var matched = true;

          if (k && text.indexOf(k) === -1) {
            matched = false;
          }

          if (y && normalize(card.dataset.year) !== y) {
            matched = false;
          }

          if (t && normalize(card.dataset.type) !== t) {
            matched = false;
          }

          if (r && normalize(card.dataset.region) !== r) {
            matched = false;
          }

          card.style.display = matched ? "" : "none";

          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("show", visible === 0);
        }
      }

      [keyword, year, type, region].forEach(function (control) {
        if (control) {
          control.addEventListener("input", filterCards);
          control.addEventListener("change", filterCards);
        }
      });

      filterCards();
    });

    var player = document.querySelector("[data-player]");

    if (player && typeof movieSource === "string") {
      var video = player.querySelector("video");
      var shade = player.querySelector(".player-shade");
      var button = player.querySelector(".player-start");
      var attached = false;
      var hlsInstance = null;

      function attachMedia() {
        if (!video || attached) {
          return;
        }

        attached = true;

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(movieSource);
          hlsInstance.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = movieSource;
        }
      }

      function startPlay() {
        if (!video) {
          return;
        }

        attachMedia();
        player.classList.add("is-playing");
        video.controls = true;

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener("click", startPlay);
      }

      if (shade) {
        shade.addEventListener("click", startPlay);
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          startPlay();
        }
      });

      window.addEventListener("beforeunload", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    }
  });
})();

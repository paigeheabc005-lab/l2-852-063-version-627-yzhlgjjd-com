(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-nav]");

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(
      hero.querySelectorAll("[data-hero-slide]"),
    );
    var dots = Array.prototype.slice.call(
      hero.querySelectorAll("[data-hero-dot]"),
    );
    var index = 0;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }
  }

  function cardText(card) {
    return [
      card.getAttribute("data-title"),
      card.getAttribute("data-year"),
      card.getAttribute("data-type"),
      card.getAttribute("data-category"),
      card.getAttribute("data-region"),
      card.getAttribute("data-genre"),
      card.textContent,
    ]
      .join(" ")
      .toLowerCase();
  }

  function initFilters() {
    var panels = Array.prototype.slice.call(
      document.querySelectorAll("[data-filter-panel]"),
    );

    panels.forEach(function (panel) {
      var scope = panel.parentElement || document;
      var keyword = panel.querySelector("[data-filter-keyword]");
      var year = panel.querySelector("[data-filter-year]");
      var type = panel.querySelector("[data-filter-type]");
      var category = panel.querySelector("[data-filter-category]");
      var count = panel.querySelector("[data-filter-count]");
      var cards = Array.prototype.slice.call(
        scope.querySelectorAll(".movie-card"),
      );
      var empty = scope.querySelector("[data-empty-state]");

      function apply() {
        var q = keyword ? keyword.value.trim().toLowerCase() : "";
        var y = year ? year.value : "";
        var t = type ? type.value : "";
        var c = category ? category.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var ok = true;

          if (q && cardText(card).indexOf(q) === -1) {
            ok = false;
          }

          if (y && card.getAttribute("data-year") !== y) {
            ok = false;
          }

          if (t && card.getAttribute("data-type") !== t) {
            ok = false;
          }

          if (c && card.getAttribute("data-category") !== c) {
            ok = false;
          }

          card.style.display = ok ? "" : "none";

          if (ok) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = "当前显示 " + visible + " 部";
        }

        if (empty) {
          empty.style.display = visible ? "none" : "block";
        }
      }

      [keyword, year, type, category].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });

      var params = new URLSearchParams(window.location.search);
      var query = params.get("q");

      if (query && keyword) {
        keyword.value = query;
      }

      apply();
    });
  }

  function initBackToTop() {
    var button = document.querySelector("[data-back-to-top]");

    if (!button) {
      return;
    }

    window.addEventListener("scroll", function () {
      button.classList.toggle("is-visible", window.scrollY > 360);
    });

    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  ready(function () {
    initNavigation();
    initHero();
    initFilters();
    initBackToTop();
  });
})();

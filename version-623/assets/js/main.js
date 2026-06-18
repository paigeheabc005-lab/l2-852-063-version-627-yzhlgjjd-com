(function () {
    function toText(value) {
        return (value || "").toString().toLowerCase().trim();
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        var prev = root.querySelector("[data-hero-prev]");
        var next = root.querySelector("[data-hero-next]");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function initSearchForms() {
        var forms = Array.prototype.slice.call(document.querySelectorAll("[data-search-form]"));
        forms.forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input || !input.value.trim()) {
                    event.preventDefault();
                    window.location.href = "./search.html";
                }
            });
        });
    }

    function initCardFilters() {
        var input = document.querySelector("[data-card-filter]");
        var container = document.querySelector("[data-filter-container]") || document;
        var cards = Array.prototype.slice.call(container.querySelectorAll("[data-filter-card]"));
        if (!input || !cards.length) {
            return;
        }
        var selects = Array.prototype.slice.call(document.querySelectorAll("[data-card-select]"));

        function apply() {
            var query = toText(input.value);
            var selected = {};
            selects.forEach(function (select) {
                selected[select.getAttribute("data-card-select")] = toText(select.value);
            });
            cards.forEach(function (card) {
                var text = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags"),
                    card.textContent
                ].map(toText).join(" ");
                var passQuery = !query || text.indexOf(query) !== -1;
                var passSelects = selects.every(function (select) {
                    var key = select.getAttribute("data-card-select");
                    var value = selected[key];
                    if (!value) {
                        return true;
                    }
                    return toText(card.getAttribute("data-" + key)).indexOf(value) !== -1;
                });
                card.classList.toggle("is-filtered-out", !(passQuery && passSelects));
            });
        }

        if (input.hasAttribute("data-sync-query")) {
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");
            if (q) {
                input.value = q;
            }
        }
        input.addEventListener("input", apply);
        selects.forEach(function (select) {
            select.addEventListener("change", apply);
        });
        apply();
    }

    function initImageFallback() {
        var images = Array.prototype.slice.call(document.querySelectorAll("img"));
        images.forEach(function (image) {
            image.addEventListener("error", function () {
                image.classList.add("image-hidden");
            }, { once: true });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initMenu();
        initHero();
        initSearchForms();
        initCardFilters();
        initImageFallback();
    });
})();

(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMobileNav() {
        var toggle = qs('.nav-toggle');
        var nav = qs('.mobile-nav');
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener('click', function () {
            var open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    function initHero() {
        var slider = qs('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = qsa('.hero-slide', slider);
        var dots = qsa('[data-slide]', slider);
        var prev = qs('[data-hero-prev]', slider);
        var next = qs('[data-hero-next]', slider);
        var index = 0;
        var timer;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide')) || 0);
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

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function getLower(value) {
        return String(value || '').toLowerCase();
    }

    function initLibraryFilters() {
        qsa('[data-filter-panel]').forEach(function (panel) {
            var section = panel.parentElement;
            var search = qs('[data-filter-search]', panel);
            var region = qs('[data-filter-region]', panel);
            var type = qs('[data-filter-type]', panel);
            var year = qs('[data-filter-year]', panel);
            var cards = qsa('.movie-card', section);
            var empty = qs('[data-empty-state]', section);

            function apply() {
                var keyword = getLower(search && search.value);
                var regionValue = getLower(region && region.value);
                var typeValue = getLower(type && type.value);
                var yearValue = getLower(year && year.value);
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute('data-title'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-type'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-genre'),
                        card.textContent
                    ].join(' ').toLowerCase();

                    var matched = true;
                    if (keyword && haystack.indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (regionValue && getLower(card.getAttribute('data-region')) !== regionValue) {
                        matched = false;
                    }
                    if (typeValue && getLower(card.getAttribute('data-type')) !== typeValue) {
                        matched = false;
                    }
                    if (yearValue && getLower(card.getAttribute('data-year')) !== yearValue) {
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

            [search, region, type, year].forEach(function (field) {
                if (field) {
                    field.addEventListener('input', apply);
                    field.addEventListener('change', apply);
                }
            });
            apply();
        });
    }

    function cardTemplate(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return [
            '<article class="movie-card movie-card-poster">',
            '<a class="movie-cover" href="movie-' + movie.id + '.html" aria-label="观看 ' + escapeHtml(movie.title) + '">',
            '<img src="./' + movie.poster + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="movie-quality">HD</span>',
            '<span class="movie-play">▶</span>',
            '</a>',
            '<div class="movie-info">',
            '<div class="movie-meta-line"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
            '<h3><a href="movie-' + movie.id + '.html">' + escapeHtml(movie.title) + '</a></h3>',
            '<p>' + escapeHtml(movie.oneLine || '') + '</p>',
            '<div class="card-tags">' + tags + '</div>',
            '<div class="card-bottom"><span class="rating">★ ' + escapeHtml(movie.rating) + '</span><a href="movie-' + movie.id + '.html">立即观看</a></div>',
            '</div>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function initSearchPage() {
        var page = qs('[data-search-page]');
        if (!page || !window.MOVIES) {
            return;
        }
        var form = qs('[data-search-form]', page);
        var input = qs('[data-search-input]', page);
        var category = qs('[data-search-category]', page);
        var year = qs('[data-search-year]', page);
        var summary = qs('[data-search-summary]', page);
        var results = qs('[data-search-results]', page);
        var params = new URLSearchParams(window.location.search);
        var initial = params.get('q') || '';
        if (input) {
            input.value = initial;
        }

        function render() {
            var keyword = getLower(input && input.value);
            var categoryValue = getLower(category && category.value);
            var yearValue = getLower(year && year.value);
            var matched = window.MOVIES.filter(function (movie) {
                var text = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.categoryName, movie.oneLine, (movie.tags || []).join(' ')].join(' ').toLowerCase();
                if (keyword && text.indexOf(keyword) === -1) {
                    return false;
                }
                if (categoryValue && getLower(movie.category) !== categoryValue) {
                    return false;
                }
                if (yearValue && getLower(movie.year) !== yearValue) {
                    return false;
                }
                return true;
            }).slice(0, 120);

            if (!keyword && !categoryValue && !yearValue) {
                matched = window.MOVIES.slice(0, 24);
            }

            if (summary) {
                summary.textContent = matched.length ? '已显示匹配影片，点击卡片进入播放详情。' : '暂无匹配影片，请更换关键词。';
            }
            if (results) {
                results.innerHTML = matched.map(cardTemplate).join('');
            }
        }

        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                render();
            });
        }
        [input, category, year].forEach(function (field) {
            if (field) {
                field.addEventListener('input', render);
                field.addEventListener('change', render);
            }
        });
        render();
    }

    function initScrollPlayer() {
        qsa('[data-scroll-player]').forEach(function (link) {
            link.addEventListener('click', function (event) {
                var player = qs('[data-player]');
                if (player) {
                    event.preventDefault();
                    player.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    var button = qs('.player-button', player);
                    if (button) {
                        button.focus();
                    }
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMobileNav();
        initHero();
        initLibraryFilters();
        initSearchPage();
        initScrollPlayer();
    });
}());

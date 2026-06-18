
(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var scope = document.querySelector('[data-global-search]');
    var list = document.querySelector('[data-search-results]');
    var data = window.MOVIE_SEARCH_DATA || [];

    if (!scope || !list || !data.length) {
      return;
    }

    var input = scope.querySelector('[data-search-input]');
    var type = scope.querySelector('[data-search-type]');
    var year = scope.querySelector('[data-search-year]');
    var reset = scope.querySelector('[data-search-reset]');
    var count = scope.querySelector('[data-search-count]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (input && query) {
      input.value = query;
    }

    function render() {
      var keyword = normalize(input ? input.value : '');
      var selectedType = type ? type.value : '';
      var selectedYear = year ? year.value : '';
      var results = data.filter(function (movie) {
        var text = normalize([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          (movie.tags || []).join(' '),
          movie.oneLine
        ].join(' '));

        var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchedType = !selectedType || movie.type === selectedType;
        var matchedYear = !selectedYear || movie.year === selectedYear;

        return matchedKeyword && matchedType && matchedYear;
      });

      if (count) {
        count.textContent = results.length + ' 部影片';
      }

      list.innerHTML = results.slice(0, 240).map(createCard).join('');

      if (!results.length) {
        list.innerHTML = '<div class="article-panel"><h2>没有找到匹配影片</h2><p>请尝试更换关键词、年份或类型。</p></div>';
      }
    }

    [input, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', render);
        control.addEventListener('change', render);
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
        render();
      });
    }

    render();
  });

  function createCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card" data-card>',
      '  <a href="' + escapeAttr(movie.url) + '" class="card-cover" aria-label="观看 ' + escapeAttr(movie.title) + '">',
      '    <img src="' + escapeAttr(movie.cover) + '" alt="' + escapeAttr(movie.title) + '" loading="lazy">',
      '    <span class="card-play">立即观看</span>',
      '  </a>',
      '  <div class="card-body">',
      '    <div class="card-meta">',
      '      <span>' + escapeHtml(movie.year) + '</span>',
      '      <span>' + escapeHtml(movie.region) + '</span>',
      '      <span>' + escapeHtml(movie.type) + '</span>',
      '    </div>',
      '    <h3><a href="' + escapeAttr(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }
})();

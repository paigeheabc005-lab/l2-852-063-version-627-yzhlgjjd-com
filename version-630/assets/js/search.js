(function () {
  var input = document.getElementById('searchInput');
  var results = document.getElementById('searchResults');
  var data = window.MOVIE_SEARCH_DATA || [];
  var params = new URLSearchParams(window.location.search);

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '' +
      '<article class="movie-card">' +
        '<a class="movie-link" href="' + escapeHtml(movie.href) + '">' +
          '<span class="poster-wrap">' +
            '<img src="./' + escapeHtml(movie.poster) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<span class="play-dot">▶</span>' +
          '</span>' +
          '<span class="movie-info">' +
            '<strong>' + escapeHtml(movie.title) + '</strong>' +
            '<em>' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.type) + '</em>' +
            '<span class="movie-genre">' + escapeHtml(movie.genre) + '</span>' +
            '<span class="movie-desc">' + escapeHtml(movie.desc) + '</span>' +
            '<span class="tag-row">' + tags + '</span>' +
          '</span>' +
        '</a>' +
      '</article>';
  }

  function render(query) {
    var value = (query || '').trim().toLowerCase();

    if (!value) {
      results.innerHTML = '<div class="empty-state">输入关键词后即可查看相关影片。</div>';
      return;
    }

    var matched = data.filter(function (movie) {
      var text = [
        movie.title,
        movie.year,
        movie.region,
        movie.type,
        movie.genre,
        (movie.tags || []).join(' '),
        movie.desc
      ].join(' ').toLowerCase();
      return text.indexOf(value) !== -1;
    }).slice(0, 80);

    if (!matched.length) {
      results.innerHTML = '<div class="empty-state">暂无匹配影片，换个关键词试试。</div>';
      return;
    }

    results.innerHTML = matched.map(card).join('');
  }

  if (input) {
    input.value = params.get('q') || '';
    input.addEventListener('input', function () {
      render(input.value);
    });
  }

  document.querySelectorAll('[data-search-word]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (input) {
        input.value = button.getAttribute('data-search-word') || '';
        render(input.value);
      }
    });
  });

  render(input ? input.value : '');
})();

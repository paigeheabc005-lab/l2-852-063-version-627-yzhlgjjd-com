
(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var player = document.querySelector('[data-player]');

    if (!player) {
      return;
    }

    var video = player.querySelector('[data-player-video]');
    var button = player.querySelector('[data-player-button]');
    var status = player.querySelector('[data-player-status]');
    var hlsInstance = null;
    var hasStarted = false;

    if (!video || !button) {
      return;
    }

    button.addEventListener('click', function () {
      var src = button.getAttribute('data-src');

      if (!src) {
        setStatus('播放源暂不可用。');
        return;
      }

      if (!hasStarted) {
        bindSource(video, src);
        hasStarted = true;
      }

      player.classList.add('is-playing');
      setStatus('正在载入高清播放源...');

      var playPromise = video.play();

      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(function () {
          setStatus('正在播放。');
        }).catch(function () {
          player.classList.remove('is-playing');
          setStatus('浏览器限制自动播放，请再次点击播放按钮。');
        });
      }
    });

    video.addEventListener('pause', function () {
      if (!video.ended) {
        player.classList.remove('is-playing');
        setStatus('已暂停，点击播放按钮继续。');
      }
    });

    video.addEventListener('playing', function () {
      player.classList.add('is-playing');
      setStatus('正在播放。');
    });

    video.addEventListener('error', function () {
      player.classList.remove('is-playing');
      setStatus('当前线路加载失败，请刷新页面或稍后重试。');
    });

    function bindSource(videoElement, sourceUrl) {
      if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = sourceUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          maxBufferLength: 32,
          enableWorker: true
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(videoElement);
        return;
      }

      videoElement.src = sourceUrl;
    }

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();

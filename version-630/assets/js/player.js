(function () {
  var hlsPromise = null;

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }

    if (hlsPromise) {
      return hlsPromise;
    }

    hlsPromise = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    return hlsPromise;
  }

  function attachHls(video, stream) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return Promise.resolve();
    }

    return loadHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        var hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        video._hlsInstance = hls;
        return;
      }
      video.src = stream;
    }).catch(function () {
      video.src = stream;
    });
  }

  window.initMoviePlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var layer = document.getElementById(options.layerId);
    var started = false;

    if (!video || !layer || !options.stream) {
      return;
    }

    function start() {
      if (started) {
        video.play().catch(function () {});
        return;
      }

      started = true;
      layer.classList.add('is-hidden');

      attachHls(video, options.stream).then(function () {
        video.play().catch(function () {});
      });
    }

    layer.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (!started) {
        start();
      }
    });
  };
})();

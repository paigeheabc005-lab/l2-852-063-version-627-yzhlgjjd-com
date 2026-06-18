var Hls = window.Hls;
var shells = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));

shells.forEach(function (shell) {
  var video = shell.querySelector('video');
  var button = shell.querySelector('.player-start');
  var src = shell.getAttribute('data-video');
  var attached = false;

  var attach = function () {
    if (!video || !src || attached) return;
    attached = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (Hls && Hls.isSupported()) {
      var hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }
  };

  var play = function () {
    attach();
    shell.classList.add('is-playing');
    var result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(function () {
        shell.classList.remove('is-playing');
      });
    }
  };

  if (button) {
    button.addEventListener('click', play);
  }
  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      if (video.currentTime === 0 || video.ended) {
        shell.classList.remove('is-playing');
      }
    });
  }
});

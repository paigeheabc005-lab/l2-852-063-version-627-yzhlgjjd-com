(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setStatus(node, message) {
    if (node) {
      node.textContent = message;
    }
  }

  function attachPlayer(root) {
    var video = root.querySelector("video");
    var button = root.querySelector("[data-play-button]");
    var status = root.querySelector("[data-player-status]");
    var source = root.getAttribute("data-video-source");
    var started = false;
    var hlsInstance = null;

    if (!video || !button || !source) {
      return;
    }

    function play() {
      if (!started) {
        started = true;
        setStatus(status, "正在载入播放源...");

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setStatus(
              status,
              "播放源已就绪，正在播放。可使用播放器控制全屏、进度和音量。",
            );
            video.play().catch(function () {
              setStatus(status, "播放源已就绪，请再次点击播放器开始播放。");
            });
          });
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setStatus(
                status,
                "播放过程中遇到网络或媒体错误，请刷新后重试。 ",
              );
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          video.addEventListener(
            "loadedmetadata",
            function () {
              setStatus(status, "播放源已就绪，正在播放。 ");
              video.play().catch(function () {
                setStatus(status, "播放源已就绪，请再次点击播放器开始播放。");
              });
            },
            { once: true },
          );
        } else {
          video.src = source;
          video.play().catch(function () {
            setStatus(
              status,
              "当前浏览器不支持 HLS 播放，请换用最新版 Chrome、Edge 或 Safari。 ",
            );
          });
        }
      } else {
        video.play();
      }

      button.style.display = "none";
      video.controls = true;
    }

    button.addEventListener("click", play);
    video.addEventListener("click", function () {
      if (!started) {
        play();
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    Array.prototype.slice
      .call(document.querySelectorAll("[data-video-source]"))
      .forEach(attachPlayer);
  });
})();

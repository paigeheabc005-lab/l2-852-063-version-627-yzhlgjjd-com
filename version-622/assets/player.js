(function () {
    function initializePlayer(player) {
        var video = player.querySelector('video[data-src]');
        var button = player.querySelector('.player-button');
        var status = player.querySelector('[data-player-status]');
        if (!video) {
            return;
        }
        var source = video.getAttribute('data-src');
        var hlsInstance = null;

        function setStatus(text, ready) {
            if (!status) {
                return;
            }
            status.textContent = text;
            status.classList.toggle('ready', Boolean(ready));
        }

        function attachSource() {
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setStatus('播放源已就绪', true);
                });
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus('播放源加载失败，请稍后重试', false);
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.addEventListener('loadedmetadata', function () {
                    setStatus('播放源已就绪', true);
                });
            } else {
                video.src = source;
                setStatus('正在尝试使用浏览器播放', false);
            }
        }

        function togglePlay() {
            if (video.paused) {
                video.play().then(function () {
                    player.classList.add('playing');
                }).catch(function () {
                    setStatus('点击视频控件开始播放', false);
                });
            } else {
                video.pause();
                player.classList.remove('playing');
            }
        }

        attachSource();

        if (button) {
            button.addEventListener('click', togglePlay);
        }
        video.addEventListener('click', togglePlay);
        video.addEventListener('play', function () {
            player.classList.add('playing');
        });
        video.addEventListener('pause', function () {
            player.classList.remove('playing');
        });
        video.addEventListener('canplay', function () {
            setStatus('播放源已就绪', true);
        });
        video.addEventListener('error', function () {
            setStatus('播放源加载失败，请稍后重试', false);
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(initializePlayer);
    });
}());

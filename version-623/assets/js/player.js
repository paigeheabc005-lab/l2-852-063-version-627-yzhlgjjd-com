(function () {
    window.initMoviePlayer = function (options) {
        var video = document.querySelector(options.videoSelector);
        var button = document.querySelector(options.buttonSelector);
        if (!video || !button || !options.source) {
            return;
        }
        var card = video.closest(".player-card");
        var message = card ? card.querySelector(".player-message") : null;
        var prepared = false;
        var hlsInstance = null;

        function showMessage() {
            if (message) {
                message.hidden = false;
            }
        }

        function attach() {
            if (prepared) {
                return;
            }
            prepared = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = options.source;
                return;
            }
            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hlsInstance.loadSource(options.source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showMessage();
                    }
                });
                return;
            }
            video.src = options.source;
        }

        function play() {
            attach();
            button.classList.add("is-hidden");
            var request = video.play();
            if (request && typeof request.catch === "function") {
                request.catch(function () {
                    button.classList.remove("is-hidden");
                });
            }
        }

        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (!prepared || video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            button.classList.add("is-hidden");
        });
        video.addEventListener("error", showMessage);
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();

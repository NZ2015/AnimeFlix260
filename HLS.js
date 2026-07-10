// hls-player.js — expose une fonction initHls(videoSelectorOrElement, url, options)
// Ne nommez pas ce fichier "hls.js" pour éviter toute confusion avec la librairie.
(function () {
  function initHls(videoEl, hlsUrl, options = {}) {
    const video = typeof videoEl === 'string' ? document.querySelector(videoEl) : videoEl;
    if (!video) {
      console.error('initHls : élément video introuvable');
      return null;
    }

    // Safari supporte HLS nativement
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsUrl;
      return null;
    }

    if (window.Hls && Hls.isSupported()) {
      const hls = new Hls(options);
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // exemple : démarrer automatiquement si muted (politique autoplay)
        // video.muted = true;
        // video.play().catch(()=>{});
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Relancer la récupération réseau
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      return hls;
    }

    console.error('HLS non supporté dans ce navigateur');
    return null;
  }

  // rendre disponible globalement pour usage simple
  window.initHls = initHls;
})();
</html>

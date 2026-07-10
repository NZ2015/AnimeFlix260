<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>HLS.js demo</title>
    <style>video{width:100%;max-width:720px}</style>
  </head>
  <body>
    <video id="video" controls crossorigin="anonymous"></video>

    <!-- hls.js depuis CDN -->
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script>
      const video = document.getElementById('video');
      const hlsUrl = 'https://example.com/stream.m3u8'; // remplacez par votre URL

      // Safari supporte HLS nativement
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        video.addEventListener('loadedmetadata', () => video.play().catch(()=>{}));
      } else if (Hls.isSupported()) {
        const hls = new Hls(/* options */);
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // lecture automatique possible si muted (autoplay policies)
          // video.muted = true; video.play();
        });

        // gestion d'erreurs basique
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS error', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // essayer de relancer le chargement
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
      } else {
        console.error('HLS non supporté dans ce navigateur');
      }
    </script>
  </body>
</html>

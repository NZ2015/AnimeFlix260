// installation : npm install hls.js
import Hls from 'hls.js';

export function attachHls(videoEl, url) {
  if (!videoEl) return;
  if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
    videoEl.src = url;
    return;
  }
  if (Hls.isSupported()) {
    const hls = new Hls({
      // options utiles : enableWorker: true, lowLatencyMode: true (selon version)
    });
    hls.loadSource(url);
    hls.attachMedia(videoEl);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {});
    return hls; // retourne instance pour contrôler / écouter évènements
  }
  throw new Error('HLS not supported');
}

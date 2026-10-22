<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lecteur AnimeFlix260</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Segoe UI", Tahoma, sans-serif; background: #020617; color: white; }
    .topbar { padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(15,23,42,0.9); }
    .topbar-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .logo { color: #f472b6; font-weight: 800; font-size: 1.7rem; }
    .back-btn { padding: 10px 12px; border: 1px solid rgba(255,255,255,0.12); color: white; border-radius: 10px; }
    .page { max-width: 1200px; margin: 0 auto; padding: 24px 20px 40px; }
    .info-bar { margin-bottom: 18px; }
    .watch-area { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
    .video-shell { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; }
    video { width: 100%; display: block; background: black; min-height: 420px; }
    .controls { display: flex; flex-wrap: wrap; gap: 10px; padding: 16px; }
    .controls select, .controls button { padding: 10px 12px; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; background: rgba(255,255,255,0.04); color: white; }
    .episodes-panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 18px; }
    .episodes-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 10px; margin-top: 12px; }
    .episode-pill { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: white; border-radius: 10px; padding: 10px; cursor: pointer; }
    .episode-pill.active { background: linear-gradient(135deg, #ec4899, #8b5cf6); }
    @media (max-width: 780px) { .watch-area { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="topbar-inner">
      <div class="logo">AnimeFlix260</div>
      <a class="back-btn" href="index.html">Retour</a>
    </div>
  </div>

  <main class="page">
    <div class="info-bar">
      <h1 id="animeTitle">Chargement...</h1>
      <div id="episodeInfo">Saison 1 • Épisode 1</div>
    </div>

    <div class="watch-area">
      <div class="video-shell">
        <video id="videoPlayer" controls autoplay playsinline></video>
        <div class="controls">
          <select id="speedSelector">
            <option value="0.75">0.75x</option>
            <option value="1" selected>1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
          <select id="subtitleSelector">
            <option value="off">Sous-titres : off</option>
            <option value="fr">Français</option>
            <option value="en">Anglais</option>
          </select>
          <button id="fullscreenBtn">Plein écran</button>
          <button id="prevBtn">Précédent</button>
          <button id="nextBtn">Suivant</button>
        </div>
      </div>
      <aside class="episodes-panel">
        <h2>Épisodes</h2>
        <div id="episodeCount">0 épisodes</div>
        <div id="episodesList" class="episodes-list"></div>
      </aside>
    </div>
  </main>

  <script src="app-data.js"></script>
  <script src="joueur-script.js"></script>
</body>
</html>

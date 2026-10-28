<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Détails Anime - AnimeFlix260</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #fff;
      min-height: 100vh;
    }
    header {
      background: rgba(0,0,0,0.8);
      padding: 20px 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    }
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      background: linear-gradient(135deg, #ff006e, #8338ec);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      cursor: pointer;
    }
    .nav-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    .btn {
      padding: 10px 20px;
      border: 2px solid #ff006e;
      background: transparent;
      color: #ff006e;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .anime-header {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 40px;
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.1);
      border-radius: 15px;
      padding: 30px;
    }
    .anime-poster {
      width: 100%;
      aspect-ratio: 2/3;
      border-radius: 10px;
      overflow: hidden;
      background: linear-gradient(135deg, #8338ec, #3a86ff);
    }
    .anime-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .anime-title {
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 20px;
      background: linear-gradient(135deg, #ff006e, #8338ec);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .anime-meta {
      display: grid;
      grid-template-columns: repeat(2, minmax(180px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .meta-item {
      background: rgba(255, 0, 110, 0.1);
      border-left: 4px solid #ff006e;
      border-radius: 8px;
      padding: 15px;
    }
    .meta-label {
      font-size: 12px;
      color: #ff006e;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .meta-value {
      font-size: 16px;
      color: #fff;
    }
    .anime-rating {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
    }
    .stars {
      font-size: 32px;
      color: #ffd700;
    }
    .rating-text {
      font-size: 24px;
    }
    .anime-description {
      font-size: 16px;
      line-height: 1.8;
      color: rgba(255,255,255,0.75);
      margin-bottom: 20px;
    }
    .genres-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    .genre-tag {
      background: rgba(255,0,110,0.2);
      color: #ff006e;
      border: 1px solid rgba(255,0,110,0.4);
      border-radius: 20px;
      padding: 8px 15px;
      font-size: 14px;
    }
    .action-buttons {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }
    .action-btn {
      padding: 15px 20px;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
    }
    .primary-btn {
      background: linear-gradient(135deg, #ff006e, #8338ec);
      color: #fff;
    }
    .secondary-btn {
      background: rgba(255,255,255,0.08);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.2);
    }
    @media (max-width: 768px) {
      .anime-header { grid-template-columns: 1fr; }
      .anime-title { font-size: 32px; }
    }
  </style>
</head>
<body data-page="details">
  <header>
    <div class="header-content">
      <div class="logo" onclick="window.location.href='index.html'">🎬 AnimeFlix260</div>
      <div class="nav-buttons">
        <a href="index.html" class="btn">Accueil</a>
        <a href="categories.html" class="btn">Catégories</a>
        <a href="favorites.html" class="btn">❤️ Favoris</a>
      </div>
    </div>
  </header>

  <div class="container">
    <div id="animeDetails"></div>
  </div>

  <script src="script.js"></script>
</body>
</html>

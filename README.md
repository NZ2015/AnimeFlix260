<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin - AnimeFlix260</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Segoe UI", Tahoma, sans-serif; background: linear-gradient(135deg, #0f172a, #111827); color: white; }
    a { text-decoration: none; color: white; }
    header { background: rgba(15, 23, 42, 0.9); border-bottom: 1px solid rgba(255,255,255,0.12); }
    .header-inner { max-width: 1200px; margin: 0 auto; padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; }
    .logo { color: #f472b6; font-weight: 800; font-size: 1.8rem; }
    nav { display: flex; gap: 12px; flex-wrap: wrap; }
    nav a { padding: 10px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.12); }
    nav a:hover, nav a.active { background: linear-gradient(135deg, #ec4899, #8b5cf6); border-color: transparent; }
    .page { max-width: 1200px; margin: 0 auto; padding: 40px 20px 60px; }
    .grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 20px; }
    .panel { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 20px; }
    form { display: grid; gap: 12px; }
    input, textarea, button { width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12); background: rgba(15,23,42,0.9); color: white; }
    button { background: linear-gradient(135deg, #ec4899, #8b5cf6); border: none; font-weight: 700; cursor: pointer; }
    ul { margin: 0; padding-left: 18px; color: #cbd5e1; }
    li { margin: 6px 0; }
    .admin-table { display: grid; gap: 10px; }
    .anime-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; background: rgba(255,255,255,0.02); padding: 12px; border-radius: 12px; }
    .row-actions { display: flex; gap: 8px; }
    @media (max-width: 780px) { .grid { grid-template-columns: 1fr; } .header-inner { flex-direction: column; } }
  </style>
</head>
<body>
  <header>
    <div class="header-inner">
      <div class="logo">AnimeFlix260</div>
      <nav>
        <a href="index.html">Accueil</a>
        <a href="categories.html">Catégories</a>
        <a href="favorites.html">Liste</a>
        <a href="account.html">Compte</a>
        <a class="active" href="admin.html">Admin</a>
      </nav>
    </div>
  </header>

  <main class="page">
    <div class="grid">
      <section class="panel">
        <h2>Ajouter / éditer un anime</h2>
        <form id="animeForm">
          <input id="titleInput" type="text" placeholder="Titre">
          <input id="authorInput" type="text" placeholder="Auteur">
          <input id="studioInput" type="text" placeholder="Studio">
          <input id="yearInput" type="number" placeholder="Année">
          <input id="episodesInput" type="number" placeholder="Nombre d'épisodes">
          <input id="ratingInput" type="number" step="0.1" placeholder="Note">
          <input id="posterInput" type="text" placeholder="URL poster">
          <textarea id="descriptionInput" rows="4" placeholder="Description"></textarea>
          <input id="genresInput" type="text" placeholder="Genres séparés par des virgules">
          <button type="submit">Enregistrer l'anime</button>
        </form>
      </section>

      <section class="panel">
        <h2>Actions rapides</h2>
        <ul>
          <li>Ajouter / modifier des animes</li>
          <li>Corriger les affiches</li>
          <li>Ajouter les sources vidéo</li>
          <li>Gérer les saisons et épisodes</li>
        </ul>
      </section>
    </div>

    <section class="panel" style="margin-top: 22px;">
      <h2>Catalogue admin</h2>
      <div id="catalogList" class="admin-table"></div>
    </section>
  </main>

  <script src="app-data.js"></script>
  <script>
    const form = document.getElementById("animeForm");
    const catalogList = document.getElementById("catalogList");

    async function loadAdminCatalog() {
      const catalog = await window.AnimeFlix.loadAnimeCatalog();
      catalogList.innerHTML = catalog.map((anime) => `
        <div class="anime-row">
          <div>
            <strong>${anime.title}</strong><br>
            <small>${anime.studio} • ${anime.author}</small>
          </div>
          <div class="row-actions">
            <button onclick="location.href='details.html?id=${anime.id}'">Voir</button>
            <button onclick="removeAnime(${anime.id})">Supprimer</button>
          </div>
        </div>
      `).join("");
    }

    function removeAnime(id) {
      const custom = JSON.parse(localStorage.getItem("animeFlix_admin_animes") || "[]");
      const next = custom.filter((anime) => Number(anime.id) !== Number(id));
      localStorage.setItem("animeFlix_admin_animes", JSON.stringify(next));
      loadAdminCatalog();
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const custom = JSON.parse(localStorage.getItem("animeFlix_admin_animes") || "[]");
      const item = {
        id: Date.now(),
        title: document.getElementById("titleInput").value.trim(),
        author: document.getElementById("authorInput").value.trim() || "Auteur inconnu",
        studio: document.getElementById("studioInput").value.trim() || "Studio inconnu",
        releaseYear: Number(document.getElementById("yearInput").value || 2025),
        totalEpisodes: Number(document.getElementById("episodesInput").value || 12),
        rating: Number(document.getElementById("ratingInput").value || 4),
        poster: document.getElementById("posterInput").value.trim() || "images/default-poster.jpg",
        description: document.getElementById("descriptionInput").value.trim() || "Nouvel anime ajouté.",
        genres: document.getElementById("genresInput").value.split(",").map((g) => g.trim()).filter(Boolean),
        seasons: [{
          number: 1,
          title: "Saison 1",
          episodes: [{
            number: 1,
            title: "Épisode 1",
            duration: "24:00",
            videoUrl: ""
          }]
        }]
      };

      custom.unshift(item);
      localStorage.setItem("animeFlix_admin_animes", JSON.stringify(custom));
      form.reset();
      loadAdminCatalog();
    });

    loadAdminCatalog();
  </script>
</body>
</html>

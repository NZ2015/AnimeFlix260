// ===============================
// IrAnimeX Script (updated: favorites & image attributes)
// ===============================

let animes = [];
let filteredAnimes = [];
let currentPage = 0;
const perPage = 6;

// Chargement du fichier anime.json
fetch("anime.json")
    .then(response => response.json())
    .then(data => {

        animes = data.animes;
        filteredAnimes = [...animes];

        renderPage();

    })
    .catch(error => {

        console.error("Erreur anime.json :", error);

    });

// ===============================
// Affichage
// ===============================

function renderPage() {

    const container = document.getElementById("animeList");

    if (!container) return;

    container.innerHTML = "";

    const start = currentPage * perPage;
    const end = start + perPage;

    const page = filteredAnimes.slice(start, end);

    page.forEach(anime => {
        container.innerHTML += creerCarte(anime);
    });

    // after injecting cards ensure badges and other enhacements
    ajouterBadges();
}

// ===============================
// Pagination
// ===============================

function nextPage() {

    if ((currentPage + 1) * perPage < filteredAnimes.length) {

        currentPage++;

        renderPage();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}

function prevPage() {

    if (currentPage > 0) {

        currentPage--;

        renderPage();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

}

// ===============================
// Recherche
// ===============================

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const texte = this.value.toLowerCase();

        filteredAnimes = animes.filter(anime => {

            return (

                anime.title.toLowerCase().includes(texte) ||

                anime.description.toLowerCase().includes(texte) ||

                anime.genres.join(" ").toLowerCase().includes(texte)

            );

        });

        currentPage = 0;

        renderPage();

    });

}
// ===============================
// FAVORIS
// ===============================

// Charger les favoris
let favoris = JSON.parse(localStorage.getItem("favoris")) || [];

// Vérifie si un anime est en favori
function estFavori(id) {
    return favoris.includes(id);
}

// Ajouter / retirer un favori
function toggleFavori(id) {

    if (estFavori(id)) {
        favoris = favoris.filter(f => f !== id);
    } else {
        favoris.push(id);
    }

    localStorage.setItem("favoris", JSON.stringify(favoris));

    // re-render page to update hearts & UI
    renderPage();
}

// ===============================
// CREER CARTE (template safe updates)
// ===============================

function creerCarte(anime) {

    // ensure safe escaped values if needed (simple usage here)
    const poster = anime.poster || "images/default.jpg";
    const altText = `Affiche de ${anime.title}`;
    const heart = estFavori(anime.id) ? '♥' : '♡';

    return `
    <div class="anime-card">

        <img src="${poster}" alt="${altText}" loading="lazy" decoding="async">

        <div class="anime-info">

            <h3>${anime.title}</h3>

            <p>${anime.description}</p>

            <p class="rating">⭐ ${anime.rating}/5</p>

            <p class="genre">${anime.genres.join(" • ")}</p>

            <div class="card-buttons">

                <a href="joueur.html?animeId=${anime.id}&season=0&episode=0"
                   class="play-btn" aria-label="Regarder ${anime.title}">
                    ▶ Regarder
                </a>

                <button class="favorite-btn" data-id="${anime.id}" aria-label="Ajouter aux favoris">
                    <span class="heart">${heart}</span>
                </button>

            </div>

        </div>

    </div>
    `;
}

// ===============================
// ANIMATION DES CARTES (mouse effects kept)
// ===============================

document.addEventListener("mouseover", function (e) {

    const card = e.target.closest(".anime-card");

    if (card) {
        card.style.transform = "scale(1.05)";
        card.style.transition = "0.3s";
        card.style.zIndex = "100";
    }

});

document.addEventListener("mouseout", function (e) {

    const card = e.target.closest(".anime-card");

    if (card) {
        card.style.transform = "scale(1)";
        card.style.zIndex = "1";
    }

});

// ===============================
// BADGE HD
// ===============================

function ajouterBadges() {

    document.querySelectorAll(".anime-card").forEach(card => {

        if (!card.querySelector(".badge-hd")) {

            const badge = document.createElement("div");

            badge.className = "badge-hd";

            badge.innerHTML = "HD";

            card.appendChild(badge);

        }

    });

}

// run once to ensure existing cards updated
setInterval(ajouterBadges, 1000);

// ===============================
// SCROLL EN HAUT
// ===============================

const topBtn = document.createElement("button");

topBtn.innerHTML = "⬆";

topBtn.id = "topBtn";

document.body.appendChild(topBtn);

topBtn.onclick = () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

};

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }

});

// ===============================
// CHARGEMENT
// ===============================

window.onload = () => {

    document.body.classList.add("loaded");

};

// ===============================
// RACCOURCI CLAVIER
// ===============================

document.addEventListener("keydown", function(e){

    if(e.key==="ArrowRight"){
        nextPage();
    }

    if(e.key==="ArrowLeft"){
        prevPage();
    }

});

// delegated favorite click handler to avoid inline onclick
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.favorite-btn');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (isNaN(id)) return;
  toggleFavori(id);
  // visual toggle is handled by renderPage() re-rendering cards; if you prefer instant toggle:
  // btn.classList.toggle('active', estFavori(id));
  // const heart = btn.querySelector('.heart'); if (heart) heart.textContent = estFavori(id) ? '♥' : '♡';
});

function playEpisode(animeId, seasonNumber, episodeNumber) {
  fetch("anime.json")
    .then(res => res.json())
    .then(data => {
      const anime = data.animes.find(a => a.id === animeId);
      if (!anime) return;
      const season = anime.seasons.find(s => s.number === seasonNumber);
      if (!season) return;
      const episode = season.episodes.find(e => e.number === episodeNumber);
      if (!episode) return;

      const video = document.getElementById("videoPlayer");
      if (!video) return;
      video.src = episode.videoUrl;
      video.play();
    });
}

// ===============================
// IrAnimeX Script
// ===============================

let animes = [];
let filteredAnimes = [];
let currentPage = 0;
const perPage = 6;
let currentDurationFilter = 'Tous';
let currentSortMode = 'default';

function toMinutes(duration) {
    if (!duration) return 0;
    if (typeof duration === 'number') return duration;

    const normalized = String(duration).trim();

    if (normalized.toLowerCase().includes('h')) {
        const hours = parseFloat(normalized.split('h')[0]) || 0;
        const minutesPart = normalized.split('h')[1] || '0';
        const minutes = parseInt((minutesPart || '0').replace(/min|m/gi, '').trim(), 10) || 0;
        return (hours * 60) + minutes;
    }

    const parts = normalized.split(':').map(part => parseInt(part, 10));
    if (parts.length === 2) {
        return (parts[0] * 60) + parts[1];
    }

    return 0;
}

function formatDurationLabel(minutes) {
    if (!minutes) return 'Durée inconnue';

    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
}

function getAnimeAvgDuration(anime) {
    const values = (anime.seasons || []).flatMap(season => (season.episodes || []).map(episode => toMinutes(episode.duration)));
    if (!values.length) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function matchesDurationFilter(anime, filter) {
    if (filter === 'Tous') return true;

    const target = {
        '1h': 60,
        '2h': 120,
        '3h': 180
    };

    const avgMinutes = getAnimeAvgDuration(anime);
    const tolerance = 15;
    return Math.abs(avgMinutes - target[filter]) <= tolerance;
}

function getSortedAnimes(list) {
    const sorted = [...list];

    switch (currentSortMode) {
        case 'duration-asc':
            return sorted.sort((a, b) => getAnimeAvgDuration(a) - getAnimeAvgDuration(b));
        case 'duration-desc':
            return sorted.sort((a, b) => getAnimeAvgDuration(b) - getAnimeAvgDuration(a));
        case 'rating-desc':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        default:
            return sorted;
    }
}

function applyFilters() {
    filteredAnimes = getSortedAnimes(
        animes.filter(anime => matchesDurationFilter(anime, currentDurationFilter))
    );
    currentPage = 0;
    renderPage();
}

function bindHomeControls() {
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            currentDurationFilter = this.dataset.duration;
            document.querySelectorAll('.duration-btn').forEach(b => b.classList.toggle('active', b === this));
            applyFilters();
        });
    });

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            currentSortMode = this.value;
            applyFilters();
        });
    }
}

// Chargement du fichier anime.json
fetch('anime.json')
    .then(response => response.json())
    .then(data => {
        animes = data.animes;
        filteredAnimes = [...animes];
        bindHomeControls();
        applyFilters();
    })
    .catch(error => {
        console.error('Erreur anime.json :', error);
    });

// ===============================
// Affichage
// ===============================

function renderPage() {
    const container = document.getElementById('animeList');
    if (!container) return;

    container.innerHTML = '';

    const start = currentPage * perPage;
    const end = start + perPage;
    const page = filteredAnimes.slice(start, end);

    page.forEach(anime => {
        container.innerHTML += creerCarte(anime);
    });
}

// ===============================
// Pagination
// ===============================

function nextPage() {
    if ((currentPage + 1) * perPage < filteredAnimes.length) {
        currentPage++;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        renderPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ===============================
// Recherche
// ===============================

const searchInput = document.getElementById('searchInput');

if (searchInput) {
    searchInput.addEventListener('input', function () {
        const texte = this.value.toLowerCase().trim();

        if (!texte) {
            applyFilters();
            return;
        }

        filteredAnimes = getSortedAnimes(
            animes.filter(anime => {
                return (
                    (anime.title || '').toLowerCase().includes(texte) ||
                    (anime.description || '').toLowerCase().includes(texte) ||
                    (anime.genres || []).join(' ').toLowerCase().includes(texte)
                );
            }).filter(anime => matchesDurationFilter(anime, currentDurationFilter))
        );

        currentPage = 0;
        renderPage();
    });
}

// ===============================
// FAVORIS
// ===============================

let favoris = JSON.parse(localStorage.getItem('favoris')) || [];

function estFavori(id) {
    return favoris.includes(id);
}

function toggleFavori(id) {
    if (estFavori(id)) {
        favoris = favoris.filter(f => f !== id);
    } else {
        favoris.push(id);
    }

    localStorage.setItem('favoris', JSON.stringify(favoris));
    renderPage();
}

// ===============================
// MODIFIER L'AFFICHAGE DES CARTES
// ===============================

function creerCarte(anime) {
    const avgDuration = getAnimeAvgDuration(anime);

    return `
    <div class="anime-card">
        <img src="${anime.poster}" alt="${anime.title}">

        <div class="anime-info">
            <h3>${anime.title}</h3>
            <span class="duration-tag">⏱️ ${formatDurationLabel(avgDuration)}</span>
            <p>${anime.description}</p>
            <p class="rating">⭐ ${anime.rating}/5</p>
            <p class="genre">${(anime.genres || []).join(' • ')}</p>

            <div class="card-buttons">
                <a href="joueur.html?animeId=${anime.id}&season=0&episode=0" class="play-btn">
                    ▶ Regarder
                </a>

                <button class="favorite-btn" onclick="toggleFavori(${anime.id})">
                    ${estFavori(anime.id) ? '❤️' : '🤍'}
                </button>
            </div>
        </div>
    </div>
    `;
}

// ===============================
// ANIMATION DES CARTES
// ===============================

document.addEventListener('mouseover', function (e) {
    const card = e.target.closest('.anime-card');

    if (card) {
        card.style.transform = 'scale(1.05)';
        card.style.transition = '0.3s';
        card.style.zIndex = '100';
    }
});

document.addEventListener('mouseout', function (e) {
    const card = e.target.closest('.anime-card');

    if (card) {
        card.style.transform = 'scale(1)';
        card.style.zIndex = '1';
    }
});

// ===============================
// BADGE HD
// ===============================

function ajouterBadges() {
    document.querySelectorAll('.anime-card').forEach(card => {
        if (!card.querySelector('.badge-hd')) {
            const badge = document.createElement('div');
            badge.className = 'badge-hd';
            badge.innerHTML = 'HD';
            card.appendChild(badge);
        }
    });
}

setInterval(ajouterBadges, 1000);

// ===============================
// SCROLL EN HAUT
// ===============================

const topBtn = document.createElement('button');
topBtn.innerHTML = '⬆';
topBtn.id = 'topBtn';
document.body.appendChild(topBtn);

topBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.addEventListener('scroll', () => {
    topBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

// ===============================
// CHARGEMENT
// ===============================

window.onload = () => {
    document.body.classList.add('loaded');
};

// ===============================
// RACCOURCI CLAVIER
// ===============================

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
});

function playEpisode(animeId, seasonNumber, episodeNumber) {
    fetch('anime.json')
        .then(res => res.json())
        .then(data => {
            const anime = data.animes.find(a => a.id === animeId);
            if (!anime) return;

            const season = anime.seasons.find(s => s.number === seasonNumber);
            const episode = season?.episodes.find(e => e.number === episodeNumber);

            const video = document.getElementById('videoPlayer');
            if (video && episode) {
                video.src = episode.videoUrl;
                video.play();
            }
        });
}

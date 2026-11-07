// IrAnimeX — menu, catalogue, favoris, filtres et reprise de lecture.

const FAVORITES_KEY = 'animeFlix_favorites';
const LEGACY_FAVORITES_KEY = 'favoris';
const RESUME_KEY = 'iranimeX_resume_v1';
const PER_PAGE = 8;

let animes = [];
let visibleAnimes = [];
let currentPage = 0;
let currentDuration = 'Tous';
let currentSort = 'default';
let currentQuery = '';
let currentView = 'catalogue';
let favorites = readFavorites();

const animeList = document.getElementById('animeList');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const menuToggle = document.getElementById('menuToggle');
const mainNavigation = document.getElementById('mainNavigation');

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null');
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function readFavorites() {
  const ids = new Set();
  [FAVORITES_KEY, LEGACY_FAVORITES_KEY, 'favorites'].forEach((key) => {
    const stored = readJson(key, []);
    if (Array.isArray(stored)) stored.forEach((id) => ids.add(String(id)));
  });
  return ids;
}

function saveFavorites() {
  const values = [...favorites];
  [FAVORITES_KEY, LEGACY_FAVORITES_KEY].forEach((key) => {
    try { localStorage.setItem(key, JSON.stringify(values)); } catch (error) {
      console.warn('Impossible d’enregistrer les favoris localement.', error);
    }
  });
}

function readResumeHistory() {
  const value = readJson(RESUME_KEY, {});
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function writeResumeHistory(history) {
  try { localStorage.setItem(RESUME_KEY, JSON.stringify(history)); } catch (error) {
    console.warn('Impossible d’enregistrer la reprise de lecture.', error);
  }
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function averageDuration(anime) {
  const episodes = (anime.seasons || []).flatMap((season) => season.episodes || []);
  const minutes = episodes.map((episode) => {
    const duration = episode.duration;
    if (typeof duration === 'number') return duration;
    const value = String(duration || '').trim().toLowerCase();
    if (value.includes('h')) {
      const [hoursText, minutesText = '0'] = value.split('h');
      return (parseFloat(hoursText) || 0) * 60 + (parseInt(minutesText.replace(/min|m/gi, ''), 10) || 0);
    }
    const parts = value.split(':').map((part) => parseInt(part, 10));
    return parts.length === 2 && parts.every(Number.isFinite) ? parts[0] * 60 + parts[1] : 0;
  }).filter((value) => value > 0);
  return minutes.length ? minutes.reduce((sum, value) => sum + value, 0) / minutes.length : 0;
}

function formatDuration(minutes) {
  if (!minutes) return 'Durée inconnue';
  const hours = Math.floor(minutes / 60);
  const remainder = Math.round(minutes % 60);
  if (!hours) return `${remainder} min`;
  return remainder ? `${hours}h ${remainder}min` : `${hours}h`;
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function renderResumeSection() {
  const section = document.getElementById('resumeSection');
  const container = document.getElementById('resumeList');
  if (!section || !container) return;

  const history = readResumeHistory();
  const entries = Object.values(history)
    .filter((entry) => entry && Number(entry.currentTime) > 0)
    .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
    .map((entry) => ({ entry, anime: animes.find((item) => String(item.id) === String(entry.animeId)) }))
    .filter((item) => item.anime);

  section.hidden = entries.length === 0;
  if (!entries.length) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = entries.map(({ entry, anime }) => {
    const id = String(anime.id);
    const title = escapeHtml(anime.title || 'Anime');
    const poster = escapeHtml(anime.poster || 'images/logo.png');
    const episodeNumber = Math.max(1, Number(entry.episode) || 1);
    const seasonNumber = Math.max(1, Number(entry.season) || 1);
    const progress = Number(entry.duration) > 0
      ? Math.min(99, Math.max(0, Number(entry.currentTime) / Number(entry.duration) * 100))
      : 0;
    const episodeTitle = escapeHtml(entry.episodeTitle || `Épisode ${episodeNumber}`);
    const target = `joueur.html?animeId=${encodeURIComponent(id)}&season=${seasonNumber}&episode=${episodeNumber}&resume=1`;
    return `<article class="resume-card">
      <a class="resume-poster" href="${target}" aria-label="Reprendre ${title}, ${episodeTitle}">
        <img src="${poster}" alt="Affiche de ${title}" loading="lazy" onerror="this.onerror=null;this.src='images/logo.png';">
        <span class="resume-play" aria-hidden="true">▶</span>
      </a>
      <div class="resume-copy">
        <p class="resume-kicker">Saison ${seasonNumber} · ${episodeTitle}</p>
        <h3>${title}</h3>
        <div class="resume-progress" role="progressbar" aria-label="Progression de ${title}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(progress)}">
          <span style="width:${progress}%"></span>
        </div>
        <p class="resume-time">${formatTime(entry.currentTime)}${Number(entry.duration) > 0 ? ` / ${formatTime(entry.duration)}` : ''}</p>
        <a class="resume-button" href="${target}">Continuer à regarder</a>
      </div>
    </article>`;
  }).join('');
}

function matchesDuration(anime) {
  if (currentDuration === 'Tous') return true;
  const target = { '1h': 60, '2h': 120, '3h': 180 }[currentDuration];
  return Math.abs(averageDuration(anime) - target) <= 15;
}

function filterAndSort() {
  const query = currentQuery.trim().toLocaleLowerCase();
  let results = animes.filter((anime) => {
    const searchable = `${anime.title || ''} ${anime.description || ''} ${(anime.genres || []).join(' ')}`.toLocaleLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesFavorite = currentView !== 'favorites' || favorites.has(String(anime.id));
    return matchesQuery && matchesFavorite && matchesDuration(anime);
  });

  const sortMode = currentView === 'top-rated' ? 'rating-desc' : currentSort;
  if (sortMode === 'rating-desc') results.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  if (sortMode === 'duration-asc') results.sort((a, b) => averageDuration(a) - averageDuration(b));
  if (sortMode === 'duration-desc') results.sort((a, b) => averageDuration(b) - averageDuration(a));
  return results;
}

function render() {
  if (!animeList) return;
  visibleAnimes = filterAndSort();
  const pageCount = Math.max(1, Math.ceil(visibleAnimes.length / PER_PAGE));
  currentPage = Math.min(currentPage, pageCount - 1);
  const pageItems = visibleAnimes.slice(currentPage * PER_PAGE, (currentPage + 1) * PER_PAGE);

  if (!pageItems.length) {
    animeList.innerHTML = `<p class="empty-message">${currentView === 'favorites' ? 'Aucun favori pour le moment. Ajoutez-en avec le bouton cœur.' : 'Aucun anime ne correspond à votre recherche.'}</p>`;
  } else {
    animeList.innerHTML = pageItems.map((anime) => {
      const id = String(anime.id);
      const title = escapeHtml(anime.title || 'Anime sans titre');
      const poster = escapeHtml(anime.poster || 'images/logo.png');
      const description = escapeHtml(anime.description || 'Aucune description disponible.');
      const genres = escapeHtml((anime.genres || []).join(' • '));
      const rating = Number(anime.rating || 0);
      const isFavorite = favorites.has(id);
      return `<article class="anime-card">
        <div class="anime-poster-wrap">
          <img src="${poster}" alt="Affiche de ${title}" loading="lazy" onerror="this.onerror=null;this.src='images/logo.png';">
          <span class="anime-score"><i class="fas fa-star" aria-hidden="true"></i> ${rating.toFixed(1)}</span>
        </div>
        <div class="anime-info">
          <h3>${title}</h3>
          <span class="duration-tag">${formatDuration(averageDuration(anime))}</span>
          <p class="anime-description">${description}</p>
          <p class="genre">${genres}</p>
          <div class="card-buttons">
            <a href="joueur.html?animeId=${encodeURIComponent(id)}&season=1&episode=1" class="play-btn"><i class="fas fa-play" aria-hidden="true"></i> Regarder</a>
            <button class="favorite-btn" type="button" data-favorite-id="${escapeHtml(id)}" aria-label="${isFavorite ? 'Retirer' : 'Ajouter'} ${title} ${isFavorite ? 'des' : 'aux'} favoris" aria-pressed="${isFavorite}">${isFavorite ? '♥' : '♡'}</button>
          </div>
        </div>
      </article>`;
    }).join('');
  }

  const heading = document.getElementById('catalogueTitle');
  if (heading) {
    heading.textContent = currentView === 'favorites' ? 'Mes favoris'
      : currentView === 'top-rated' ? 'Les mieux notés' : 'Catalogue des animes';
  }

  const pageInfo = document.getElementById('pageInfo');
  if (pageInfo) pageInfo.textContent = `${currentPage + 1} / ${pageCount}`;
  const previous = document.getElementById('previousPage');
  const next = document.getElementById('nextPage');
  if (previous) previous.disabled = currentPage === 0;
  if (next) next.disabled = currentPage >= pageCount - 1;
}

function setMenuOpen(open) {
  if (!menuToggle || !mainNavigation) return;
  mainNavigation.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
}

menuToggle?.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

mainNavigation?.addEventListener('click', (event) => {
  const link = event.target.closest('.nav-link[data-view]');
  if (!link) return;
  setMenuOpen(false);

  const view = link.dataset.view;
  document.querySelectorAll('.nav-link[data-view]').forEach((item) => {
    item.classList.toggle('active', item === link);
  });
  if (view === 'home') {
    currentQuery = '';
    if (searchInput) searchInput.value = '';
    currentView = 'catalogue';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    currentView = view;
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
  }
  currentPage = 0;
  render();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 640) setMenuOpen(false);
});

searchInput?.addEventListener('input', () => {
  currentQuery = searchInput.value;
  currentPage = 0;
  render();
});

document.getElementById('searchButton')?.addEventListener('click', () => {
  currentQuery = searchInput?.value || '';
  currentPage = 0;
  render();
  document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
});
searchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') document.getElementById('searchButton')?.click();
});

document.querySelectorAll('.duration-btn').forEach((button) => {
  button.addEventListener('click', () => {
    currentDuration = button.dataset.duration || 'Tous';
    document.querySelectorAll('.duration-btn').forEach((item) => item.classList.toggle('active', item === button));
    currentPage = 0;
    render();
  });
});

sortSelect?.addEventListener('change', () => {
  currentSort = sortSelect.value;
  currentPage = 0;
  render();
});

animeList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-favorite-id]');
  if (!button) return;
  const id = button.dataset.favoriteId;
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  saveFavorites();
  render();
});

document.getElementById('previousPage')?.addEventListener('click', () => {
  if (currentPage > 0) { currentPage -= 1; render(); }
});
document.getElementById('nextPage')?.addEventListener('click', () => {
  if ((currentPage + 1) * PER_PAGE < visibleAnimes.length) { currentPage += 1; render(); }
});

document.getElementById('clearResumeButton')?.addEventListener('click', () => {
  writeResumeHistory({});
  renderResumeSection();
});

window.addEventListener('storage', (event) => {
  if (event.key === RESUME_KEY) renderResumeSection();
});

async function loadAnimes() {
  if (!animeList) return;
  animeList.innerHTML = '<p class="empty-message">Chargement des animes…</p>';
  try {
    const response = await fetch('anime.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    const data = await response.json();
    animes = Array.isArray(data) ? data : data.animes;
    if (!Array.isArray(animes) || !animes.length) throw new Error('Le fichier anime.json ne contient aucun anime.');
    render();
    renderResumeSection();
  } catch (error) {
    console.error('Erreur de chargement du catalogue :', error);
    animeList.innerHTML = '<p class="empty-message">Le catalogue ne peut pas être chargé. Vérifiez que anime.json est servi par un serveur local ou GitHub Pages.</p>';
    renderResumeSection();
  }
}

loadAnimes();

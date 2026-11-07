// AnimeFlix — navigation et catalogue de la page d'accueil.

const FAVORITES_KEY = 'animeFlix_favorites';
let animes = [];
let visibleAnimes = [];
let currentPage = 0;
const perPage = 6;
let currentDuration = 'Tous';
let currentSort = 'default';
let currentQuery = '';
let currentView = 'catalogue';
let favorites = readFavorites();

const animeList = document.getElementById('animeList');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

function readFavorites() {
  const keys = [FAVORITES_KEY, 'favoris', 'favorites'];
  const ids = new Set();
  keys.forEach((key) => {
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(saved)) saved.forEach((id) => ids.add(String(id)));
    } catch (error) {
      // Ignore les anciennes données de favoris mal formées.
    }
  });
  return ids;
}

function saveFavorites() {
  const values = [...favorites];
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(values));
    // Maintient la compatibilité avec les versions précédentes du site.
    localStorage.setItem('favoris', JSON.stringify(values));
  } catch (error) {
    console.warn('Impossible d’enregistrer les favoris dans ce navigateur.', error);
  }
}

function toMinutes(duration) {
  if (!duration) return 0;
  if (typeof duration === 'number') return duration;
  const text = String(duration).trim().toLowerCase();
  if (text.includes('h')) {
    const [hourPart, minutePart = '0'] = text.split('h');
    const hours = parseFloat(hourPart) || 0;
    const minutes = parseInt(minutePart.replace(/min|m/gi, '').trim(), 10) || 0;
    return hours * 60 + minutes;
  }
  const parts = text.split(':').map((part) => parseInt(part, 10));
  return parts.length === 2 && parts.every(Number.isFinite) ? parts[0] * 60 + parts[1] : 0;
}

function averageDuration(anime) {
  const durations = (anime.seasons || []).flatMap((season) =>
    (season.episodes || []).map((episode) => toMinutes(episode.duration))
  ).filter((duration) => duration > 0);
  return durations.length ? durations.reduce((total, value) => total + value, 0) / durations.length : 0;
}

function durationLabel(minutes) {
  if (!minutes) return 'Durée inconnue';
  const hours = Math.floor(minutes / 60);
  const rest = Math.round(minutes % 60);
  if (!hours) return `${rest} min`;
  return rest ? `${hours}h ${rest}min` : `${hours}h`;
}

function matchesDuration(anime) {
  if (currentDuration === 'Tous') return true;
  const target = { '1h': 60, '2h': 120, '3h': 180 }[currentDuration];
  return Math.abs(averageDuration(anime) - target) <= 15;
}

function sortAnimes(list) {
  const sorted = [...list];
  if (currentSort === 'rating-desc' || currentView === 'top-rated') {
    return sorted.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  }
  if (currentSort === 'duration-asc') return sorted.sort((a, b) => averageDuration(a) - averageDuration(b));
  if (currentSort === 'duration-desc') return sorted.sort((a, b) => averageDuration(b) - averageDuration(a));
  return sorted;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function getFilteredAnimes() {
  let result = animes.filter((anime) => {
    const query = currentQuery.toLocaleLowerCase();
    const searchable = `${anime.title || ''} ${anime.description || ''} ${(anime.genres || []).join(' ')}`.toLocaleLowerCase();
    const queryMatch = !query || searchable.includes(query);
    const favoriteMatch = currentView !== 'favorites' || favorites.has(String(anime.id));
    return queryMatch && favoriteMatch && matchesDuration(anime);
  });
  result = sortAnimes(result);
  return result;
}

function render() {
  if (!animeList) return;
  visibleAnimes = getFilteredAnimes();
  const pageCount = Math.max(1, Math.ceil(visibleAnimes.length / perPage));
  currentPage = Math.min(currentPage, pageCount - 1);
  const pageItems = visibleAnimes.slice(currentPage * perPage, (currentPage + 1) * perPage);

  if (!pageItems.length) {
    const message = currentView === 'favorites'
      ? 'Vous n’avez pas encore ajouté d’anime à vos favoris.'
      : 'Aucun anime ne correspond à votre recherche.';
    animeList.innerHTML = `<p class="empty-message">${message}</p>`;
  } else {
    animeList.innerHTML = pageItems.map((anime) => {
      const id = escapeHtml(anime.id);
      const title = escapeHtml(anime.title || 'Anime sans titre');
      const poster = escapeHtml(anime.poster || 'images/logo.png');
      const description = escapeHtml(anime.description || 'Aucune description disponible.');
      const genres = escapeHtml((anime.genres || []).join(' • '));
      const rating = Number(anime.rating || 0);
      const favorite = favorites.has(String(anime.id));
      return `
        <article class="anime-card">
          <img src="${poster}" alt="Affiche de ${title}" loading="lazy">
          <div class="anime-info">
            <h3>${title}</h3>
            <span class="duration-tag">⏱️ ${durationLabel(averageDuration(anime))}</span>
            <p>${description}</p>
            <p class="rating">⭐ ${rating.toFixed(1)}/5</p>
            <p class="genre">${genres}</p>
            <div class="card-buttons">
              <a href="joueur.html?animeId=${encodeURIComponent(id)}&season=1&episode=1" class="play-btn">▶ Regarder</a>
              <button class="favorite-btn" type="button" data-favorite-id="${id}" aria-label="${favorite ? 'Retirer' : 'Ajouter'} ${title} ${favorite ? 'des' : 'aux'} favoris" aria-pressed="${favorite}">${favorite ? '❤️' : '🤍'}</button>
            </div>
          </div>
        </article>`;
    }).join('');
  }

  const titleNode = document.getElementById('catalogueTitle');
  if (titleNode) {
    titleNode.textContent = currentView === 'favorites'
      ? 'Mes favoris'
      : currentView === 'top-rated' ? 'Les mieux notés' : 'Catalogue des animes';
  }

  const pageInfo = document.getElementById('pageInfo');
  if (pageInfo) pageInfo.textContent = `${currentPage + 1} / ${pageCount}`;
  const previous = document.getElementById('previousPage');
  const next = document.getElementById('nextPage');
  if (previous) previous.disabled = currentPage === 0;
  if (next) next.disabled = currentPage >= pageCount - 1;
}

function setView(view) {
  currentView = view;
  currentPage = 0;
  if (view === 'top-rated') {
    currentSort = 'rating-desc';
    if (sortSelect) sortSelect.value = 'rating-desc';
  } else if (view === 'catalogue') {
    currentSort = sortSelect?.value || 'default';
  }

  document.querySelectorAll('.nav-link[data-view]').forEach((link) => {
    link.classList.toggle('active', link.dataset.view === view || (view === 'catalogue' && link.dataset.view === 'catalogue'));
  });
  render();
}

async function loadAnimes() {
  try {
    const response = await fetch('anime.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Chargement impossible (${response.status})`);
    const data = await response.json();
    animes = Array.isArray(data) ? data : (Array.isArray(data.animes) ? data.animes : []);
    if (!animes.length) throw new Error('Aucun anime trouvé dans anime.json');
  } catch (error) {
    console.error('Impossible de charger le catalogue :', error);
    if (animeList) animeList.innerHTML = '<p class="empty-message">Le catalogue est indisponible pour le moment.</p>';
    return;
  }
  render();
}

// Navigation : le catalogue affiche tout, Top Rated trie par note, Favoris filtre la liste.
document.querySelectorAll('.nav-link[data-view]').forEach((link) => {
  link.addEventListener('click', () => {
    const view = link.dataset.view;
    if (view === 'home') {
      currentQuery = '';
      if (searchInput) searchInput.value = '';
      setView('catalogue');
      return;
    }
    setView(view);
  });
});

searchInput?.addEventListener('input', () => {
  currentQuery = searchInput.value.trim();
  currentPage = 0;
  render();
});

document.getElementById('searchButton')?.addEventListener('click', () => {
  currentQuery = searchInput?.value.trim() || '';
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
    currentPage = 0;
    document.querySelectorAll('.duration-btn').forEach((item) => item.classList.toggle('active', item === button));
    render();
  });
});

sortSelect?.addEventListener('change', () => {
  currentSort = sortSelect.value;
  if (currentView === 'top-rated' && currentSort !== 'rating-desc') currentView = 'catalogue';
  currentPage = 0;
  render();
});

animeList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-favorite-id]');
  if (!button) return;
  const id = button.dataset.favoriteId;
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  saveFavorites();
  render();
});

document.getElementById('previousPage')?.addEventListener('click', () => {
  if (currentPage > 0) {
    currentPage -= 1;
    render();
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
  }
});

document.getElementById('nextPage')?.addEventListener('click', () => {
  if ((currentPage + 1) * perPage < visibleAnimes.length) {
    currentPage += 1;
    render();
    document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
  }
});

loadAnimes();

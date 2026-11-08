// IrAnimeX — catalogue complet sur une seule page, filtres et favoris.
const FAVORITES_KEY = 'animeFlix_favorites';
const LEGACY_FAVORITES_KEY = 'favoris';
let animes = [];
let visibleAnimes = [];
let currentDuration = 'Tous';
let currentSort = 'default';
let currentQuery = '';
let currentView = 'catalogue';
let favorites = readFavorites();

const animeList = document.getElementById('animeList');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

function readFavorites() {
  const ids = new Set();
  [FAVORITES_KEY, LEGACY_FAVORITES_KEY, 'favorites'].forEach((key) => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(stored)) stored.forEach((id) => ids.add(String(id)));
    } catch (error) { /* Ignore les anciennes données de favoris invalides. */ }
  });
  return ids;
}

function saveFavorites() {
  const stored = [...favorites];
  [FAVORITES_KEY, LEGACY_FAVORITES_KEY].forEach((key) => {
    try { localStorage.setItem(key, JSON.stringify(stored)); }
    catch (error) { console.warn('Impossible d’enregistrer les favoris.', error); }
  });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function averageDuration(anime) {
  const values = (anime.seasons || []).flatMap((season) => season.episodes || []).map((episode) => {
    const duration = episode.duration;
    if (typeof duration === 'number') return duration;
    const text = String(duration || '').trim().toLowerCase();
    if (text.includes('h')) {
      const [hoursText, minutesText = '0'] = text.split('h');
      return (parseFloat(hoursText) || 0) * 60 + (parseInt(minutesText.replace(/min|m/gi, ''), 10) || 0);
    }
    const parts = text.split(':').map((part) => parseInt(part, 10));
    return parts.length === 2 && parts.every(Number.isFinite) ? parts[0] * 60 + parts[1] : 0;
  }).filter((value) => value > 0);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function formatDuration(minutes) {
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

function getVisibleAnimes() {
  const query = currentQuery.trim().toLocaleLowerCase();
  let results = animes.filter((anime) => {
    const searchable = `${anime.title || ''} ${anime.description || ''} ${(anime.genres || []).join(' ')}`.toLocaleLowerCase();
    return (!query || searchable.includes(query)) &&
      (currentView !== 'favorites' || favorites.has(String(anime.id))) && matchesDuration(anime);
  });
  const sortMode = currentView === 'top-rated' ? 'rating-desc' : currentSort;
  if (sortMode === 'rating-desc') results.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  if (sortMode === 'duration-asc') results.sort((a, b) => averageDuration(a) - averageDuration(b));
  if (sortMode === 'duration-desc') results.sort((a, b) => averageDuration(b) - averageDuration(a));
  return results;
}

function render() {
  if (!animeList) return;
  visibleAnimes = getVisibleAnimes();

  if (!visibleAnimes.length) {
    animeList.innerHTML = `<p class="empty-message">${currentView === 'favorites' ? 'Aucun favori pour le moment. Utilisez le bouton cœur pour en ajouter.' : 'Aucun anime ne correspond à votre recherche.'}</p>`;
  } else {
    // Important : aucun découpage en pages, le catalogue complet reste visible ensemble.
    animeList.innerHTML = visibleAnimes.map((anime) => {
      const id = String(anime.id);
      const title = escapeHtml(anime.title || 'Anime sans titre');
      const poster = escapeHtml(anime.poster || 'images/logo.png');
      const description = escapeHtml(anime.description || 'Aucune description disponible.');
      const genres = escapeHtml((anime.genres || []).join(' • '));
      const rating = Number(anime.rating || 0);
      const favorite = favorites.has(id);
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
            <button class="favorite-btn" type="button" data-favorite-id="${escapeHtml(id)}" aria-label="${favorite ? 'Retirer' : 'Ajouter'} ${title} ${favorite ? 'des' : 'aux'} favoris" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button>
          </div>
        </div>
      </article>`;
    }).join('');
  }

  const title = document.querySelector('#catalogue .section-title');
  if (title) title.textContent = currentView === 'favorites' ? 'Mes favoris' : currentView === 'top-rated' ? 'Les mieux notés' : 'Nos animes';
}

function scrollToCatalogue() {
  document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    const label = link.textContent.trim().toLocaleLowerCase();
    if (!['accueil', 'catalogue', 'top rated', 'favoris'].includes(label)) return;
    event.preventDefault();
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.toggle('active', item === link));
    currentView = label === 'favoris' ? 'favorites' : label === 'top rated' ? 'top-rated' : 'catalogue';
    if (label === 'accueil') {
      currentQuery = '';
      if (searchInput) searchInput.value = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollToCatalogue();
    }
    render();
  });
});

searchInput?.addEventListener('input', () => {
  currentQuery = searchInput.value;
  render();
});
document.querySelector('.search-btn')?.addEventListener('click', () => {
  currentQuery = searchInput?.value || '';
  render();
  scrollToCatalogue();
});
searchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') document.querySelector('.search-btn')?.click();
});

document.querySelectorAll('.duration-btn').forEach((button) => {
  button.addEventListener('click', () => {
    currentDuration = button.dataset.duration || 'Tous';
    document.querySelectorAll('.duration-btn').forEach((item) => item.classList.toggle('active', item === button));
    render();
  });
});
sortSelect?.addEventListener('change', () => {
  currentSort = sortSelect.value;
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

async function loadAnimes() {
  if (!animeList) return;
  animeList.innerHTML = '<p class="empty-message">Chargement du catalogue…</p>';
  try {
    const response = await fetch('anime.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
    const data = await response.json();
    animes = Array.isArray(data) ? data : data.animes;
    if (!Array.isArray(animes) || !animes.length) throw new Error('Aucun anime trouvé.');
    render();
  } catch (error) {
    console.error('Erreur de chargement du catalogue :', error);
    animeList.innerHTML = '<p class="empty-message">Le catalogue ne peut pas être chargé. Vérifiez anime.json.</p>';
  }
}

loadAnimes();

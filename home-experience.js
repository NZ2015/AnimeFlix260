// Hero carousel and resume shelf for the homepage.
(() => {
  const image = document.getElementById('heroAnimeImage');
  const title = document.getElementById('heroAnimeTitle');
  const description = document.getElementById('heroAnimeDescription');
  const meta = document.getElementById('heroAnimeMeta');
  const watch = document.getElementById('heroWatchLink');
  const dots = document.getElementById('heroDots');
  const continueSection = document.getElementById('continueSection');
  const continueList = document.getElementById('continueList');
  if (!image || !title || !dots) return;

  const HISTORY_KEY = 'iranimeX_resume_v1';
  let featured = [];
  let activeIndex = 0;
  let carouselTimer;

  const safe = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  function setSlide(index) {
    if (!featured.length) return;
    activeIndex = (index + featured.length) % featured.length;
    const anime = featured[activeIndex];
    image.src = anime.poster || 'images/banner.jpg';
    image.onerror = () => { image.onerror = null; image.src = 'images/banner.jpg'; };
    image.alt = `Affiche de ${anime.title || 'anime à la une'}`;
    title.textContent = anime.title || 'Anime à la une';
    description.textContent = anime.description || 'Découvrez cette série dans le catalogue.';
    meta.textContent = `${anime.releaseYear || ''} · ${(anime.genres || []).slice(0, 3).join(' · ')}`;
    const available = anime.available !== false;
    watch.href = available
      ? `joueur.html?animeId=${encodeURIComponent(anime.id)}&season=1&episode=1`
      : '#catalogue';
    watch.innerHTML = available
      ? '<i class="fas fa-play" aria-hidden="true"></i> Regarder'
      : '<i class="fas fa-layer-group" aria-hidden="true"></i> Voir dans le catalogue';
    watch.classList.toggle('is-catalogue-link', !available);
    dots.querySelectorAll('button').forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === activeIndex);
      dot.setAttribute('aria-current', dotIndex === activeIndex ? 'true' : 'false');
    });
  }

  function initCarousel(animes) {
    featured = animes.filter((anime) => anime.poster).slice(0, 8);
    if (!featured.length) return;
    dots.innerHTML = featured.map((anime, index) =>
      `<button type="button" aria-label="Afficher ${safe(anime.title)}" aria-current="${index === 0}" class="${index === 0 ? 'active' : ''}"></button>`
    ).join('');
    dots.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      const index = [...dots.children].indexOf(button);
      if (index >= 0) {
        setSlide(index);
        startTimer();
      }
    });
    setSlide(0);
    startTimer();
  }

  function startTimer() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(() => setSlide(activeIndex + 1), 6500);
  }

  function renderContinue(animes) {
    if (!continueSection || !continueList) return;
    let history;
    try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}'); }
    catch (error) { history = {}; }
    const entries = Object.values(history || {})
      .filter((entry) => entry && Number(entry.currentTime) > 0)
      .sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0))
      .map((entry) => ({ entry, anime: animes.find((item) => String(item.id) === String(entry.animeId)) }))
      .filter((item) => item.anime);

    continueSection.hidden = entries.length === 0;
    continueList.innerHTML = entries.map(({ entry, anime }) => {
      const duration = Number(entry.duration) || 0;
      const progress = duration ? Math.min(100, Math.round(Number(entry.currentTime) / duration * 100)) : 0;
      const season = Math.max(1, Number(entry.season) || 1);
      const episode = Math.max(1, Number(entry.episode) || 1);
      const href = `joueur.html?animeId=${encodeURIComponent(anime.id)}&season=${season}&episode=${episode}&resume=1`;
      return `<a class="continue-card" href="${href}">
        <img src="${safe(anime.poster || 'images/logo.png')}" alt="" loading="lazy" onerror="this.onerror=null;this.src='images/logo.png';">
        <span class="continue-play" aria-hidden="true"><i class="fas fa-play"></i></span>
        <span class="continue-info"><strong>${safe(anime.title)}</strong><span>Saison ${season} · Épisode ${episode}</span>
          <span class="continue-progress"><i style="width:${progress}%"></i></span>
        </span>
      </a>`;
    }).join('');
  }

  Promise.all([
    fetch('anime.json').then((response) => response.ok ? response.json() : { animes: [] }),
    fetch('anime-extra.json').then((response) => response.ok ? response.json() : { animes: [] }).catch(() => ({ animes: [] }))
  ]).then(([main, extra]) => {
    const mainList = Array.isArray(main) ? main : main.animes || [];
    const extraList = Array.isArray(extra) ? extra : extra.animes || [];
    const all = [...mainList, ...extraList];
    initCarousel(all);
    renderContinue(all);
  }).catch((error) => console.warn('Chargement du contenu d’accueil impossible.', error));

  window.addEventListener('storage', (event) => {
    if (event.key === HISTORY_KEY) {
      Promise.all([
        fetch('anime.json').then((response) => response.json()),
        fetch('anime-extra.json').then((response) => response.json()).catch(() => ({ animes: [] }))
      ]).then(([main, extra]) => renderContinue([...(main.animes || main), ...(extra.animes || extra)]));
    }
  });
})();

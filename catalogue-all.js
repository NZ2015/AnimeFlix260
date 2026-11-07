// Désactive la pagination sur la page d’accueil et affiche tous les résultats.
// Le fichier est chargé après script.js : le rendu asynchrone du catalogue
// utilisera cette fonction, y compris après recherche, tri et filtres.
(() => {
  const list = document.getElementById('animeList');
  const pagination = document.querySelector('.pagination');
  if (!list) return;

  function renderAll() {
    if (typeof filteredAnimes === 'undefined' || typeof creerCarte !== 'function') return;

    if (filteredAnimes.length === 0) {
      list.innerHTML = '<p class="empty-message">Aucun anime ne correspond à votre recherche.</p>';
    } else {
      list.innerHTML = filteredAnimes.map((anime) => creerCarte(anime)).join('');
    }

    if (pagination) pagination.hidden = true;
  }

  // script.js appelle renderPage() après chaque changement de recherche ou filtre.
  window.renderPage = renderAll;
  window.prevPage = () => {};
  window.nextPage = () => {};
  if (pagination) pagination.hidden = true;
})();

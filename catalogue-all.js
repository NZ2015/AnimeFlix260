// Affiche tous les résultats du catalogue dans une seule page.
// La recherche, le tri, les filtres et les favoris continuent de fonctionner.
(() => {
  const list = document.getElementById('animeList');
  const pagination = document.querySelector('.pagination');
  if (!list) return;

  function renderAllResults() {
    if (typeof filteredAnimes === 'undefined' || typeof creerCarte !== 'function') return;

    list.innerHTML = filteredAnimes.length
      ? filteredAnimes.map((anime) => creerCarte(anime)).join('')
      : '<p class="empty-message">Aucun anime ne correspond à votre recherche.</p>';

    if (typeof currentPage !== 'undefined') currentPage = 0;
    if (pagination) pagination.hidden = true;
  }

  // Remplace le rendu paginé utilisé par les filtres et la recherche du site.
  window.renderPage = renderAllResults;
  window.prevPage = () => {};
  window.nextPage = () => {};

  // Le catalogue se charge de façon asynchrone ; attendre son premier rendu.
  const observer = new MutationObserver(() => {
    if (list.children.length) renderAllResults();
  });
  observer.observe(list, { childList: true });
  renderAllResults();
})();

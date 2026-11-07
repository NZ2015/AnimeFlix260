// Mobile navigation menu.
const menuToggle = document.getElementById('menuToggle');
const mainNavigation = document.getElementById('mainNavigation');

function setMenuOpen(isOpen) {
  if (!menuToggle || !mainNavigation) return;
  mainNavigation.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
}

menuToggle?.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});

mainNavigation?.addEventListener('click', (event) => {
  if (event.target.closest('.nav-link')) setMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 640) setMenuOpen(false);
});


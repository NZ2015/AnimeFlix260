// === Gestion de la recherche === 
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

function performSearch() {
    const searchInput = document.querySelector('.search-container input');
    const query = searchInput.value.trim();

    if (query.length > 0) {
        console.log('Recherche pour:', query);
        alert(`Recherche en cours pour: ${query}`);
    }
}

// === Charger les animes depuis JSON ===
let allAnimes = [];

fetch('animes.json')
    .then(response => response.json())
    .then(data => {
        allAnimes = data.animes;
        setupPlayButtons();
    })
    .catch(error => console.error('Erreur:', error));

// === Animations au scroll === 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les cartes d'animes
document.querySelectorAll('.anime-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// === Setup des boutons de lecture ===
function setupPlayButtons() {
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const animeCard = this.closest('.anime-card');
            const animeName = animeCard.querySelector('h3').textContent;
            
            // Trouver l'anime dans nos données
            const anime = allAnimes.find(a => a.title === animeName);
            
            if (anime) {
                // Rediriger vers le lecteur
                window.location.href = `player.html?anime=${anime.id}&episode=1`;
            } else {
                console.log('Anime non trouvé:', animeName);
            }
        });
    });
}

// === Navigation active === 
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// === Gestion du défilement du header === 
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    let scrollTop = window.scrollY;

    if (scrollTop > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop;
});

// === Gestion des boutons d'authentification === 
document.querySelectorAll('.auth-buttons .btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const buttonText = this.textContent;
        console.log('Clic sur:', buttonText);
        alert(`Redirection vers ${buttonText.toLowerCase()}...`);
    });
});

// === Effet parallaxe sur le hero === 
window.addEventListener('scroll', function() {
    const hero = document.querySelector('.hero');
    const scrollPosition = window.scrollY;
    
    if (hero) {
        hero.style.backgroundPosition = `0 ${scrollPosition * 0.5}px`;
    }
});

// === Gestion des cartes anime au clic === 
document.querySelectorAll('.anime-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Ne pas activer si on clique sur le bouton play
        if (e.target.closest('.play-btn')) return;
        
        const animeName = this.querySelector('h3').textContent;
        const anime = allAnimes.find(a => a.title === animeName);
        
        if (anime) {
            // Rediriger vers le lecteur
            window.location.href = `player.html?anime=${anime.id}&episode=1`;
        }
    });
});

// === Animation des étoiles de notation === 
document.querySelectorAll('.rating i').forEach(star => {
    star.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2) rotate(10deg)';
    });

    star.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });

    this.style.transition = 'transform 0.3s ease';
});

// === Lazy loading des images === 
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// === Gestion des favoris === 
function addToFavorites(animeName) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    if (!favorites.includes(animeName)) {
        favorites.push(animeName);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log(`${animeName} ajouté aux favoris`);
    }
}

function removeFromFavorites(animeName) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav !== animeName);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log(`${animeName} retiré des favoris`);
}

// === Gestion du formulaire de recherche avancée === 
function initAdvancedSearch() {
    const searchInput = document.querySelector('.search-container input');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function(e) {
        const value = e.target.value.toLowerCase();
        
        document.querySelectorAll('.anime-card').forEach(card => {
            const animeTitle = card.querySelector('h3').textContent.toLowerCase();
            const animeGenre = card.querySelector('.genre').textContent.toLowerCase();
            
            if (animeTitle.includes(value) || animeGenre.includes(value)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// === Statistiques d'utilisation === 
function trackUserAction(action, data) {
    const trackingData = {
        timestamp: new Date().toISOString(),
        action: action,
        data: data,
        userAgent: navigator.userAgent
    };
    
    console.log('Action trackée:', trackingData);
}

// === Initialisation === 
window.addEventListener('load', function() {
    console.log('AnimeFlix26 - Page chargée avec succès');
    initAdvancedSearch();
});

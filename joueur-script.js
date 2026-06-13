// === Charger les données des animes ===
let allAnimes = [];
let currentAnime = null;
let currentSeason = null;
let currentEpisode = null;

// Charger les données JSON
fetch('animes.json')
    .then(response => response.json())
    .then(data => {
        allAnimes = data.animes;
        initializePlayer();
    })
    .catch(error => console.error('Erreur lors du chargement des animes:', error));

// === Initialiser le lecteur ===
function initializePlayer() {
    // Récupérer l'anime et l'episode depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const animeId = parseInt(urlParams.get('anime')) || 1;
    const seasonNum = parseInt(urlParams.get('season')) || 1;
    const episodeNum = parseInt(urlParams.get('episode')) || 1;

    // Trouver l'anime
    currentAnime = allAnimes.find(a => a.id === animeId);
    
    if (!currentAnime) {
        console.error('Anime non trouvé');
        return;
    }

    // Trouver la saison
    currentSeason = currentAnime.seasons.find(s => s.number === seasonNum);
    if (!currentSeason) {
        currentSeason = currentAnime.seasons[0];
    }

    // Trouver l'episode
    const episode = currentSeason.episodes.find(e => e.number === episodeNum);
    playEpisode(episode || currentSeason.episodes[0]);

    // Afficher la liste des saisons
    displaySeasons();

    // Afficher la liste des episodes
    displayEpisodes();

    // Afficher les animes recommandés
    displayRelatedAnimes();
}

// === Afficher les informations et lire l'episode ===
function playEpisode(episode) {
    currentEpisode = episode;

    // Mettre à jour la vidéo
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.src = episode.videoUrl;

    // Mettre à jour les informations
    document.getElementById('animeTitle').textContent = currentAnime.title;
    document.getElementById('episodeTitle').textContent = `${currentSeason.title} - Episode ${episode.number} - ${episode.title}`;
    document.getElementById('episodeDescription').textContent = episode.description;

    // Mettre à jour l'episode actif dans la liste
    document.querySelectorAll('.episode-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-episode="${episode.number}"]`)?.classList.add('active');

    // Mettre à jour l'URL
    window.history.replaceState({}, '', `player.html?anime=${currentAnime.id}&season=${currentSeason.number}&episode=${episode.number}`);

    // Scroller vers le lecteur
    document.querySelector('.video-player').scrollIntoView({ behavior: 'smooth' });
}

// === Afficher les saisons ===
function displaySeasons() {
    const seasonsList = document.getElementById('seasonsList');
    seasonsList.innerHTML = '';

    currentAnime.seasons.forEach(season => {
        const seasonBtn = document.createElement('button');
        seasonBtn.className = 'season-btn';
        seasonBtn.textContent = season.title;
        
        if (currentSeason && currentSeason.number === season.number) {
            seasonBtn.classList.add('active');
        }

        seasonBtn.addEventListener('click', () => {
            currentSeason = season;
            playEpisode(season.episodes[0]);
            displaySeasons();
            displayEpisodes();
        });

        seasonsList.appendChild(seasonBtn);
    });
}

// === Afficher la liste des episodes ===
function displayEpisodes() {
    const episodesList = document.getElementById('episodesList');
    episodesList.innerHTML = '';

    currentSeason.episodes.forEach(episode => {
        const episodeItem = document.createElement('div');
        episodeItem.className = 'episode-item';
        episodeItem.setAttribute('data-episode', episode.number);
        
        if (currentEpisode && currentEpisode.number === episode.number) {
            episodeItem.classList.add('active');
        }

        episodeItem.innerHTML = `
            <div class="episode-item-content">
                <div class="episode-item-number">Episode ${episode.number}</div>
                <div class="episode-item-title">${episode.title}</div>
            </div>
            <div class="episode-item-duration">${episode.duration}</div>
        `;

        episodeItem.addEventListener('click', () => playEpisode(episode));
        episodesList.appendChild(episodeItem);
    });
}

// === Afficher les animes recommandés ===
function displayRelatedAnimes() {
    const relatedContainer = document.getElementById('relatedAnimes');
    relatedContainer.innerHTML = '';

    // Obtenir 3 animes aléatoires (sauf l'anime courant)
    const otherAnimes = allAnimes.filter(a => a.id !== currentAnime.id);
    const randomAnimes = otherAnimes.sort(() => 0.5 - Math.random()).slice(0, 3);

    randomAnimes.forEach(anime => {
        const animeCard = document.createElement('div');
        animeCard.className = 'related-anime-card';
        
        animeCard.innerHTML = `
            <img src="${anime.poster}" alt="${anime.title}" class="related-anime-poster">
            <div class="related-anime-info">
                <div class="related-anime-title">${anime.title}</div>
                <div class="related-anime-rating">
                    <i class="fas fa-star"></i>
                    <span>${anime.rating}/5</span>
                </div>
            </div>
        `;

        animeCard.addEventListener('click', () => {
            // Rediriger vers cet anime (première saison, premier episode)
            window.location.href = `player.html?anime=${anime.id}&season=1&episode=1`;
        });

        relatedContainer.appendChild(animeCard);
    });
}

// === Gestion des touches clavier ===
document.addEventListener('keydown', (e) => {
    const videoPlayer = document.getElementById('videoPlayer');
    
    switch(e.key) {
        case ' ':
            e.preventDefault();
            if (videoPlayer.paused) {
                videoPlayer.play();
            } else {
                videoPlayer.pause();
            }
            break;
        case 'ArrowRight':
            videoPlayer.currentTime += 5;
            break;
        case 'ArrowLeft':
            videoPlayer.currentTime -= 5;
            break;
        case 'f':
            toggleFullscreen();
            break;
        case 'n':
            playNextEpisode();
            break;
        case 'p':
            playPreviousEpisode();
            break;
    }
});

// === Passer à l'episode suivant ===
function playNextEpisode() {
    const currentIndex = currentSeason.episodes.findIndex(e => e.number === currentEpisode.number);
    
    if (currentIndex < currentSeason.episodes.length - 1) {
        // Episode suivant dans la même saison
        playEpisode(currentSeason.episodes[currentIndex + 1]);
    } else if (currentSeason.number < currentAnime.seasons.length) {
        // Saison suivante, premier episode
        const nextSeason = currentAnime.seasons[currentSeason.number];
        currentSeason = nextSeason;
        playEpisode(nextSeason.episodes[0]);
        displaySeasons();
        displayEpisodes();
    }
}

// === Passer à l'episode précédent ===
function playPreviousEpisode() {
    const currentIndex = currentSeason.episodes.findIndex(e => e.number === currentEpisode.number);
    
    if (currentIndex > 0) {
        // Episode précédent
        playEpisode(currentSeason.episodes[currentIndex - 1]);
    } else if (currentSeason.number > 1) {
        // Saison précédente, dernier episode
        const prevSeason = currentAnime.seasons[currentSeason.number - 2];
        currentSeason = prevSeason;
        const lastEpisode = prevSeason.episodes[prevSeason.episodes.length - 1];
        playEpisode(lastEpisode);
        displaySeasons();
        displayEpisodes();
    }
}

// === Plein écran ===
function toggleFullscreen() {
    const videoPlayer = document.getElementById('videoPlayer');
    
    if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
    } else if (videoPlayer.webkitRequestFullscreen) {
        videoPlayer.webkitRequestFullscreen();
    } else if (videoPlayer.mozRequestFullScreen) {
        videoPlayer.mozRequestFullScreen();
    }
}

// === Passer automatiquement à l'episode suivant ===
document.getElementById('videoPlayer').addEventListener('ended', () => {
    const currentIndex = currentSeason.episodes.findIndex(e => e.number === currentEpisode.number);
    
    if (currentIndex < currentSeason.episodes.length - 1) {
        // Afficher une notification
        const nextEpisode = currentSeason.episodes[currentIndex + 1];
        console.log(`Episode terminé! Prochain episode: ${nextEpisode.title}`);
        
        // Lire automatiquement après 3 secondes
        setTimeout(() => {
            playEpisode(nextEpisode);
        }, 3000);
    }
});

// === Sauvegarde de la progression ===
function saveProgress() {
    if (currentAnime && currentEpisode && currentSeason) {
        const progress = {
            animeId: currentAnime.id,
            seasonNumber: currentSeason.number,
            episodeNumber: currentEpisode.number,
            currentTime: document.getElementById('videoPlayer').currentTime,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('animeProgress', JSON.stringify(progress));
    }
}

// === Charger la progression ===
function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('animeProgress') || '{}');
    
    if (progress.animeId === currentAnime.id && 
        progress.seasonNumber === currentSeason.number &&
        progress.episodeNumber === currentEpisode.number) {
        document.getElementById('videoPlayer').currentTime = progress.currentTime;
    }
}

// Sauvegarder la progression toutes les 10 secondes
setInterval(saveProgress, 10000);

// Charger la progression au chargement
window.addEventListener('load', () => {
    setTimeout(loadProgress, 1000);
});

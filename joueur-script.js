// ===============================
// WilliamsAnime - Player Script FIXED
// ===============================

let animeData = null;
let currentSeason = 0;
let currentEpisode = 0;

const params = new URLSearchParams(window.location.search);

const animeId = parseInt(params.get("animeId"));
const seasonIndex = parseInt(params.get("season")) || 0;
const episodeIndex = parseInt(params.get("episode")) || 0;

const videoPlayer = document.getElementById("videoPlayer");

// ===============================
// CHARGER ANIME.JSON
// ===============================

fetch("anime.json")
  .then(res => res.json())
  .then(data => {

    animeData = data.animes.find(a => a.id === animeId);

    if (!animeData) {
      console.error("Anime introuvable");
      return;
    }

    loadEpisode(seasonIndex, episodeIndex);
    renderInfo();
    renderEpisodes();

  })
  .catch(err => console.error("Erreur chargement JSON :", err));

// ===============================
// CHARGER EPISODE
// ===============================

function loadEpisode(season, episode) {

  if (!animeData) return;

  const ep = animeData.seasons[season].episodes[episode];

  if (!ep) return;

  videoPlayer.src = ep.videoUrl;
  videoPlayer.load();

  videoPlayer.oncanplay = () => {
    videoPlayer.play();
  };

  currentSeason = season;
  currentEpisode = episode;

  document.getElementById("episodeTitle").innerText = ep.title || ("Episode " + (episode + 1));
  document.getElementById("animeTitle").innerText = animeData.title;

}

// ===============================
// NEXT EPISODE
// ===============================

function nextEpisode() {

  const episodes = animeData.seasons[currentSeason].episodes;

  if (currentEpisode < episodes.length - 1) {
    loadEpisode(currentSeason, currentEpisode + 1);
  } else if (currentSeason < animeData.seasons.length - 1) {
    loadEpisode(currentSeason + 1, 0);
  }

}

// ===============================
// PREVIOUS EPISODE
// ===============================

function prevEpisode() {

  if (currentEpisode > 0) {
    loadEpisode(currentSeason, currentEpisode - 1);
  } else if (currentSeason > 0) {
    const prevSeason = currentSeason - 1;
    const lastEpisode = animeData.seasons[prevSeason].episodes.length - 1;
    loadEpisode(prevSeason, lastEpisode);
  }

}

// ===============================
// PLAY / PAUSE
// ===============================

function togglePlay() {
  if (videoPlayer.paused) {
    videoPlayer.play();
  } else {
    videoPlayer.pause();
  }
}

// ===============================
// FULLSCREEN
// ===============================

function fullscreen() {
  if (videoPlayer.requestFullscreen) {
    videoPlayer.requestFullscreen();
  }
}

// ===============================
// AUTO NEXT
// ===============================

videoPlayer.addEventListener("ended", nextEpisode);

// ===============================
// RENDER INFO
// ===============================

function renderInfo() {
  document.getElementById("animeTitle").innerText = animeData.title;
}

// ===============================
// EPISODES LIST (OPTIONNEL UI)
// ===============================

function renderEpisodes() {

  const container = document.getElementById("episodesList");

  if (!container) return;

  container.innerHTML = "";

  animeData.seasons.forEach((season, sIndex) => {

    season.episodes.forEach((ep, eIndex) => {

      const btn = document.createElement("button");

      btn.innerText = `S${sIndex + 1} EP${eIndex + 1}`;

      btn.onclick = () => loadEpisode(sIndex, eIndex);

      container.appendChild(btn);

    });

  });

}

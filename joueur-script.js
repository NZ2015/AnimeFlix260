/* =========================================
   IrAnimeX - JOUEUR
   Gestion des animes et épisodes
========================================= */

const params = new URLSearchParams(window.location.search);

/* -----------------------------------------
   PARAMETRES URL
   Exemple :
   joueur.html?anime=1&season=1&episode=1
----------------------------------------- */

let animeId =
    params.get("anime") ||
    params.get("animeId");

let currentSeason =
    parseInt(params.get("season") || "1") - 1;

let currentEpisode =
    parseInt(params.get("episode") || "1") - 1;


/* -----------------------------------------
   ELEMENTS HTML
----------------------------------------- */

const videoPlayer = document.getElementById("videoPlayer");
const animeTitle = document.getElementById("animeTitle");
const episodeInfo = document.getElementById("episodeInfo");

const episodesList = document.getElementById("episodesList");
const episodeCount = document.getElementById("episodeCount");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");

const videoError = document.getElementById("videoError");


/* -----------------------------------------
   DONNEES
----------------------------------------- */

let animeData = null;
let allAnime = [];


/* =========================================
   CHARGER ANIME.JSON
========================================= */

fetch("anime.json")
    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Impossible de charger anime.json"
            );
        }

        return response.json();
    })

    .then(data => {

        /* anime.json peut être :
           [ {...}, {...} ]
           
           ou :
           
           { animes: [ {...}, {...} ] }
        */

        allAnime = Array.isArray(data)
            ? data
            : (data.animes || []);

        console.log("Animes chargés :", allAnime);


        /* ---------------------------------
           TROUVER L'ANIME
        --------------------------------- */

        animeData = allAnime.find(anime => {

            return String(anime.id) === String(animeId);

        });


        /* Si aucun ID dans l'URL,
           prendre le premier anime */

        if (!animeData) {

            if (allAnime.length > 0) {

                animeData = allAnime[0];

                console.warn(
                    "Anime non trouvé, premier anime utilisé."
                );

            } else {

                throw new Error(
                    "Aucun anime trouvé dans anime.json"
                );
            }
        }


        console.log(
            "Anime sélectionné :",
            animeData
        );


        /* ---------------------------------
           AFFICHER INFORMATIONS
        --------------------------------- */

        animeTitle.textContent =
            animeData.title || "Anime";


        /* ---------------------------------
           VERIFIER LES SAISONS
        --------------------------------- */

        if (
            !animeData.seasons ||
            !Array.isArray(animeData.seasons)
        ) {

            throw new Error(
                "La structure seasons de cet anime est incorrecte."
            );
        }


        /* Corriger saison */
        if (
            currentSeason < 0 ||
            currentSeason >= animeData.seasons.length
        ) {
            currentSeason = 0;
        }


        /* Episodes de la saison */
        const episodes =
            animeData.seasons[currentSeason].episodes || [];


        if (episodes.length === 0) {

            throw new Error(
                "Aucun épisode trouvé dans cette saison."
            );
        }


        /* Corriger épisode */
        if (
            currentEpisode < 0 ||
            currentEpisode >= episodes.length
        ) {
            currentEpisode = 0;
        }


        /* ---------------------------------
           AFFICHER EPISODES
        --------------------------------- */

        renderEpisodes();


        /* ---------------------------------
           CHARGER EPISODE
        --------------------------------- */

        loadEpisode();


    })

    .catch(error => {

        console.error(error);

        animeTitle.textContent =
            "Erreur";

        episodeInfo.textContent =
            error.message;

        episodesList.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                color: #00d9ff;
                padding: 20px;
                text-align: center;
            ">
                <i class="fas fa-circle-exclamation"></i>
                <br><br>
                ${error.message}
            </div>
        `;
    });


/* =========================================
   AFFICHER LES EPISODES
========================================= */

function renderEpisodes() {

    episodesList.innerHTML = "";

    const season =
        animeData.seasons[currentSeason];

    const episodes =
        season.episodes || [];


    /* Nombre épisodes */

    episodeCount.textContent =
        `${episodes.length} épisodes`;


    /* ---------------------------------
       CREER LES BOUTONS
    --------------------------------- */

    episodes.forEach((episode, index) => {

        const button =
            document.createElement("button");

        button.className = "episode-card";


        /* Episode actif */

        if (index === currentEpisode) {

            button.classList.add("active");
        }


        /* Numéro */

        button.innerHTML = `
            <span class="episode-number">
                ${index + 1}
            </span>
        `;


        /* Cliquer sur épisode */

        button.addEventListener(
            "click",
            () => {

                currentEpisode = index;

                renderEpisodes();

                loadEpisode();

            }
        );


        episodesList.appendChild(button);

    });


    console.log(
        `${episodes.length} épisodes affichés`
    );
}


/* =========================================
   CHARGER EPISODE
========================================= */

function loadEpisode() {

    const season =
        animeData.seasons[currentSeason];

    const episodes =
        season.episodes || [];

    const episode =
        episodes[currentEpisode];


    if (!episode) {

        console.error(
            "Episode introuvable"
        );

        return;
    }


    /* ---------------------------------
       URL VIDEO
    --------------------------------- */

    const videoUrl =
        episode.videoUrl ||
        episode.video ||
        episode.url ||
        episode.src;


    console.log(
        "Episode :",
        episode
    );

    console.log(
        "Vidéo :",
        videoUrl
    );


    if (!videoUrl) {

        videoError.style.display = "flex";

        return;
    }


    /* Cacher erreur */

    videoError.style.display = "none";


    /* ---------------------------------
       TITRE EPISODE
    --------------------------------- */

    const episodeTitle =
        episode.title ||
        `Épisode ${currentEpisode + 1}`;


    episodeInfo.textContent =
        `Saison ${currentSeason + 1} • ${episodeTitle}`;


    /* ---------------------------------
       VIDEO
    --------------------------------- */

    videoPlayer.src = videoUrl;

    videoPlayer.load();


    /* ---------------------------------
       URL
    --------------------------------- */

    const url =
        new URL(window.location.href);

    url.searchParams.set(
        "anime",
        animeData.id
    );

    url.searchParams.set(
        "season",
        currentSeason + 1
    );

    url.searchParams.set(
        "episode",
        currentEpisode + 1
    );

    window.history.replaceState(
        {},
        "",
        url
    );


    /* ---------------------------------
       BOUTONS
    --------------------------------- */

    previousBtn.disabled =
        currentSeason === 0 &&
        currentEpisode === 0;


    nextBtn.disabled =
        currentSeason === animeData.seasons.length - 1 &&
        currentEpisode === episodes.length - 1;
}


/* =========================================
   EPISODE SUIVANT
========================================= */

nextBtn.addEventListener(
    "click",
    () => {

        const episodes =
            animeData.seasons[currentSeason].episodes;


        /* Episode suivant */

        if (
            currentEpisode <
            episodes.length - 1
        ) {

            currentEpisode++;

        }

        /* Saison suivante */

        else if (
            currentSeason <
            animeData.seasons.length - 1
        ) {

            currentSeason++;

            currentEpisode = 0;

            renderEpisodes();
        }

        else {

            return;
        }


        renderEpisodes();

        loadEpisode();


        /* Retour en haut du lecteur */

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================
   EPISODE PRECEDENT
========================================= */

previousBtn.addEventListener(
    "click",
    () => {


        /* Episode précédent */

        if (currentEpisode > 0) {

            currentEpisode--;

        }

        /* Saison précédente */

        else if (currentSeason > 0) {

            currentSeason--;

            const episodes =
                animeData.seasons[currentSeason].episodes;

            currentEpisode =
                episodes.length - 1;

        }

        else {

            return;
        }


        renderEpisodes();

        loadEpisode();


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================
   ERREUR VIDEO
========================================= */

videoPlayer.addEventListener(
    "error",
    () => {

        videoError.style.display = "flex";

        console.error(
            "Erreur de lecture vidéo :",
            videoPlayer.error
        );

    }
);


/* =========================================
   VIDEO CHARGEE
========================================= */

videoPlayer.addEventListener(
    "loadeddata",
    () => {

        videoError.style.display = "none";

    }
);


/* =========================================
   FIN DE L'EPISODE
========================================= */

videoPlayer.addEventListener(
    "ended",
    () => {

        if (!nextBtn.disabled) {

            nextBtn.click();

        }

    }
);

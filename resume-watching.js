/* Suivi de progression pour « Continuer à regarder » sur l’accueil. */
(() => {
    const STORAGE_KEY = "iranimeX_resume_v1";
    const video = document.getElementById("videoPlayer");
    if (!video) return;

    const query = new URLSearchParams(window.location.search);
    const animeId = query.get("anime") || query.get("animeId");
    if (!animeId) return;

    function readHistory() {
        try {
            const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
            return value && typeof value === "object" && !Array.isArray(value) ? value : {};
        } catch (error) {
            return {};
        }
    }

    function getPositionFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return {
            season: Math.max(1, parseInt(params.get("season") || "1", 10) || 1),
            episode: Math.max(1, parseInt(params.get("episode") || "1", 10) || 1)
        };
    }

    function saveProgress() {
        if (!Number.isFinite(video.currentTime) || video.currentTime < 1) return;
        const position = getPositionFromUrl();
        const history = readHistory();
        const info = document.getElementById("episodeInfo");
        history[String(animeId)] = {
            animeId: String(animeId),
            season: position.season,
            episode: position.episode,
            episodeTitle: info?.textContent?.split("•").pop()?.trim() || `Épisode ${position.episode}`,
            currentTime: video.currentTime,
            duration: Number.isFinite(video.duration) ? video.duration : 0,
            updatedAt: Date.now()
        };
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (error) {
            console.warn("Impossible de sauvegarder la progression vidéo.", error);
        }
    }

    function restoreProgress() {
        const resumeRequested = query.get("resume") === "1";
        if (!resumeRequested) return;

        const history = readHistory();
        const saved = history[String(animeId)];
        const position = getPositionFromUrl();
        if (!saved || Number(saved.season) !== position.season || Number(saved.episode) !== position.episode) return;

        if (Number.isFinite(video.duration) && saved.currentTime < video.duration - 2) {
            video.currentTime = Math.max(0, Number(saved.currentTime) || 0);
        }
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("resume");
        window.history.replaceState({}, "", cleanUrl);
    }

    video.addEventListener("loadedmetadata", restoreProgress);
    video.addEventListener("timeupdate", () => {
        if (video.currentTime >= 1 && Math.floor(video.currentTime) % 5 === 0) saveProgress();
    });
    video.addEventListener("pause", saveProgress);
    video.addEventListener("seeked", saveProgress);
    window.addEventListener("pagehide", saveProgress);

    // Supprime l’épisode terminé. Si le lecteur passe au suivant, sa métadonnée
    // chargée ensuite permettra d’enregistrer la nouvelle progression.
    video.addEventListener("ended", () => {
        const history = readHistory();
        delete history[String(animeId)];
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (error) {
            console.warn("Impossible de mettre à jour l’historique vidéo.", error);
        }
    });
})();

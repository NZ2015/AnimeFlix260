/* Choix entre le mode standard, cinéma et plein écran. */
(() => {
    const modeSelect = document.getElementById("displayMode");
    const playerContainer = document.getElementById("playerContainer");
    const videoContainer = document.getElementById("videoContainer");

    if (!modeSelect || !playerContainer || !videoContainer) return;

    const storageKey = "animeflix-player-mode";
    const savedMode = localStorage.getItem(storageKey);
    const initialMode = savedMode === "cinema" ? "cinema" : "standard";

    function setMode(mode, save = true) {
        const cinema = mode === "cinema";
        playerContainer.classList.toggle("cinema-mode", cinema);
        modeSelect.value = cinema ? "cinema" : "standard";

        if (save) {
            localStorage.setItem(storageKey, cinema ? "cinema" : "standard");
        }
    }

    setMode(initialMode, false);

    modeSelect.addEventListener("change", async () => {
        const mode = modeSelect.value;

        if (mode === "fullscreen") {
            try {
                if (!document.fullscreenElement) {
                    await videoContainer.requestFullscreen();
                }
            } catch (error) {
                console.warn("Le plein écran n’est pas disponible :", error);
            }
            modeSelect.value = playerContainer.classList.contains("cinema-mode")
                ? "cinema"
                : "standard";
            return;
        }

        setMode(mode);
    });

    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            modeSelect.value = playerContainer.classList.contains("cinema-mode")
                ? "cinema"
                : "standard";
        }
    });
})();

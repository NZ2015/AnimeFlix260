/* Standard, cinéma, plein écran, mini lecteur et mode nuit. */
(() => {
    const modeSelect = document.getElementById("displayMode");
    const playerContainer = document.getElementById("playerContainer");
    const videoContainer = document.getElementById("videoContainer");
    const miniPlayerBtn = document.getElementById("miniPlayerBtn");
    const closeMiniPlayer = document.getElementById("closeMiniPlayer");
    const nightModeBtn = document.getElementById("nightModeBtn");

    if (!modeSelect || !playerContainer || !videoContainer) return;

    const MODE_KEY = "animeflix-player-mode";
    const NIGHT_KEY = "animeflix-night-mode";

    function readPreference(key, fallback) {
        try {
            return localStorage.getItem(key) ?? fallback;
        } catch (error) {
            return fallback;
        }
    }

    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // Le lecteur continue de fonctionner si le stockage est désactivé.
        }
    }

    function setDisplayMode(mode, save = true) {
        const normalizedMode = mode === "cinema" ? "cinema" : "standard";
        playerContainer.classList.toggle("cinema-mode", normalizedMode === "cinema");
        modeSelect.value = normalizedMode;
        if (save) savePreference(MODE_KEY, normalizedMode);
    }

    const savedMode = readPreference(MODE_KEY, "standard");
    setDisplayMode(savedMode, false);

    function setMiniPlayer(enabled) {
        videoContainer.classList.toggle("mini-player-mode", enabled);
        if (miniPlayerBtn) {
            miniPlayerBtn.setAttribute("aria-pressed", String(enabled));
            miniPlayerBtn.innerHTML = enabled
                ? '<i class="fas fa-up-right-and-down-left-from-center"></i> Agrandir'
                : '<i class="fas fa-clone"></i> Mini lecteur';
        }
    }

    miniPlayerBtn?.addEventListener("click", () => {
        setMiniPlayer(!videoContainer.classList.contains("mini-player-mode"));
    });

    closeMiniPlayer?.addEventListener("click", () => setMiniPlayer(false));

    modeSelect.addEventListener("change", async () => {
        const selectedMode = modeSelect.value;

        if (selectedMode === "fullscreen") {
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

        setDisplayMode(selectedMode);
    });

    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            modeSelect.value = playerContainer.classList.contains("cinema-mode")
                ? "cinema"
                : "standard";
        }
    });

    function setNightMode(enabled, save = true) {
        document.body.classList.toggle("night-mode", enabled);
        if (nightModeBtn) {
            nightModeBtn.setAttribute("aria-pressed", String(enabled));
            nightModeBtn.innerHTML = enabled
                ? '<i class="fas fa-sun"></i> Mode clair'
                : '<i class="fas fa-moon"></i> Mode nuit';
        }
        if (save) savePreference(NIGHT_KEY, String(enabled));
    }

    setNightMode(readPreference(NIGHT_KEY, "false") === "true", false);
    nightModeBtn?.addEventListener("click", () => {
        setNightMode(!document.body.classList.contains("night-mode"));
    });
})();

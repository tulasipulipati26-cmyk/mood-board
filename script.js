/* ============================================
   MOOD BOARD — JavaScript
   ============================================ */

/*
  Each mood maps to:
    - a CSS class name (applied to <body>)
    - a Spotify URI (used by the official iFrame API)
*/
const moods = {
  focused: {
    bodyClass: "mood-focused",
    spotifyUri: "spotify:playlist:37i9dQZF1DWZeKCadgRdKQ",
  },
  chill: {
    bodyClass: "mood-chill",
    spotifyUri: "spotify:playlist:37i9dQZF1DX4sWSpwq3LiO",
  },
  hype: {
    bodyClass: "mood-hype",
    spotifyUri: "spotify:playlist:37i9dQZF1DX76Wlfdnj7AP",
  },
  sad: {
    bodyClass: "mood-sad",
    spotifyUri: "spotify:playlist:37i9dQZF1DX7qK8ma5wgG1",
  },
};

// Reference to the Spotify embed controller (set when API is ready)
let embedController = null;
let currentMood = "focused";

/**
 * Try to start playback after loading a playlist.
 * Browsers only allow audio after a user click — mood buttons count as that click.
 */
function startPlayback() {
  if (!embedController) return;

  const playAttempt = embedController.resume?.() ?? embedController.play?.();

  // Newer API versions return a promise from loadUri / play
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {
      /* Autoplay blocked — user can press ▶ inside the Spotify player */
    });
  }
}

/**
 * Load a playlist into the Spotify player.
 */
function loadPlaylist(spotifyUri) {
  if (!embedController) return;

  const loadResult = embedController.loadUri(spotifyUri);

  if (loadResult && typeof loadResult.then === "function") {
    loadResult.then(startPlayback).catch(() => {
      startPlayback();
    });
  } else {
    startPlayback();
  }
}

/**
 * changeMood — switches the page theme and Spotify playlist.
 * @param {string} mood - One of: "focused", "chill", "hype", "sad"
 */
function changeMood(mood) {
  if (!moods[mood]) {
    console.warn(`Unknown mood: "${mood}"`);
    return;
  }

  currentMood = mood;
  const { bodyClass, spotifyUri } = moods[mood];
  const body = document.body;

  /* --- 1. Update the page theme (background, text, font) --- */
  Object.values(moods).forEach(({ bodyClass: cls }) => {
    body.classList.remove(cls);
  });
  body.classList.add(bodyClass);

  /* --- 2. Load the matching Spotify playlist --- */
  loadPlaylist(spotifyUri);

  /* --- 3. Highlight the active mood button --- */
  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mood === mood);
  });
}

/**
 * Called by Spotify when the iFrame API script has loaded.
 * Must be a global function with this exact name.
 */
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById("embed-iframe");
  const width = element.offsetWidth || 720;

  IFrameAPI.createController(
    element,
    {
      width,
      height: 352,
      uri: moods.focused.spotifyUri,
    },
    (controller) => {
      embedController = controller;
      changeMood(currentMood);
    }
  );
};

/* Load Spotify's official iFrame API (after onSpotifyIframeApiReady is defined) */
(function loadSpotifyApi() {
  const script = document.createElement("script");
  script.src = "https://open.spotify.com/embed/iframe-api/v1";
  script.async = true;
  document.body.appendChild(script);
})();

// Highlight the default mood on first paint
document.addEventListener("DOMContentLoaded", () => {
  changeMood("focused");
});

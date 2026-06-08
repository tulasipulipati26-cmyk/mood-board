/* ============================================
   MOOD BOARD — JavaScript
   ============================================ */

/*
  Each mood maps to:
    - a CSS class name (applied to <body>)
    - a Spotify playlist embed URL
  Replace the playlist IDs with your own favourites anytime!
*/
const moods = {
  focused: {
    bodyClass: "mood-focused",
    playlist:
      "https://open.spotify.com/embed/playlist/37i9dQZF1DWZeKCadgRdTQ?utm_source=generator",
  },
  chill: {
    bodyClass: "mood-chill",
    playlist:
      "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator",
  },
  hype: {
    bodyClass: "mood-hype",
    playlist:
      "https://open.spotify.com/embed/playlist/37i9dQZF1DX76Wlfdnj7AP?utm_source=generator",
  },
  sad: {
    bodyClass: "mood-sad",
    playlist:
      "https://open.spotify.com/embed/playlist/37i9dQZF1DX7qK8ma5wgG1?utm_source=generator",
  },
};

/**
 * changeMood — switches the page theme and Spotify playlist.
 * @param {string} mood - One of: "focused", "chill", "hype", "sad"
 */
function changeMood(mood) {
  // Guard: ignore invalid mood names
  if (!moods[mood]) {
    console.warn(`Unknown mood: "${mood}"`);
    return;
  }

  const { bodyClass, playlist } = moods[mood];
  const body = document.body;
  const player = document.getElementById("spotify-player");

  /* --- 1. Update the page theme (background, text, font) --- */

  // Remove every mood class, then add the new one
  Object.values(moods).forEach(({ bodyClass: cls }) => {
    body.classList.remove(cls);
  });
  body.classList.add(bodyClass);

  /* --- 2. Update the Spotify embed source --- */

  if (player && player.src !== playlist) {
    player.src = playlist;
  }

  /* --- 3. Highlight the active mood button --- */

  document.querySelectorAll(".mood-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mood === mood);
  });
}

// Set the default mood when the page first loads
document.addEventListener("DOMContentLoaded", () => {
  changeMood("focused");
});

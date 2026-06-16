// overlays.js
function showPauseOverlay(level, lives) {
    document.getElementById("pause-level").textContent = level + 1;
    document.getElementById("pause-lives").textContent = lives;
    document.getElementById("pause-overlay").classList.remove("hidden");
    document.getElementById("won-overlay").classList.add("hidden");
  }
  
  function hidePauseOverlay() {
    document.getElementById("pause-overlay").classList.add("hidden");
  }
  
  function showWonOverlay(level) {
    document.getElementById("won-level").textContent = level + 1;
    document.getElementById("won-overlay").classList.remove("hidden");
    document.getElementById("pause-overlay").classList.add("hidden");
  }
  
  function hideWonOverlay() {
    document.getElementById("won-overlay").classList.add("hidden");
  }

  export {
    showPauseOverlay,
    hidePauseOverlay,
    showWonOverlay,
    hideWonOverlay
  };
  
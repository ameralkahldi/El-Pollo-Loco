let canvas;
let world;
let keyboard = new Keyboard();
let audioManager;
let soundEnabled = true;
let musicEnabled = true;
let gameIsPaused = false;

/**
 * Initializes all game components on page load
 */
window.addEventListener("DOMContentLoaded", () => {
  audioManager = new AudioManager();
  updateMuteButtons();
  setupControlButtons();
  setupGameNavigationButtons();
  handleOrientationWarning();
  setupInfoButton();
  checkStartMenuOrientation();
  setupInfoPopups();
  setupAudioButtons();
  
  if (window.innerWidth <= 1400) {
    showMobileControls();
  }
});

/**
 * Initializes the game canvas and world
 */
function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard, audioManager);
  if (audioManager && audioManager.musicEnabled) {
    audioManager.toggleBackgroundMusic(true);
  }
}

/**
 * Starts the game, checks screen orientation, and handles music & controls.
 */
function startGame() {
  if (isPortraitOnSmallScreen()) {
    showOrientationWarning();
    return;
  }

  hideStartMenuAndShowGame();
  showControlsIfNeeded();
  init();
}

/**
 * Checks if the device is in portrait mode and on a small screen.
 */
function isPortraitOnSmallScreen() {
  const isPortrait = window.innerHeight > window.innerWidth;
  const isSmallScreen = window.innerWidth <= 500;
  return isPortrait && isSmallScreen;
}

/**
 * Shows the orientation warning and resets game display.
 */
function showOrientationWarning() {
  document.getElementById("orientationWarning").classList.remove("hidden");
  document.getElementById("startMenu").style.display = "block";
  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("canvas").classList.add("hidden");
}

/**
 * Hides the menu and shows the game canvas.
 */
function hideStartMenuAndShowGame() {
  document.getElementById("orientationWarning").classList.add("hidden");
  document.getElementById("startMenu").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  document.getElementById("canvas").classList.remove("hidden");
}

/**
 * Shows mobile controls if screen width is less than or equal to 1400.
 */
function showControlsIfNeeded() {
  if (window.innerWidth <= 1400) {
    showMobileControls();
  }
}

/**
 * Handles game over logic including showing win/lose screen and sounds.
 * @param {boolean} won - Indicates if the player won.
 */
function gameOver(won) {
  stopGame();
  hideMobileControlsOnGameOver();
  updateGameOverImage(won);
  playGameOverSoundsIfLost(won);
  showGameOverScreen();
}

/**
 * Hides the bottom control panel when the game ends.
 */
function hideMobileControlsOnGameOver() {
  document.getElementById("bottomPanel").classList.add("hidden");
}

/**
 * Updates the game over image depending on whether the player won.
 * @param {boolean} won
 */
function updateGameOverImage(won) {
  const img = document.getElementById("gameOverImage");
  img.src = won
    ? "./img/9_intro_outro_screens/win_2.png"
    : "./img/9_intro_outro_screens/game_over/game over.png";
}

/**
 * Plays sound effects if the player lost.
 * @param {boolean} won
 */
function playGameOverSoundsIfLost(won) {
  if (won) return;

  if (audioManager) {
    audioManager.playSound("chickenDeath");
    audioManager.playSound("gameOver");
  }
}

/**
 * Displays the game over screen and hides the canvas.
 */
function showGameOverScreen() {
  document.getElementById("gameOverScreen").classList.remove("hidden");
  document.getElementById("canvas").classList.add("hidden");
}

/**
 * Stops the game, clears the canvas and resets audio.
 */
function stopGame() {
  if (world) {
    world.stop();
    world = null;
  }

  if (canvas) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  if (audioManager) {
    audioManager.toggleBackgroundMusic(false);
  }
}

/**
 * Handles binding of keyboard key down events.
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
});

/**
 * Handles binding of keyboard key up events.
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});

/**
 * Connect the control buttons
 */
function setupControlButtons() {
  function bindControlButton(buttonId, key) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.addEventListener("mousedown", () => (keyboard[key] = true));
    button.addEventListener("mouseup", () => (keyboard[key] = false));

    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });
    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  }
  bindControlButton("btnLeft", "LEFT");
  bindControlButton("btnRight", "RIGHT");
  bindControlButton("btnJump", "SPACE");
  bindControlButton("btnThrow", "D");
}

/**
 * Preparing the back to menu and restart buttons
 */
function setupGameNavigationButtons() {
  setupBackToMenuButton();
  setupRestartButton();
}

/**
 * Sets up the back-to-menu button functionality.
 */
function setupBackToMenuButton() {
  const backBtn = document.getElementById("backToMenuButton");
  if (!backBtn) return;

  backBtn.addEventListener("click", () => {
    stopGame();
    document.getElementById("startMenu").style.display = "block";
    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("canvas").classList.add("hidden");
  });
}

/**
 * Sets up the restart button functionality.
 */
function setupRestartButton() {
  const restartBtn = document.getElementById("restartButton");
  if (!restartBtn) return;

  restartBtn.addEventListener("click", () => {
    stopGame();
    document.getElementById("gameOverScreen").classList.add("hidden");
    document.getElementById("canvas").classList.remove("hidden");
    const soundMenu = document.querySelector(".sound-menu");
    if (soundMenu) {
      soundMenu.style.display = "none";
    }
    document.getElementById("bottomPanel").classList.remove("hidden");
    init();
    
    if (audioManager && audioManager.musicEnabled) {
      audioManager.toggleBackgroundMusic(true);
    }
  });
}

/**
 * Resizes canvas to fit screen while maintaining aspect ratio.
 */
function resizeCanvasToFullscreen() {
  const canvas = document.getElementById("canvas");

  if (document.fullscreenElement) {
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
  } else {
    canvas.style.width = `${window.innerWidth * 0.5}px`;
    canvas.style.height = `${window.innerHeight * 0.5}px`;
  }
}

document.addEventListener("fullscreenchange", resizeCanvasToFullscreen);

window.addEventListener("load", () => {
  resizeCanvasToFullscreen();
  handleOrientationWarning();
  checkStartMenuOrientation();
});

window.addEventListener("resize", () => {
  resizeCanvasToFullscreen();
  handleOrientationWarning();
  checkStartMenuOrientation();
});

/**
 * Displays mobile control panel.
 */
function showMobileControls() {
  const panel = document.getElementById("bottomPanel");
  if (panel) panel.classList.remove("hidden");
}

/**
 * Hides mobile control panel.
 */
function hideMobileControls() {
  const panel = document.getElementById("bottomPanel");
  if (panel) panel.classList.add("hidden");
}

/**
 * Displays orientation warning if in portrait mode on small screen.
 */
function handleOrientationWarning() {
  const warning = document.getElementById("orientationWarning");
  const isPortrait = window.innerHeight > window.innerWidth;

  if (window.innerWidth <= 800 && isPortrait) {
    warning.classList.remove("hidden");
  } else {
    warning.classList.add("hidden");
  }
}

/**
 * Automatically starts the game on orientation change to landscape.
 */
function checkStartMenuOrientation() {
  const orientationWarning = document.getElementById("orientationWarning");
  const startMenu = document.getElementById("startMenu");
  const gameCon = document.getElementById("gameContainer");
  const isPortrait = window.innerHeight > window.innerWidth;
  const isNarrow = window.innerWidth <= 1400;

  if (isNarrow && isPortrait) {
    orientationWarning.classList.remove("hidden");
    startMenu.style.display = "block";
    gameCon.style.display = "none";
  } else {
    orientationWarning.classList.add("hidden");
  }
}

window.addEventListener("load", checkStartMenuOrientation);
window.addEventListener("orientationchange", () => {
  setTimeout(checkStartMenuOrientation, 300);
});

/**
 * Setup audio mute/unmute buttons
 */
function setupAudioButtons() {
  const muteBtn = document.getElementById("mute");
  const unmuteBtn = document.getElementById("unmute");
  if (!muteBtn || !unmuteBtn) return;

  updateMuteButtons();

  muteBtn.addEventListener("click", () => {
    audioManager.setSoundEnabled(false);
    updateMuteButtons();
  });

  unmuteBtn.addEventListener("click", () => {
    audioManager.setSoundEnabled(true);
    updateMuteButtons();
  });
}

/**
 * Updates mute button visibility based on audio state
 */
function updateMuteButtons() {
  const muteBtn = document.getElementById("mute");
  const unmuteBtn = document.getElementById("unmute");
  
  if (!muteBtn || !unmuteBtn || !audioManager) return;
  
  if (audioManager.soundEnabled) {
    muteBtn.classList.remove("hidden");
    unmuteBtn.classList.add("hidden");
  } else {
    muteBtn.classList.add("hidden");
    unmuteBtn.classList.remove("hidden");
  }
}

/**
 * Toggles info panel visibility.
 */
function setupInfoButton() {
  const infoButton = document.getElementById("infoButton");
  const controlDiv = document.getElementById("controlDiv");

  if (!infoButton || !controlDiv) return;

  infoButton.addEventListener("click", () => {
    controlDiv.classList.toggle("hidden");
  });
}

/**
 * Setup impressum and datenschutz popups
 */
function setupInfoPopups() {
  // Impressum
  const impressumBtn = document.getElementById("impressumButton");
  const impressumPopup = document.getElementById("impressumPopup");
  const impressumClose = impressumPopup?.querySelector(".closePopup");

  if (impressumBtn && impressumPopup && impressumClose) {
    impressumBtn.addEventListener("click", () =>
      impressumPopup.classList.remove("hidden")
    );
    impressumClose.addEventListener("click", () =>
      impressumPopup.classList.add("hidden")
    );
  }

  // Datenschutz
  const datenschutzBtn = document.getElementById("datenschutzButton");
  const datenschutzPopup = document.getElementById("datenschutzPopup");
  const datenschutzClose = datenschutzPopup?.querySelector(".closePopup");

  if (datenschutzBtn && datenschutzPopup && datenschutzClose) {
    datenschutzBtn.addEventListener("click", () =>
      datenschutzPopup.classList.remove("hidden")
    );
    datenschutzClose.addEventListener("click", () =>
      datenschutzPopup.classList.add("hidden")
    );
  }
}
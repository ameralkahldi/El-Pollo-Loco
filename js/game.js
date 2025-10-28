let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;
let musicEnabled = true;
const backgroundMusic = new Audio("audio/audio_music.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;
let gameIsPaused = false;

/**
 * Initializes the game canvas and world.
 */

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
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
  startBackgroundMusicIfEnabled();
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
 * Plays background music if music is enabled.
 */
function startBackgroundMusicIfEnabled() {
  if (musicEnabled) {
    backgroundMusic.play().catch((e) => console.warn("Music blockiert:", e));
  }
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

  playSound("audio/audio_chicken_death.mp3");
  playSound("audio/audio_game_over.wav");
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

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
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
 * Initializes UI and game setup on page load.
 */

window.addEventListener("DOMContentLoaded", () => {
  setupControlButtons();
  setupSoundMenu();
  setupFullscreenToggle();
  setupGameNavigationButtons();
  handleOrientationWarning();
  setupInfoButton();
  checkStartMenuOrientation();
  setupInfoPopups();
});

//*Connect the control buttons*/
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
 * Sets up sound and music toggle behavior in the menu.
 */
function setupSoundMenu() {
  setupSoundMenuToggle();
  setupSoundToggle();
  setupMusicToggle();
}

/**
 * Handles opening and closing of the sound menu.
 */
function setupSoundMenuToggle() {
  const soundIcon = document.getElementById("soundIcon");
  const soundMenu = document.querySelector(".sound-menu");
  const closeSoundMenu = document.querySelector(".sound-menu .close-icon");

  if (soundIcon && soundMenu) {
    soundIcon.addEventListener("click", () => {
      soundMenu.style.display = "flex";
    });
  }

  if (closeSoundMenu && soundMenu) {
    closeSoundMenu.addEventListener("click", () => {
      soundMenu.style.display = "none";
    });
  }
}

/**
 * Toggles general sound on/off and updates the switch UI.
 */
function setupSoundToggle() {
  const soundSwitch = document.getElementById("sound-switch");
  if (!soundSwitch) return;

  soundSwitch.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundSwitch.src = soundEnabled
      ? "./img/11-menu/switch_on.png"
      : "./img/11-menu/switch_off.png";

    localStorage.setItem("soundEnabled", soundEnabled);

    if (!soundEnabled) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      document.querySelectorAll("audio").forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    } else if (musicEnabled) {
      backgroundMusic
        .play()
        .catch((e) => console.warn("Music not started:", e));
    }
  });
}
// On page load, retrieve the saved sound and music settings
window.addEventListener("DOMContentLoaded", () => {
  // Retrieve saved sound setting from localStorage
  const savedSound = localStorage.getItem("soundEnabled");
  if (savedSound !== null) {
    soundEnabled = savedSound === "true";
    const soundSwitch = document.getElementById("sound-switch");
    if (soundSwitch) {
      soundSwitch.src = soundEnabled
        ? "./img/11-menu/switch_on.png" // If sound is enabled, show "on" switch
        : "./img/11-menu/switch_off.png"; // If sound is disabled, show "off" switch
    }
  }

  // Retrieve saved music setting from localStorage
  const savedMusic = localStorage.getItem("musicEnabled");
  if (savedMusic !== null) {
    musicEnabled = savedMusic === "true";
    const musicSwitch = document.getElementById("music-switch");
    if (musicSwitch) {
      musicSwitch.src = musicEnabled
        ? "./img/11-menu/switch_on.png" // If music is enabled, show "on" switch
        : "./img/11-menu/switch_off.png"; // If music is disabled, show "off" switch
    }
  }

  // Play background music if both music and sound are enabled
  if (musicEnabled && soundEnabled) {
    backgroundMusic.play().catch((e) => console.warn("Music not started:", e));
  }
});

function playSound(path, volume = 1) {
  if (!soundEnabled) return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch((e) => console.warn(`Audio blocked: ${e}`));
}

/**
 * Toggles background music on/off and updates the switch UI.
 */
function setupMusicToggle() {
  const musicSwitch = document.getElementById("music-switch");
  if (!musicSwitch) return;

  musicSwitch.addEventListener("click", () => {
    musicEnabled = !musicEnabled;
    musicSwitch.src = musicEnabled
      ? "./img/11-menu/switch_on.png"
      : "./img/11-menu/switch_off.png";

    localStorage.setItem("musicEnabled", musicEnabled);

    if (musicEnabled && soundEnabled) {
      backgroundMusic
        .play()
        .catch((e) => console.warn("Music not started:", e));
    } else {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  });
}
/** Switch to full screen mode */

function setupFullscreenToggle() {
  const fullscreenSwitch = document.getElementById("fullscreen-switch");
  if (!fullscreenSwitch) return;

  fullscreenSwitch.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      fullscreenSwitch.src = "./img/11-menu/switch_on.png";
    } else {
      document.exitFullscreen();
      fullscreenSwitch.src = "./img/11-menu/switch_off.png";
    }
  });
}

//*Preparing the back to menu and restart buttons*/

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
    document.querySelector(".sound-menu").style.display = "none";
    document.getElementById("bottomPanel").classList.remove("hidden");
    init();

    if (musicEnabled) {
      backgroundMusic
        .play()
        .catch((e) => console.warn("Music not started:", e));
    }
  });
}

/**
 * Resizes canvas to fit screen while maintaining aspect ratio.
 */

function resizeCanvasToFullscreen() {
  const canvas = document.getElementById("canvas");
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const newWidth = screenWidth * 0.5; 
  const newHeight = screenHeight * 0.5; 

  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
}

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
  panel.classList.remove("hidden");
}

/**
 * Hides mobile control panel.
 */
function hideMobileControls() {
  const panel = document.getElementById("bottomPanel");
  panel.classList.add("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth <= 1400) {
    showMobileControls();
  }
});

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

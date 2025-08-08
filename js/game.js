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
  console.log("My Character is: ", world.character);
}


/**
 * Starts the game, checks screen orientation, and handles music & controls.
 */

function startGame() {
  const isPortrait = window.innerHeight > window.innerWidth;
  const isSmallScreen = window.innerWidth <= 400;

  if (isSmallScreen && isPortrait) {
    document.getElementById("orientationWarning").classList.remove("hidden");
    document.getElementById("startMenu").style.display = "block";
    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("canvas").classList.add("hidden");
    return;
  }

  document.getElementById("orientationWarning").classList.add("hidden");
  document.getElementById("startMenu").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  document.getElementById("canvas").classList.remove("hidden");

  if (musicEnabled) {
    backgroundMusic.play().catch((e) => console.warn("Music blockiert:", e));
  }

  if (window.innerWidth <= 768) {
    showMobileControls();
  }

  init();
}


/**
 * Handles game over logic including showing win/lose screen and sounds.
 * @param {boolean} won - Indicates if the player won.
 */

function gameOver(won) {
  stopGame();

  const screen = document.getElementById("gameOverScreen");
  const img = document.getElementById("gameOverImage");
  const canvas = document.getElementById("canvas");

  img.src = won
    ? "./img/9_intro_outro_screens/win_2.png"
    : "./img/9_intro_outro_screens/game_over/game over.png";

  if (!won) {
    const deathSound = new Audio("audio/audio_chicken_death.mp3");
    deathSound.play().catch((e) => {
      console.error("Failed to play death sound:", e);
    });

    const gameOverSound = new Audio("audio/audio_game_over.wav");
    gameOverSound.play().catch((e) => {
      console.warn("Game over sound blocked:", e);
    });
  }

  screen.classList.remove("hidden");
  canvas.classList.add("hidden");
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
 */function setupSoundMenu() {
  const soundIcon = document.getElementById("soundIcon");
  const soundMenu = document.querySelector(".sound-menu");
  const closeSoundMenu = document.querySelector(".sound-menu .close-icon");
  const soundSwitch = document.getElementById("sound-switch");
  const musicSwitch = document.getElementById("music-switch");

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

  if (soundSwitch) {
    soundSwitch.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      soundSwitch.src = soundEnabled
        ? "./img/11-menu/switch_on.png"
        : "./img/11-menu/switch_off.png";

      if (!soundEnabled) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        document.querySelectorAll("audio").forEach((audio) => {
          audio.pause();
          audio.currentTime = 0;
        });
      } else {
        if (musicEnabled)
          backgroundMusic
            .play()
            .catch((e) => console.warn("Music not started:", e));
      }
    });
  }

  if (musicSwitch) {
    musicSwitch.addEventListener("click", () => {
      musicEnabled = !musicEnabled;
      musicSwitch.src = musicEnabled
        ? "./img/11-menu/switch_on.png"
        : "./img/11-menu/switch_off.png";

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
  const backBtn = document.getElementById("backToMenuButton");
  const restartBtn = document.getElementById("restartButton");

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      stopGame();
      document.getElementById("startMenu").style.display = "block";
      document.getElementById("gameOverScreen").classList.add("hidden");
      document.getElementById("canvas").classList.add("hidden");
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      stopGame();
      document.getElementById("gameOverScreen").classList.add("hidden");
      document.getElementById("canvas").classList.remove("hidden");
      document.querySelector(".sound-menu").style.display = "none";
      init();

      if (musicEnabled) {
        backgroundMusic
          .play()
          .catch((e) => console.warn("Musik nicht gestartet:", e));
      }
    });
  }



   /**
   * Resizes canvas to fit screen while maintaining aspect ratio.
   */

  function resizeCanvasToFullscreen() {
    const canvas = document.getElementById("canvas");
    const container = document.getElementById("gameContainer") || document.body;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const aspectRatio = 10 / 4;

    let newWidth = screenWidth;
    let newHeight = screenWidth / aspectRatio;

    if (newHeight > screenHeight) {
      newHeight = screenHeight;
      newWidth = newHeight * aspectRatio;
    }

    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
  }

  window.addEventListener("load", resizeCanvasToFullscreen);
  window.addEventListener("resize", resizeCanvasToFullscreen);
  window.addEventListener("orientationchange", () => {
    setTimeout(resizeCanvasToFullscreen, 300); 
    });

  window.addEventListener("load", resizeCanvasToFullscreen);
  window.addEventListener("resize", resizeCanvasToFullscreen);
  window.addEventListener("load", handleOrientationWarning);
  window.addEventListener("resize", handleOrientationWarning);
  window.addEventListener("orientationchange", handleOrientationWarning);
}


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

// Example: Show only if the screen is small
if (window.innerWidth <= 768) {
  showMobileControls();
}



/**
 * Displays orientation warning if in portrait mode on small screen.
 */


function handleOrientationWarning() {
  const warning = document.getElementById("orientationWarning");
  const isPortrait = window.innerHeight > window.innerWidth;

  if (window.innerWidth <= 400 && isPortrait) {
    warning.classList.remove("hidden");
  } else {
    warning.classList.add("hidden");
  }
}

/**
 * Automatically starts the game on orientation change to landscape.
 */

window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isSmallScreen = window.innerWidth <= 400;

    if (!isPortrait && isSmallScreen) {
      document.getElementById("orientationWarning").classList.add("hidden");
      startGame();
    }
  }, 300);
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

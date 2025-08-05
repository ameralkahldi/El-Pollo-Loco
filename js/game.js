let canvas;
let world;
let keyboard = new Keyboard();
let soundEnabled = true;
let musicEnabled = true;
const backgroundMusic = new Audio('audio/audio_music.mp3');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;
let gameIsPaused = false;



function init() {

  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  console.log("My Character is: ", world.character);
}


function startGame() {
  const isPortrait = window.innerHeight > window.innerWidth;
  const isSmallScreen = window.innerWidth <= 400;

  if (isSmallScreen && isPortrait) {
    // عرض تنبيه التدوير وإيقاف بدء اللعبة
    document.getElementById('orientationWarning').classList.remove('hidden');
    document.getElementById('startMenu').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('canvas').classList.add('hidden');
    return;
  }

  // إخفاء التنبيه وتشغيل اللعبة
  document.getElementById('orientationWarning').classList.add('hidden');
  document.getElementById('startMenu').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';
  document.getElementById('canvas').classList.remove('hidden');

  if (musicEnabled) {
    backgroundMusic.play().catch(e => console.warn('Music blockiert:', e));
  }

  if (window.innerWidth <= 768) {
    showMobileControls();
  }

  init();
}



function gameOver(won) {
  stopGame();

  const screen = document.getElementById('gameOverScreen');
  const img = document.getElementById('gameOverImage');
  const canvas = document.getElementById('canvas');

  img.src = won
    ? './img/9_intro_outro_screens/win_2.png'
    : './img/9_intro_outro_screens/game_over/game over.png';

  if (!won) {
    const deathSound = new Audio('audio/audio_chicken_death.mp3');
    deathSound.play().catch((e) => {
      console.error('Failed to play death sound:', e);
    });

    const gameOverSound = new Audio('audio/audio_game_over.wav');
    gameOverSound.play().catch((e) => {
      console.warn('Game over sound blocked:', e);
    });
  }

  screen.classList.remove('hidden');
  canvas.classList.add('hidden');
}


function stopGame() {
  if (world) {
    world.stop();
    world = null;
  }

  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = true;
  if (e.keyCode == 37) keyboard.LEFT = true;
  if (e.keyCode == 38) keyboard.UP = true;
  if (e.keyCode == 40) keyboard.DOWN = true;
  if (e.keyCode == 32) keyboard.SPACE = true;
  if (e.keyCode == 68) keyboard.D = true;
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) keyboard.RIGHT = false;
  if (e.keyCode == 37) keyboard.LEFT = false;
  if (e.keyCode == 38) keyboard.UP = false;
  if (e.keyCode == 40) keyboard.DOWN = false;
  if (e.keyCode == 32) keyboard.SPACE = false;
  if (e.keyCode == 68) keyboard.D = false;
});



window.addEventListener('DOMContentLoaded', () => {
  setupControlButtons();
  setupSoundMenu();
  setupPauseButton();
  setupFullscreenToggle();
  setupGameNavigationButtons();
  handleOrientationWarning();

});


//*Connect the control buttons*/
function setupControlButtons() {
  function bindControlButton(buttonId, key) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.addEventListener('mousedown', () => keyboard[key] = true);
    button.addEventListener('mouseup', () => keyboard[key] = false);

    button.addEventListener('touchstart', (e) => {
      e.preventDefault();
      keyboard[key] = true;
    });
    button.addEventListener('touchend', (e) => {
      e.preventDefault();
      keyboard[key] = false;
    });
  }

  bindControlButton('btnLeft', 'LEFT');
  bindControlButton('btnRight', 'RIGHT');
  bindControlButton('btnJump', 'SPACE');
  bindControlButton('btnThrow', 'D');
}

//Sound and Music List Count
function setupSoundMenu() {
  const soundIcon = document.getElementById('soundIcon');
  const soundMenu = document.querySelector('.sound-menu');
  const closeSoundMenu = document.querySelector('.sound-menu .close-icon');
  const soundSwitch = document.getElementById('sound-switch');
  const musicSwitch = document.getElementById('music-switch');

  if (soundIcon && soundMenu) {
    soundIcon.addEventListener('click', () => {
      soundMenu.style.display = 'flex';
    });
  }

  if (closeSoundMenu && soundMenu) {
    closeSoundMenu.addEventListener('click', () => {
      soundMenu.style.display = 'none';
    });
  }

  if (soundSwitch) {
    soundSwitch.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundSwitch.src = soundEnabled
        ? './img/11-menu/switch_on.png'
        : './img/11-menu/switch_off.png';
    });
  }

  if (musicSwitch) {
    musicSwitch.addEventListener('click', () => {
      musicEnabled = !musicEnabled;
      musicSwitch.src = musicEnabled
        ? './img/11-menu/switch_on.png'
        : './img/11-menu/switch_off.png';

      if (musicEnabled) {
        backgroundMusic.play().catch(e => console.warn('Music not started:', e));
      } else {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    });
  }
}

/** Pause button */
function setupPauseButton() {
  const pauseBtn = document.getElementById('pauseButton');
  if (!pauseBtn) return;

  pauseBtn.addEventListener('click', () => {
    gameIsPaused = !gameIsPaused;

    if (gameIsPaused) {
      backgroundMusic.pause();
      pauseBtn.innerText = '▶️ استئناف';
    } else {
      if (musicEnabled) backgroundMusic.play();
      pauseBtn.innerText = '⏸️ إيقاف مؤقت';
    }
  });
}

/** Switch to full screen mode */

function setupFullscreenToggle() {
  const fullscreenSwitch = document.getElementById('fullscreen-switch');
  if (!fullscreenSwitch) return;

  fullscreenSwitch.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      fullscreenSwitch.src = './img/11-menu/switch_on.png';
    } else {
      document.exitFullscreen();
      fullscreenSwitch.src = './img/11-menu/switch_off.png';
    }
  });
}

//*Preparing the back to menu and restart buttons*/

function setupGameNavigationButtons() {
  const backBtn = document.getElementById('backToMenuButton');
  const restartBtn = document.getElementById('restartButton');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      stopGame();
      document.getElementById('startMenu').style.display = 'block';
      document.getElementById('gameOverScreen').classList.add('hidden');
      document.getElementById('canvas').classList.add('hidden');
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      stopGame();
      document.getElementById('gameOverScreen').classList.add('hidden');
      document.getElementById('canvas').classList.remove('hidden');
      document.querySelector('.sound-menu').style.display = 'none';
      init();

      if (musicEnabled) {
        backgroundMusic.play().catch(e => console.warn('Musik nicht gestartet:', e));
      }
    });
  }
  function resizeCanvasToFullscreen() {
  const canvas = document.getElementById('canvas');
  const container = document.getElementById('gameContainer') || document.body;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const aspectRatio = 16 / 9;
  let newWidth = screenWidth;
  let newHeight = screenWidth / aspectRatio;

  // إذا تجاوز الارتفاع حدود الشاشة، يتم التعديل
  if (newHeight > screenHeight) {
    newHeight = screenHeight;
    newWidth = newHeight * aspectRatio;
  }

  canvas.style.width = `${newWidth}px`;
  canvas.style.height = `${newHeight}px`;
}

// استدعاء عند التحميل وتغيير حجم الشاشة
window.addEventListener('load', resizeCanvasToFullscreen);
window.addEventListener('resize', resizeCanvasToFullscreen);
window.addEventListener('load', handleOrientationWarning);
window.addEventListener('resize', handleOrientationWarning);
window.addEventListener('orientationchange', handleOrientationWarning);


}



function showMobileControls() {
  const panel = document.getElementById('bottomPanel');
  panel.classList.remove('hidden');
}

function hideMobileControls() {
  const panel = document.getElementById('bottomPanel');
  panel.classList.add('hidden');
}

// Example: Show only if the screen is small
if (window.innerWidth <= 768) {
  showMobileControls();
}


function handleOrientationWarning() {
  const warning = document.getElementById('orientationWarning');
  const isPortrait = window.innerHeight > window.innerWidth;

  if (window.innerWidth <= 400 && isPortrait) {
    warning.classList.remove('hidden');
  } else {
    warning.classList.add('hidden');
  }
}

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isSmallScreen = window.innerWidth <= 400;

    if (!isPortrait && isSmallScreen) {
      document.getElementById('orientationWarning').classList.add('hidden');
      startGame(); // يبدأ اللعبة تلقائيًا عند التدوير للوضع الأفقي
    }
  }, 300);
});










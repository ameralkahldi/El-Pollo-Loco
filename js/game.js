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
    document.getElementById('orientationWarning').classList.remove('hidden');
    document.getElementById('startMenu').style.display = 'block';
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('canvas').classList.add('hidden');
    return;
  }

  document.getElementById('orientationWarning').classList.add('hidden');
  document.getElementById('startMenu').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';
  document.getElementById('canvas').classList.remove('hidden');

  if (musicEnabled && soundEnabled) {
    backgroundMusic.play().catch(e => console.warn('Music blocked:', e));
  }

  if (window.innerWidth <= 768) showMobileControls();

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
    deathSound.play().catch(e => console.error('Failed to play death sound:', e));

    const gameOverSound = new Audio('audio/audio_game_over.wav');
    gameOverSound.play().catch(e => console.warn('Game over sound blocked:', e));
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
  const keyMap = { 39: 'RIGHT', 37: 'LEFT', 38: 'UP', 40: 'DOWN', 32: 'SPACE', 68: 'D' };
  if (keyMap[e.keyCode]) keyboard[keyMap[e.keyCode]] = true;
});

window.addEventListener("keyup", (e) => {
  const keyMap = { 39: 'RIGHT', 37: 'LEFT', 38: 'UP', 40: 'DOWN', 32: 'SPACE', 68: 'D' };
  if (keyMap[e.keyCode]) keyboard[keyMap[e.keyCode]] = false;
});

// ====================================
// Setup UI and Controls
// ====================================
window.addEventListener('DOMContentLoaded', () => {
  setupControlButtons();
  setupSoundMenu();
  setupPauseButton();
  setupFullscreenToggle();
  setupGameNavigationButtons();
  handleOrientationWarning();
  resizeCanvasToFullscreen();
});

// ---------------- Control Buttons ----------------
function setupControlButtons() {
  function bindControlButton(buttonId, key) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.addEventListener('mousedown', () => keyboard[key] = true);
    button.addEventListener('mouseup', () => keyboard[key] = false);
    button.addEventListener('touchstart', (e) => { e.preventDefault(); keyboard[key] = true; });
    button.addEventListener('touchend', (e) => { e.preventDefault(); keyboard[key] = false; });
  }

  bindControlButton('btnLeft', 'LEFT');
  bindControlButton('btnRight', 'RIGHT');
  bindControlButton('btnJump', 'SPACE');
  bindControlButton('btnThrow', 'D');
}

// ---------------- Sound & Music Menu ----------------
function setupSoundMenu() {
  const soundIcon = document.getElementById('soundIcon');
  const soundMenu = document.querySelector('.sound-menu');
  const closeSoundMenu = document.querySelector('.sound-menu .close-icon');
  const soundSwitch = document.getElementById('sound-switch');
  const musicSwitch = document.getElementById('music-switch');

  soundIcon?.addEventListener('click', () => soundMenu.style.display = 'flex');
  closeSoundMenu?.addEventListener('click', () => soundMenu.style.display = 'none');

  soundSwitch?.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundSwitch.src = soundEnabled
      ? './img/11-menu/switch_on.png'
      : './img/11-menu/switch_off.png';

    if (!soundEnabled) {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
      document.querySelectorAll('audio').forEach(audio => { audio.pause(); audio.currentTime = 0; });
    } else if (musicEnabled) {
      backgroundMusic.play().catch(e => console.warn('Music not started:', e));
    }
  });

  musicSwitch?.addEventListener('click', () => {
    musicEnabled = !musicEnabled;
    musicSwitch.src = musicEnabled
      ? './img/11-menu/switch_on.png'
      : './img/11-menu/switch_off.png';

    if (musicEnabled && soundEnabled) backgroundMusic.play().catch(e => console.warn('Music not started:', e));
    else { backgroundMusic.pause(); backgroundMusic.currentTime = 0; }
  });
}

// ---------------- Pause Button ----------------
function setupPauseButton() {
  const pauseBtn = document.getElementById('pauseButton');
  if (!pauseBtn) return;

  pauseBtn.addEventListener('click', () => {
    gameIsPaused = !gameIsPaused;

    if (gameIsPaused) {
      backgroundMusic.pause();
      pauseBtn.innerText = '▶️ Resume';
    } else {
      if (musicEnabled && soundEnabled) backgroundMusic.play();
      pauseBtn.innerText = '⏸️ Pause';
    }
  });
}

// ---------------- Fullscreen Toggle ----------------
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

// ---------------- Game Navigation Buttons ----------------
function setupGameNavigationButtons() {
  const backBtn = document.getElementById('backToMenuButton');
  const restartBtn = document.getElementById('restartButton');

  backBtn?.addEventListener('click', () => {
    stopGame();
    document.getElementById('startMenu').style.display = 'block';
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('canvas').classList.add('hidden');
  });

  restartBtn?.addEventListener('click', () => {
    stopGame();
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('canvas').classList.remove('hidden');
    document.querySelector('.sound-menu').style.display = 'none';
    init();

    if (musicEnabled && soundEnabled) backgroundMusic.play().catch(e => console.warn('Music not started:', e));
  });
}

// ---------------- Canvas Resizing ----------------
function resizeCanvasToFullscreen() {
  const canvas = document.getElementById('canvas');
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

window.addEventListener('resize', resizeCanvasToFullscreen);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvasToFullscreen, 300));

// ---------------- Mobile Controls ----------------
function showMobileControls() { document.getElementById('bottomPanel').classList.remove('hidden'); }
function hideMobileControls() { document.getElementById('bottomPanel').classList.add('hidden'); }
if (window.innerWidth <= 768) showMobileControls();

// ---------------- Orientation Warning ----------------
function handleOrientationWarning() {
  const warning = document.getElementById('orientationWarning');
  const isPortrait = window.innerHeight > window.innerWidth;
  if (window.innerWidth <= 400 && isPortrait) warning.classList.remove('hidden');
  else warning.classList.add('hidden');
}

window.addEventListener('resize', handleOrientationWarning);
window.addEventListener('orientationchange', () => setTimeout(handleOrientationWarning, 300));

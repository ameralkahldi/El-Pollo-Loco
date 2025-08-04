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
  document.getElementById('startMenu').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';
  document.getElementById('canvas').classList.remove('hidden');


  if (musicEnabled) {
    backgroundMusic.play().catch(e => console.warn('Music blockiert:', e));
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
  const soundIcon = document.getElementById('soundIcon');
  const soundMenu = document.querySelector('.sound-menu');
  const closeSoundMenu = document.querySelector('.sound-menu .close-icon');

  const soundSwitch = document.getElementById('sound-switch');
  const musicSwitch = document.getElementById('music-switch');
  const fullscreenSwitch = document.getElementById('fullscreen-switch');

  const backBtn = document.getElementById('backToMenuButton');
  const restartBtn = document.getElementById('restartButton');

  const pauseBtn = document.getElementById('pauseButton');

  if (pauseBtn) {
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

    // تشغيل أو إيقاف الموسيقى حسب الحالة
    if (musicEnabled) {
      backgroundMusic.play().catch(e => console.warn('Music not started:', e));
    } else {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    }
  });
}


  // ⛶ زر ملء الشاشة
  if (fullscreenSwitch) {
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

 
  if (backBtn && restartBtn) {
    backBtn.addEventListener('click', () => {
      stopGame();
      document.getElementById('startMenu').style.display = 'block';
      document.getElementById('gameOverScreen').classList.add('hidden');
      document.getElementById('canvas').classList.add('hidden');
     
    });

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
});
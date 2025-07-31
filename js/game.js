let canvas;
let world;
let keyboard = new Keyboard();

function init() {
  canvas = document.getElementById("canvas");
  world = new World(canvas, keyboard);
  console.log("My Character is: ", world.character);
}

function startGame() {
  document.getElementById('startMenu').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'block';
  document.getElementById('canvas').classList.remove('hidden');

  init(); // تبدأ اللعبة من جديد
}

function gameOver(won) {
  stopGame();  // أوقف اللعبة فور انتهاءها

  const screen = document.getElementById('gameOverScreen');
  const img = document.getElementById('gameOverImage');
  const canvas = document.getElementById('canvas');

  img.src = won
    ? './img/9_intro_outro_screens/game_over/game over!.png'
    : './img/9_intro_outro_screens/game_over/you lost.png';

  screen.classList.remove('hidden');
  canvas.classList.add('hidden'); // إخفاء الـ canvas
}

function stopGame() {
  if (world) {
    world.stop(); // إيقاف الحلقة الرسومية وكل الـ intervals
    world = null;
  }

  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
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
  const backBtn = document.getElementById('backToMenuButton');
  const restartBtn = document.getElementById('restartButton');

  if (!backBtn || !restartBtn) {
    console.error('أزرار نهاية اللعبة غير موجودة');
    return;
  }

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
    init(); // إعادة تشغيل اللعبة
  });
});

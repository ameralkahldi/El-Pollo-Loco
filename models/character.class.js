class Character extends MovableObject {
  y = 235;
  height = 200;
  width = 120;
  speed = 7;
  currentImage = 0;
  world;
  otherDirection = false;

  IMAGE_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGE_STANDING = "img/2_character_pepe/2_walk/W-21.png";

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGE_WALKING);
    this.imageCache[this.IMAGE_STANDING] = new Image();
    this.imageCache[this.IMAGE_STANDING].src = this.IMAGE_STANDING;
    this.world = world;
    this.animate();
  }

  animate() {
    // Bewegung
   let levelEnd = 2200;

setInterval(() => {
  if (this.world.keyboard.RIGHT && this.x < levelEnd) {
    this.x += this.speed;
    this.otherDirection = false;
  } else if (this.world.keyboard.LEFT && this.x >-100) {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  this.world.camera_x = -this.x + 100;

  // 🏁 Siegbedingung prüfen
  if (this.x >= levelEnd && !this.levelCompleted) {
    this.levelCompleted = true; // nur einmal zeigen
    this.world.showWinScreen();
  }
}, 2000 / 60);
 // 60 FPS

    // Animation (Bilderwechsel)
    setInterval(() => {
      if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
        let i = this.currentImage % this.IMAGE_WALKING.length;
        let path = this.IMAGE_WALKING[i];
        let img = this.imageCache[path];

        if (img) {
          this.img = img;
          this.currentImage++;
        } else {
          console.warn("Bild nicht geladen:", path);
        }
      } else {
        this.img = this.imageCache[this.IMAGE_STANDING];
      }
    }, 100);
  }
}

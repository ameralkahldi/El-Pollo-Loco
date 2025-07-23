class Character extends MovableObject {
  y = 150;
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

  constructor() {
    super().loadImage(this.IMAGE_WALKING[0]); // Startbild
    this.loadImages(this.IMAGE_WALKING); // Alle Bilder cachen
    this.applyGravity();
    
  }

  animate() {
    let levelEnd = 2200;

    // Bewegung
    setInterval(() => {
   
      if (this.world.keyboard.RIGHT && this.x < levelEnd) {
        this.x += this.speed;
        this.otherDirection = false;
      } else if (this.world.keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
      }

      if (this.x >= levelEnd && !this.levelCompleted) {
        this.levelCompleted = true;
        this.world.showWinScreen();
      }
    }, 1000 / 60);

    // Bildanimation (alle 50 ms)
    setInterval(() => {
      if (this.world?.keyboard.RIGHT || this.world?.keyboard.LEFT) {
        this.playWalkingAnimation(this.IMAGE_WALKING);
      }
    }, 50);
  }

  playWalkingAnimation() {
    let i = this.currentImage % this.IMAGE_WALKING.length;
    let path = this.IMAGE_WALKING[i];
    this.img = this.imageCache[path]; // Ändert sichtbares Bild
    this.currentImage++;
  }
}

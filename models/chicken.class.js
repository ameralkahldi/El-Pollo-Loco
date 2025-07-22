class Chicken extends MovableObject {
  y = 350;
  width = 80;
  height = 80;
  currentImage = 0;
  speed=0.15;

  IMAGE_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/4_w.png",
  ];

  constructor() {
    super().loadImage(this.IMAGE_WALKING[0]);
    this.loadImages(this.IMAGE_WALKING);

    this.x = 200 + Math.random() * 500; // Startposition zwischen 200–700
    this.speed = 0.15 + Math.random() * 0.5; // Zufällige Geschwindigkeit

    this.animate();
  }

  animate() {
    // 🐔 Bewegung nach links
    setInterval(() => {
      this.x -= this.speed;

      // Optional: Zurückspringen, wenn zu weit links
      if (this.x < -100) {
        this.x = 500 + Math.random() * 200; // Neue Position rechts
      }
    }, 1000 / 60); // 60 FPS Bewegung

    // 🖼️ Laufanimation
    setInterval(() => {
      let i = this.currentImage % this.IMAGE_WALKING.length;
      let path = this.IMAGE_WALKING[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 2000); // alle 120 ms neues Bild
  }
}




 
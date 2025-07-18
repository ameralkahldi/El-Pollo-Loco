class Chicken extends MovableObject {
  y = 350;
  width = 80;
  height = 80;
  speed = 0.15; // Speed for movement

  IMAGE_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
      "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
      "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
      "img/3_enemies_chicken/chicken_normal/1_walk/4_w.png",
      "img/3_enemies_chicken/chicken_normal/1_walk/5_w.png",
      "img/3_enemies_chicken/chicken_normal/1_walk/6_w.png"
    ];

  currentImage = 0;
  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGE_WALKING);
    this.x = 200 + Math.random() * 500; // Random x position
    this.speed = 0.15 + Math.random() * 0.5; // Random speed variation
     this.animate();


  }


 animate() {
  this.moveLeft();
    setInterval(() => {
  let i = this.currentImage % this.IMAGE_WALKING.length;
  let path = this.IMAGE_WALKING[i];
  this.img = this.imageCache[path];
  this.currentImage++;
}, 3000);}} // 100ms for smooth animation



 
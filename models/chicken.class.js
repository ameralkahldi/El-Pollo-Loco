class Chicken extends MovableObject {
  y = 350;
  width = 80;
  height = 80;
  currentImage = 0;
  speed=1;
   energy = 100;
  dead = false;

  IMAGE_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
  ];

  constructor() {
    super().loadImage(this.IMAGE_WALKING[0]);
    this.loadImages(this.IMAGE_WALKING);

    this.x = 200 + Math.random() * 500; // Startposition zwischen 200–700
    this.speed = 0.15 + Math.random() * 0.5; // Zufällige Geschwindigkeit
    this.animate();
  }

  animate() {
    
   setInterval(() => {
         this.moveLeft();
      }, 1000 / 60); // 60 FPS
    
    // Bewegung nach links
   
    //  Laufanimation
    setInterval(() => {
     this.playWalkingAnimation(this.IMAGE_WALKING);
    }, 200); // alle 120 ms neues Bild
  }
  
  playWalkingAnimation() {
    let i = this.currentImage % this.IMAGE_WALKING.length;
    let path = this.IMAGE_WALKING[i];
    this.img = this.imageCache[path]; // Ändert sichtbares Bild
    this.currentImage++;
  }
}




 
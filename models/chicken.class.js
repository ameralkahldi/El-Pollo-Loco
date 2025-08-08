class Chicken extends MovableObject {
  y = 350;
  width = 80;
  height = 80;
  currentImage = 0;
  speed = 1;
  energy = 100;
  dead = false;

  IMAGE_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
  ];

  IMAGE_DEAD = [
    "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
  ];

  constructor() {
    super().loadImage(this.IMAGE_WALKING[0]);
    this.loadImages(this.IMAGE_WALKING);
    this.loadImages(this.IMAGE_DEAD);

    this.x = 200 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.5;
    this.animate();
  }

  /**
   * Starts the animation loops for movement and walking animation.
   * Moves the chicken to the left if it is not dead.
   */
  animate() {
    setInterval(() => {
      if (!this.dead) this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      if (!this.dead) {
        this.playWalkingAnimation();
      }
    }, 200);
  }

  /**
   * Plays the walking animation by cycling through the walking images.
   */
  playWalkingAnimation() {
    let i = this.currentImage % this.IMAGE_WALKING.length;
    let path = this.IMAGE_WALKING[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Kills the chicken by stopping its movement, setting dead flag,
   * and changing the image to the dead chicken sprite.
   */
  kill() {
    this.dead = true;
    this.speed = 0;
    this.img = this.imageCache[this.IMAGE_DEAD[0]];
  }
}

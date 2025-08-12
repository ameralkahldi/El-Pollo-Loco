/**
 * Represents a large chicken enemy in the game.
 * Inherits from MovableObject.
 */
class Chicken extends MovableObject {
  /** Vertical position of the chicken */
  y = 350;

  /** Width of the chicken */
  width = 80;

  /** Height of the chicken */
  height = 80;

  /** Movement speed of the chicken */
  speed = 1;

  /** Energy level of the chicken */
  energy = 100;

  /** Indicates whether the chicken is dead */
  dead = false;

  /** Current image index used for animation */
  currentImage = 0;

  /** Interval for movement */
  moveInterval;

  /** Interval for animation */
  animationInterval;

  /** Walking animation image paths */
  IMAGE_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
  ];

  /** Image path for dead state */
  IMAGE_DEAD = [
    "img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
  ];

  /**
   * Creates a new instance of Chicken.
   * Loads images, applies gravity, and starts animation.
   * @param {number} x - The horizontal position of the chicken.
   */
  constructor(x) {
    super().loadImage(this.IMAGE_WALKING[0]);
    this.loadImages(this.IMAGE_WALKING);
    this.loadImages(this.IMAGE_DEAD);
    this.applyGravity();
    this.x = x; // Set initial x position
    this.speed = 0.4; // ثابت بدل عشوائي
    this.animate();
    this.offset = {
  top: 10,
  bottom: 10,
  left: 5,
  right: 5,
};
  }

  /**
   * Starts the movement and animation of the chicken.
   * If the chicken is not dead, it moves left and plays walking animation.
   */
  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.dead) this.moveLeft();
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (!this.dead) this.playWalkingAnimation(this.IMAGE_WALKING);
    }, 200);
  }

  /**
   * Cycles through the walking animation frames.
   * @param {string[]} images - Array of image paths to animate.
   */
  playWalkingAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Kills the chicken: stops its movement and switches to the dead image.
   */
  kill() {
    this.dead = true;
    this.speed = 0;
    this.img = this.imageCache[this.IMAGE_DEAD[0]];

    // Stop movement and animation intervals
    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
  }
}

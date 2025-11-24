/**
 * Represents a small chicken enemy in the game.
 * Inherits from MovableObject.
 */
class ChickenSmall extends MovableObject {
  /** Vertical position of the chicken */
  y = 370;

  /** Height of the chicken */
  height = 60;

  /** Width of the chicken */
  width = 60;

  /** Movement speed of the chicken */
  speed = 0.7;

  /** Indicates whether the chicken is dead */
  isDead = false;

  /** Current image index used for animation */
  currentImage = 0;

  /** Interval for movement */
  moveInterval;

  /** Interval for animation */
  animationInterval;

  /** Walking animation image paths */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /** Image path for dead state */
  IMAGE_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Creates a new instance of ChickenSmall.
   * Loads images, applies gravity, and starts animation.
   * @param {number} x - The horizontal position of the chicken.
   */
  constructor(x) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);
    this.applyGravity();
    this.animate();
    this.x = x;
    this.offset = {
      top: -100,
      bottom: 0,
      left: 30,
      right: -20,
    };
  }

  /**
   * Starts the movement and animation of the chicken.
   * If the chicken is not dead, it moves left and plays walking animation.
   */
  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.isDead) this.moveLeft();
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (!this.isDead) this.playWalkingAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  /**
   * Kills the chicken: stops its movement and switches to the dead image.
   */
  kill() {
    this.isDead = true;
    this.speed = 0;
    this.img = this.imageCache[this.IMAGE_DEAD[0]];

    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);
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
}

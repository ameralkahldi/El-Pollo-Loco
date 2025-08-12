class Character extends MovableObject {
  y = 150;
  height = 200;
  width = 120;
  currentImage = 0;
  world;
  otherDirection = false;
  energy = 100;
  bottles = 0;
  dead = false;
  jumpSound = new Audio("audio/audio_jump.wav");
  soundEnabled = true;
  volume = 1.0;

  IMAGE_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGEs_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGEs_DEAD = [   
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  IMAGEs_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];
  IMAGES_IDLE = [
    "./img/2_character_pepe/1_idle/idle/I-1.png",
    "./img/2_character_pepe/1_idle/idle/I-2.png",
    "./img/2_character_pepe/1_idle/idle/I-3.png",
    "./img/2_character_pepe/1_idle/idle/I-4.png",
    "./img/2_character_pepe/1_idle/idle/I-5.png",
    "./img/2_character_pepe/1_idle/idle/I-6.png",
    "./img/2_character_pepe/1_idle/idle/I-7.png",
    "./img/2_character_pepe/1_idle/idle/I-8.png",
    "./img/2_character_pepe/1_idle/idle/I-9.png",
    "./img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  IMAGES_LONG_IDLE = [
    "./img/2_character_pepe/1_idle/long_idle/I-11.png",
    "./img/2_character_pepe/1_idle/long_idle/I-12.png",
    "./img/2_character_pepe/1_idle/long_idle/I-13.png",
    "./img/2_character_pepe/1_idle/long_idle/I-14.png",
    "./img/2_character_pepe/1_idle/long_idle/I-15.png",
    "./img/2_character_pepe/1_idle/long_idle/I-16.png",
    "./img/2_character_pepe/1_idle/long_idle/I-17.png",
    "./img/2_character_pepe/1_idle/long_idle/I-18.png",
    "./img/2_character_pepe/1_idle/long_idle/I-19.png",
    "./img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  constructor() {
    super();
    this.speed= 3;

    this.loadImage(this.IMAGE_WALKING[0]);
    this.loadImages(this.IMAGE_WALKING);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGEs_JUMPING);
    this.loadImages(this.IMAGEs_DEAD);
    this.loadImages(this.IMAGEs_HURT);
    this.applyGravity();
    this.animate();
     this.bottleCount = 0;
  this.coinsCount=0;
  }

  /**
   * Handles the animation logic of the character including movement and image switching.
   */
  animate() {
    let levelEnd = 2200;

    // Movement animation
    setInterval(() => {
      if (gameIsPaused) return;
      if (this.world.keyboard.RIGHT && this.x < levelEnd) this.moveRight();
      if (this.world.keyboard.LEFT && this.x > 0) this.moveLeft();
      if (this.world.keyboard.SPACE && !this.isAboveGround()) this.jump();
    }, 1000 / 60);

    // Sprite animation
    setInterval(() => {
      if (this.isDead()) {
        this.playWalkingAnimation(this.IMAGEs_DEAD);
      } else if (this.isHurt()) {
        this.playWalkingAnimation(this.IMAGEs_HURT);
      } else if (this.isAboveGround()) {
        this.playWalkingAnimation(this.IMAGEs_JUMPING);
      } else if (this.world?.keyboard.RIGHT || this.world?.keyboard.LEFT) {
        this.playWalkingAnimation(this.IMAGE_WALKING);
      } else if (this.startLongIdle()) {
        this.playWalkingAnimation(this.IMAGES_LONG_IDLE);
      } else if (this.speedY == 0 && !this.isAboveGround()) {
        this.playWalkingAnimation(this.IMAGES_IDLE);
      }
    }, 120);
  }

  /**
   * Updates the character image to the next frame in the provided animation sequence.
   * @param {string[]} images - Array of image paths for animation.
   */
  playWalkingAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Handles overall character movement (left, right, jump) and camera update.
   */
  moveCharacter() {
    this.walking_sound.pause();
    if (!gameIsPaused) {
      if (this.canMoveRight()) this.characterMovesRight();
      if (this.canMoveLeft()) this.characterMovesLeft();
      if (this.canJump()) this.jump();
      this.world.camera_x = -this.x + 100;
    }
    this.lastPressedKey();
  }

  /**
   * Checks if character is jumping above an enemy.
   * @param {MovableObject} enemy - The enemy to check collision with.
   * @returns {boolean} Whether character is above the enemy.
   */
  isAbove(enemy) {
    return (
      this.speedY < 0 && this.y + this.height <= enemy.y + enemy.height / 2
    );
  }

  /**
   * Moves the character to the right and plays walking sound.
   */
  characterMovesRight() {
    this.moveRight();
    this.otherDirection = false;
    this.walking_sound.play();
  }

  /**
   * Moves the character to the left and plays walking sound.
   */
  characterMovesLeft() {
    this.moveLeft();
    this.otherDirection = true;
    this.walking_sound.play();
  }

  /**
   * Checks if character can move to the right based on position and key press.
   * @returns {boolean}
   */
  canMoveRight() {
    return this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x;
  }

  /**
   * Checks if character can move to the left based on position and key press.
   * @returns {boolean}
   */
  canMoveLeft() {
    return this.world.keyboard.LEFT && this.x > 0;
  }

  
/**
 * Determines if the character can currently be hit.
 * @returns {boolean}
 */
canBeHit() {
  return !this.dead;
}



  /**
   * Checks if character can jump based on space key and current position.
   * @returns {boolean}
   */
  canJump() {
    return this.world.keyboard.SPACE && !this.isAboveGround();
  }

  /**
   * Makes the character jump and plays the jump sound effect.
   */
  jump() {
    this.speedY = 30;
    this.jumpSound.currentTime = 0;
    this.jumpSound.play();
  }

  /**
   * Determines whether the character should enter long idle animation
   * based on time since last key press.
   * @returns {boolean}
   */
  startLongIdle() {
    let timepassed = new Date().getTime() - this.lastKeyPressed;
    timepassed = timepassed / 1000;
    return timepassed > 8;
  }

  /**
   * Stores the current time as the last key press time.
   */
  lastPressedKey() {
    if (this.keyIsPressed()) {
      this.lastKeyPressed = new Date().getTime();
    }
  }
  

  /**
   * Checks if any movement or action keys are currently pressed.
   * @returns {boolean}
   */
  keyIsPressed() {
    return (
      keyboard.LEFT ||
      keyboard.RIGHT ||
      keyboard.UP ||
      keyboard.DOWN ||
      keyboard.SPACE ||
      keyboard.D
    );
  }
}
class Character extends MovableObject {
  isInvincible = false;
  y = 150;
  height = 200;
  width = 120;
  currentImage = 0;
  world;
  otherDirection = false;
  energy = 100;
  bottles = 0;
  dead = false;
  soundEnabled = true;
  volume = 1.0;
  lastKeyPressed = new Date().getTime();
  jumpSound = new Audio("audio/audio_jump.wav");

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
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  constructor(audioManager) {
    super();
    this.speed = 3;
    this.audioManager = audioManager;

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
    this.coinsCount = 0;
    this.offset = {
      top: 40,
      bottom: 30,
      left: 20,
      right: 10,
    };
  }

  /**
   * Handles the animation logic of the character including movement and image switching.
   * This method sets up two intervals:
   * 1. Movement handling at 60 FPS.
   * 2. Animation frame switching at ~8 FPS.
   */
  animate() {
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => {
      if (this.isDead()) return this.playWalkingAnimation(this.IMAGEs_DEAD);
      if (this.isHurt()) return this.playWalkingAnimation(this.IMAGEs_HURT);
      if (this.isAboveGround())
        return this.playWalkingAnimation(this.IMAGEs_JUMPING);
      if (this.world?.keyboard.RIGHT || this.world?.keyboard.LEFT)
        return this.playWalkingAnimation(this.IMAGE_WALKING);
      if (this.startLongIdle())
        return this.playWalkingAnimation(this.IMAGES_LONG_IDLE);
      return this.playWalkingAnimation(this.IMAGES_IDLE);
    }, 120);
  }

  /**
   * Handles character movement based on keyboard input.
   * Moves the character left, right, or makes it jump if conditions are met.
   * Also updates the last key press timestamp to track idle state.
   *
   * @returns {void}
   */
  handleMovement() {
    if (gameIsPaused) return;
    if (this.world.keyboard.RIGHT && this.x < 2200) this.moveRight();
    if (this.world.keyboard.LEFT && this.x > 0) this.moveLeft();
    if (this.world.keyboard.SPACE && !this.isAboveGround()) this.jump();
    this.lastPressedKey();
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
   * Determines whether the character should enter long idle animation
   * based on time since last key press.
   * @returns {boolean}
   */
  startLongIdle() {
    let timepassed = new Date().getTime() - this.lastKeyPressed;
    timepassed = timepassed / 1000;
    return timepassed > 2;
  }

  /**
   * Updates the timestamp of the last key press.
   *
   * If a key is currently pressed (as determined by `this.keyIsPressed()`),
   * this method records the current time in milliseconds since the Unix epoch
   * in `this.lastKeyPressed`.
   *
   * @method lastPressedKey
   * @returns {void}
   */
  lastPressedKey() {
    if (this.keyIsPressed()) {
      this.lastKeyPressed = new Date().getTime();
    }
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
    if (this.audioManager) {
      this.audioManager.playSound("jumpSound");
    } else {
      console.warn("AudioManager is not defined!");
    }
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
      this.world.keyboard.LEFT ||
      this.world.keyboard.RIGHT ||
      this.world.keyboard.UP ||
      this.world.keyboard.DOWN ||
      this.world.keyboard.SPACE ||
      this.world.keyboard.D
    );
  }

  /**
   * Applies a knockback effect to the character by shifting its x-position.
   *
   * Knockback rules:
   * - If an end boss exists and is positioned to the left of this entity, the entity is pushed to the right.
   * - Additionally, the entity is pushed in the direction opposite of `otherDirection`:
   *    - If `otherDirection` is true, push right.
   *    - Otherwise, push left.
   *
   * @method knockBack
   * @returns {void}
   */
  knockBack() {
    if (this.world?.endBoss && this.world.endBoss.x < this.x) {
      this.x += 20;
    }
    if (this.otherDirection) {
      this.x += 20;
    } else {
      this.x -= 20;
    }
  }

  /**
   * Character takes damage and plays hurt sound
   */
  hit(damage = 20) {
    if (this.dead || this.isInvincible) return;

    this.energy -= damage;
    if (this.energy < 0) this.energy = 0;
    if (this.audioManager) {
      this.audioManager.playSound("pepeHit");
    }
    this.knockBack();
    this.isInvincible = true;
    setTimeout(() => {
      this.isInvincible = false;
    }, 700);

    if (this.energy === 0) {
      this.die();
    }
  }

  /**
   * Plays death animation, then triggers Game Over screen.
   */
  die() {
    if (this.dead) return;
    this.dead = true;
    this.speed = 0;
    let i = 0;
    const deathInterval = setInterval(() => {
      if (i < this.IMAGEs_DEAD.length) {
        let path = this.IMAGEs_DEAD[i];
        this.img = this.imageCache[path];
        i++;
      } else {
        clearInterval(deathInterval);
        setTimeout(() => {
          gameOver(false);
        }, 500);
      }
    }, 150);
  }
}

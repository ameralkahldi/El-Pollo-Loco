class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;


  soundEnabled = true; // Controls sound on/off for the object
  volume = 1.0;        // Volume level (0 to 1)

  lastHit = 0;
  offset = { top: 0, left: 10, right: 30, bottom: 0 };

  /**
   * Applies gravity to the object by updating its vertical position and speed.
   * Runs continuously with setInterval.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Returns the character properly to the ground if partially above it.
   * Used to reset character's vertical position after jumping.
   */
  returnCharToGroundProperly() {
    if (this instanceof Character) {
      this.speedY = 0;
      this.y = 230;
    }
  }

  /**
   * Checks if the object is above the ground.
   * @returns {boolean} True if the object is above ground or is a ThrowableObject.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 230;
    }
  }

  /**
   * Loads an image for this object from the given path.
   * @param {string} path - Path to the image file.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Loads multiple images into the object's image cache.
   * @param {string[]} arr - Array of image paths.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Checks if this object is colliding with another movable object.
   * @param {MovableObject} mo - Another movable object to check collision against.
   * @returns {boolean} True if the two objects are colliding.
   */
isColliding(mo) {
  const a = this.offset || { top: 0, bottom: 0, left: 0, right: 0 };
  const b = mo.offset || { top: 0, bottom: 0, left: 0, right: 0 };

  return (
    this.x + this.width - a.right > mo.x + b.left &&
    this.y + this.height - a.bottom > mo.y + b.top &&
    this.x + a.left < mo.x + mo.width - b.right &&
    this.y + a.top < mo.y + mo.height - b.bottom
  );
}


  /**
   * Checks if the object is currently falling (vertical speed < 0).
   * @returns {boolean} True if the object is falling.
   */
  isFalling() {
    return this.speedY < 0;
  }

  /**
   * Checks if the object was hit within the last second.
   * @returns {boolean} True if the object is still considered hurt.
   */
  isHurt() {
    let timepassed = (new Date().getTime() - this.lastHit) / 1000;
    return timepassed < 1;
  }

  /**
   * Applies a hit to the object, reducing energy and triggering hurt state.
   * Special handling for Endboss objects.
   */
  hit() {
    if (this instanceof Endboss) {
      if (this.energy < 0) {
        this.energy = 0;
      } else {
        this.lastHit = new Date().getTime();
      }
    } else {
      this.energy -= 5;
      if (this.energy < 0) {
        this.energy = 0;
      } else {
        this.lastHit = new Date().getTime();
        this.playHurtSound();
      }
    }
  }

  // ===================== Sound =====================

  /**
   * Plays the hurt sound if sound is enabled.
   */
  playHurtSound() {
    if (this.hurtSound && this.soundEnabled) {
      this.hurtSound.volume = this.volume;
      this.hurtSound.currentTime = 0;
      this.hurtSound.play().catch(e => console.warn("Cannot play hurt sound:", e));
    }
  }

  /**
   * Enables or disables sound for this object.
   * @param {boolean} enabled - True to enable sound, false to disable.
   */
  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    if (!enabled) this.hurtSound.pause();
  }

  /**
   * Sets the volume level for the object's sounds.
   * Clamps the volume between 0 and 1.
   * @param {number} vol - Volume level (0 to 1).
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.hurtSound) this.hurtSound.volume = this.volume;
  }

  /**
   * Checks if the object is dead (energy is zero).
   * @returns {boolean} True if dead.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Moves the object to the right by its speed.
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves the object to the left by its speed.
   */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  /**
   * Makes the object jump with a strong vertical speed.
   */
  jump() {
    this.speedY = 20;
  }

  /**
   * Makes the object jump with a smaller vertical speed.
   */
  smallJump() {
    this.speedY = 10;
  }
}

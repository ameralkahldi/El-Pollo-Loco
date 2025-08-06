class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  hurtSound = new Audio("audio/audio_pepe_hurt1.mp3");

  soundEnabled = true; // التحكم في الصوت لكل كائن
  volume = 1.0;       // مستوى الصوت (0 إلى 1)

  lastHit = 0;
  offset = { top: 0, left: 0, right: 0, bottom: 0 };

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

  returnCharToGroundProperly() {
    if (this instanceof Character) {
      this.speedY = 0;
      this.y = 230;
    }
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 230;
    }
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x &&
      this.y < mo.y + mo.height
    );
  }

  isFalling() {
    return this.speedY < 0;
  }

  isHurt() {
    let timepassed = (new Date().getTime() - this.lastHit) / 1000;
    return timepassed < 1;
  }

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
  playHurtSound() {
    if (this.hurtSound && this.soundEnabled) {
      this.hurtSound.volume = this.volume;
      this.hurtSound.currentTime = 0;
      this.hurtSound.play().catch(e => console.warn("Cannot play hurt sound:", e));
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    if (!enabled) this.hurtSound.pause();
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol)); // تقييد القيمة بين 0 و 1
    if (this.hurtSound) this.hurtSound.volume = this.volume;
  }

  isDead() {
    return this.energy == 0;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  jump() {
    this.speedY = 20;
  }

  smallJump() {
    this.speedY = 10;
  }
}

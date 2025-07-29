class MovableObject extends DrawableObject {
  speed = 0.15; // Default speed for movement
  otherDirection = false; // Default direction for movement
  speedY = 0;
  acceleration = 2.5;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }


  /**This function sets the character to the ground on the right coordinate of the Y axis, when needed. */
    returnCharToGroundProperly() {
        if (this instanceof Character) {
            this.speedY = 0;
            this.y = 230;
        }
    }



  isAboveGround() {
    if (this instanceof ThrowableObject) { //
      return true;
    } else {
    return this.y < 230;
  }}

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


 /**This function is used to check if the character is falling. */
    isFalling() {
        return this.speedY < 0;
    }



  isHurt(){
    let timepassed = new Date().getTime() - this.lastHit ;
    timepassed = timepassed /1000;
    return timepassed < 1; // tut

  }

  hit() {
        if (this instanceof Endboss) {
            if (this.energy < 0) 
                this.energy = 0;
             else 
                this.lastHit = new Date().getTime();
        } else {
            this.energy -= 5;
            if (this.energy < 0) 
                this.energy = 0;
             else 
                this.lastHit = new Date().getTime();
        }
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

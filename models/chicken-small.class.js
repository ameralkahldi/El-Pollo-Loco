class ChickenSmall extends MovableObject {
    y = 380;
    height = 40;
    width = 70;
    speed = 0.8;
    isDead = false;

    IMAGES_WALKING = [
        './img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        './img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        './img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
    super(); // nur super, kein Funktionsaufruf!
    this.loadImage(this.IMAGES_WALKING[0]); // ✅ richtig
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD);
    this.x = 300 + Math.random() * 800;
    this.speed = 0.65 + Math.random() * 0.45;
    this.applyGravity();
    this.animate();
}
    
    

   animate() {
  this.moveInterval = setInterval(() => {
    if (!this.isDead) this.moveLeft();
  }, 1000 / 60);

  this.animationInterval = setInterval(() => {
    if (!this.isDead) this.playWalkingAnimation(this.IMAGES_WALKING);
  }, 200);
}

    /**
     * Kills the chicken: stops movement and changes image
     */
    kill() {
        this.isDead = true;
        this.speed = 0;
        this.img = this.imageCache[this.IMAGE_DEAD[0]];

        // Stop animation
        clearInterval(this.moveInterval);
        clearInterval(this.walkAnimationInterval);
    }


    playWalkingAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
}

}

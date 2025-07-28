class ChickenSmall extends MovableObject {
    y = 370;
    height = 60;
    width = 60;
    speed = 0.7;
    isDead = false;
    currentImage = 0;


    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD = [
        'img/3_enemies_chicken/chicken_small/2_dead/dead.png'
    ];

    constructor() {
  // nur super, kein Funktionsaufruf!
    super().loadImage(this.IMAGES_WALKING[0]); // ✅ richtig
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGE_DEAD) ;
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

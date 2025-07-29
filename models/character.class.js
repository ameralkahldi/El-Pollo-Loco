class Character extends MovableObject {
  y = 150;
  height = 200;
  width = 120;
  speed = 7;
  currentImage = 0;
  world;
  otherDirection = false;
  energy =100;
   bottles = 0;
   collectedCoins = 1;
 collbottles = 1;


 
 offset = {
    top: 100,
    bottom: 10,
    left: 20,
    right: 22
  }

  IMAGES_IDLE = [
    './img/2_character_pepe/1_idle/idle/I-1.png',
    './img/2_character_pepe/1_idle/idle/I-2.png',
    './img/2_character_pepe/1_idle/idle/I-3.png',
    './img/2_character_pepe/1_idle/idle/I-4.png',
    './img/2_character_pepe/1_idle/idle/I-5.png',
    './img/2_character_pepe/1_idle/idle/I-6.png',
    './img/2_character_pepe/1_idle/idle/I-7.png',
    './img/2_character_pepe/1_idle/idle/I-8.png',
    './img/2_character_pepe/1_idle/idle/I-9.png',
    './img/2_character_pepe/1_idle/idle/I-10.png'
  ];

    IMAGES_LONG_IDLE = [
    './img/2_character_pepe/1_idle/long_idle/I-11.png',
    './img/2_character_pepe/1_idle/long_idle/I-12.png',
    './img/2_character_pepe/1_idle/long_idle/I-13.png',
    './img/2_character_pepe/1_idle/long_idle/I-14.png',
    './img/2_character_pepe/1_idle/long_idle/I-15.png',
    './img/2_character_pepe/1_idle/long_idle/I-16.png',
    './img/2_character_pepe/1_idle/long_idle/I-17.png',
    './img/2_character_pepe/1_idle/long_idle/I-18.png',
    './img/2_character_pepe/1_idle/long_idle/I-19.png',
    './img/2_character_pepe/1_idle/long_idle/I-20.png'
  ]


  IMAGE_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGEs_JUMPING =[
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png"

  ];

 IMAGEs_DEAD = [
   "img/2_character_pepe/5_dead/D-51.png",
   "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
   "img/2_character_pepe/5_dead/D-54.png",
   "img/2_character_pepe/5_dead/D-55.png",
   "img/2_character_pepe/5_dead/D-56.png",
   "img/2_character_pepe/5_dead/D-57.png" 
 ];

 IMAGEs_HURT =[
      "img/2_character_pepe/4_hurt/H-41.png",
      "img/2_character_pepe/4_hurt/H-42.png",
      "img/2_character_pepe/4_hurt/H-43.png"

 ];



 constructor() {
  super(); // ✔️ Korrekt

  this.loadImage(this.IMAGE_WALKING[0]); // ✔️ Jetzt auf das eigene Objekt
  this.loadImages(this.IMAGE_WALKING);
  this.loadImages(this.IMAGEs_JUMPING);
  this.loadImages(this.IMAGEs_DEAD);
  this.loadImages(this.IMAGEs_HURT);
  this.loadImages(this.IMAGES_IDLE);
  this.loadImages(this.IMAGES_LONG_IDLE);

  this.applyGravity();
  this.animate();
}


  animate() {
    let levelEnd = 2200;

    // Bewegung
    setInterval(() => {
   
      if (this.world.keyboard.RIGHT && this.x < levelEnd) {
       this.moveRight();
      } 
       if (this.world.keyboard.LEFT && this.x > 0) {
       this.moveLeft();
      }

      if(this.world.keyboard.SPACE && !this.isAboveGround()){
         this.jump();
      }
    }, 1000 / 60);



    // Bildanimation (alle 50 ms)
setInterval(() => {
  if (this.isDead()) {
    this.playWalkingAnimation(this.IMAGEs_DEAD);
  }
  else if(this.isHurt()){
    this.playWalkingAnimation(this.IMAGEs_HURT);

  } 
  else if (this.isAboveGround()) {
    this.playWalkingAnimation(this.IMAGEs_JUMPING);
  }
   else if (this.world?.keyboard.RIGHT || this.world?.keyboard.LEFT) {
    this.playWalkingAnimation(this.IMAGE_WALKING);
  }
  }, 50);}


 playWalkingAnimation(images) {
    let i = this.currentImage % images.length;
  let path = images[i];
  this.img = this.imageCache[path];
  this.currentImage++;
}

  }

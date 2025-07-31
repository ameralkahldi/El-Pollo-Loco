class Endboss extends MovableObject {
  IMAGE_WALKING = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGE_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGE_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super();
    this.loadImage(this.IMAGE_WALKING[0]);
    this.loadImages(this.IMAGE_WALKING);
    this.loadImages(this.IMAGE_HURT);
    this.loadImages(this.IMAGE_DEAD);

    this.x = 2000;
    this.y = -35;
    this.width = 300;
    this.height = 500;

    this.currentImage = 0;
    this.currentHurtImage = 0;
    this.currentDeadImage = 0;

    this.energy = 100;
    this.dead = false;
    this.speed = 0;
    this.isHurt = false;

    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.dead) {
        this.playDeadAnimation();
      } else if (this.isHurt) {
        this.playHurtAnimation();
      } else {
        this.playWalkingAnimation();
      }
    }, 200);
  }

  playWalkingAnimation() {
    let i = this.currentImage % this.IMAGE_WALKING.length;
    let path = this.IMAGE_WALKING[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  playHurtAnimation() {
    let i = this.currentHurtImage % this.IMAGE_HURT.length;
    let path = this.IMAGE_HURT[i];
    this.img = this.imageCache[path];
    this.currentHurtImage++;

    if (this.currentHurtImage >= this.IMAGE_HURT.length) {
      this.isHurt = false;
      this.currentHurtImage = 0;
      this.currentImage = 0;
    }
  }

  playDeadAnimation() {
    let i = this.currentDeadImage % this.IMAGE_DEAD.length;
    let path = this.IMAGE_DEAD[i];
    this.img = this.imageCache[path];
    this.currentDeadImage++;

    // Sobald Animation zu Ende ist, kein weiteres Zählen
    if (this.currentDeadImage >= this.IMAGE_DEAD.length) {
      this.currentDeadImage = this.IMAGE_DEAD.length - 1; // bleib auf letztem Frame
    }
  }
}

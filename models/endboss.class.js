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

  IMAGE_ATTACK = [  // صور الهجوم التي طلبتها
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
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
    this.loadImages(this.IMAGE_ATTACK);  // تحميل صور الهجوم
    this.loadImages(this.IMAGE_HURT);
    this.loadImages(this.IMAGE_DEAD);

    this.x = 2000;
    this.y = -35;
    this.width = 300;
    this.height = 500;

    this.currentImage = 0;
    this.currentAttackImage = 0;
    this.currentHurtImage = 0;
    this.currentDeadImage = 0;

    this.energy = 100;
    this.dead = false;
    this.speed = 0;
    this.isHurt = false;
    this.isAttacking = false;  // حالة الهجوم

    this.otherDirection = false; // لوجهة الحركة

    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.dead) {
        this.playDeadAnimation();
      } else if (this.isHurt) {
        this.playHurtAnimation();
      } else if (this.isAttacking) {
        this.playAttackAnimation();
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

  playAttackAnimation() {
    let i = this.currentAttackImage % this.IMAGE_ATTACK.length;
    let path = this.IMAGE_ATTACK[i];
    this.img = this.imageCache[path];
    this.currentAttackImage++;

    // لو انتهت الصور نرجع للحالة الطبيعية أو الهجوم مستمر حسب منطق اللعبة
    if (this.currentAttackImage >= this.IMAGE_ATTACK.length) {
      this.currentAttackImage = 0;
      // ممكن تبطل الهجوم بعد دورة وحدة مثلاً
      // this.isAttacking = false;
    }
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

    if (this.currentDeadImage >= this.IMAGE_DEAD.length) {
      this.currentDeadImage = this.IMAGE_DEAD.length - 1;
    }
  }

  // دالة تحريك الـ endboss نحو الـ character
  moveTowards(character) {
    if (this.dead) return;

    if (this.x > character.x) {
      this.x -= this.speed;
      this.otherDirection = true; // يتجه لليسار
    } else if (this.x < character.x) {
      this.x += this.speed;
      this.otherDirection = false; // يتجه لليمين
    }
  }
}

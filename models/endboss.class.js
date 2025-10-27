/**
 * Represents the final boss in the game.
 * Inherits movement and drawing capabilities from MovableObject.
 */
class Endboss extends MovableObject {
  /** @type {string[]} */
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

  /** @type {string[]} */
  IMAGE_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /** @type {string[]} */
  IMAGE_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /** @type {string[]} */
  IMAGE_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Creates a new Endboss instance.
   * @param {MovableObject} character - The player character the boss will move towards.
   */
  constructor(character) {
    super();
    this.character = character;

    this.loadImage(this.IMAGE_WALKING[0]);
    this.loadImages(this.IMAGE_WALKING);
    this.loadImages(this.IMAGE_ATTACK);
    this.loadImages(this.IMAGE_HURT);
    this.loadImages(this.IMAGE_DEAD);

    /** @type {number} */
    this.x = 2000;

    /** @type {number} */
    this.y = -35;

    /** @type {number} */
    this.width = 300;

    /** @type {number} */
    this.height = 500;

    /** @type {number} */
    this.energy = 100;

    /** @type {boolean} */
    this.dead = false;

    /** @type {number} */
    this.speed = 0;

    /** @type {boolean} */
    this.isHurt = false;

    /** @type {boolean} */
    this.isAttacking = false;

    /** @type {boolean} */
    this.otherDirection = false;

    /** @type {number} */
    this.currentImage = 0;
    this.currentAttackImage = 0;
    this.currentHurtImage = 0;
    this.currentDeadImage = 0;

    this.animate();

    this.offset = {
      top: 100,
      bottom: 0,
      left: 50,
      right: 50,
    };
  }

  /**
   * Starts the animation and movement logic for the endboss.
   */
  animate() {
    setInterval(() => {
      if (!this.dead) {
        this.moveTowards(this.character);
      }

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

  /**
   * Moves the endboss towards the specified character horizontally.
   * @param {{ x: number }} character - The character object with an `x` property.
   */
  moveTowards(character) {
    if (this.dead || !character) return;

    if (this.x > character.x) {
      this.x -= this.speed;
      this.otherDirection = true;
    } else if (this.x < character.x) {
      this.x += this.speed;
      this.otherDirection = false;
    }
  }

  /**
   * Plays the walking animation by cycling through images.
   */
  playWalkingAnimation() {
    let i = this.currentImage % this.IMAGE_WALKING.length;
    let path = this.IMAGE_WALKING[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Plays the attack animation. Resets when animation finishes.
   */
  playAttackAnimation() {
    let i = this.currentAttackImage % this.IMAGE_ATTACK.length;
    let path = this.IMAGE_ATTACK[i];
    this.img = this.imageCache[path];
    this.currentAttackImage++;

    if (this.currentAttackImage >= this.IMAGE_ATTACK.length) {
      this.currentAttackImage = 0;
    }
  }

  /**
   * Plays the hurt animation. Resets hurt state when finished.
   */
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

  /**
   * Plays the dead animation and stops on the last frame.
   */
  playDeadAnimation() {
    if (this.deadAnimationPlayed) return; 
    this.deadAnimationPlayed = true; 
    let i = 0;
    const deadAnimation = setInterval(() => {
      if (i < this.IMAGE_DEAD.length) {
        let path = this.IMAGE_DEAD[i];
        this.img = this.imageCache[path];
        i++;
      } else {
        clearInterval(deadAnimation); 
      }
    }, 300); 
  }

  die() {
    this.dead = true;
    this.isAttacking = false;
    this.isHurt = false;
    this.speed = 0;

    this.playDeadAnimation();
    setTimeout(() => {
      gameOver(true);
    }, this.IMAGE_DEAD.length * 300 + 500); 
  }
}

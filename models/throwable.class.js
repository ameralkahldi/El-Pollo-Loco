class ThrowableObject extends MovableObject {
  /**
   * Creates a new throwable object (e.g. a salsa bottle).
   * @param {number} x - The starting x-position of the object.
   * @param {number} y - The starting y-position of the object.
   */
  constructor(x, y) {
    super().loadImage('img/6_salsa_bottle/salsa_bottle.png');
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.hit = false;

    /** @type {boolean} Whether the hit effect should be shown */
    this.showHitEffect = false;

    /** @type {number|null} Timestamp when the hit effect started */
    this.hitEffectStart = null;

    /** @type {number} Duration for how long the hit effect should be displayed (ms) */
    this.hitEffectDuration = 500;

    /** @type {HTMLImageElement} The image used for the hit effect */
    this.hitEffectImg = new Image();
    this.hitEffectImg.src = 'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png';
      
      
    
    this.throw();
  }

  /**
   * Applies gravity and moves the bottle to the right in an arc.
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.moveInterval = setInterval(() => {
      this.x += 25;
    }, 50);
  }

  /**
   * Triggers the visual effect of a bottle hit.
   */
  hitEffect() {
    this.showHitEffect = true;
    this.hitEffectStart = Date.now();
  }

  /**
   * Draws the hit effect image at the bottle's location for a short duration.
   * @param {CanvasRenderingContext2D} ctx - The canvas 2D rendering context.
   */
  drawHitEffect(ctx) {
    if (this.showHitEffect) {
      ctx.drawImage(this.hitEffectImg, this.x - 20, this.y - 20, 80, 80);

      if (Date.now() - this.hitEffectStart > this.hitEffectDuration) {
        this.showHitEffect = false;
      }
    }
  }

  /**
   * Stops the horizontal movement of the bottle.
   */
  stop() {
    clearInterval(this.moveInterval);
  }
}

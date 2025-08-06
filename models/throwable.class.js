class ThrowableObject extends MovableObject { 
  constructor(x, y) {
    super().loadImage('img/6_salsa_bottle/bottle_rotation/rotation_sequences.gif');
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.hit = false;

    // تأثير الاصطدام
    this.showHitEffect = false;
    this.hitEffectStart = null;
    this.hitEffectDuration = 500;
    this.hitEffectImg = new Image();
    this.hitEffectImg.src = 'img/6_salsa_bottle/all_sequences.gif';

    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.moveInterval = setInterval(() => {
      this.x += 25;
    }, 50);
  }

  
  hitEffect() {
    this.showHitEffect = true;
    this.hitEffectStart = Date.now();
  }

  drawHitEffect(ctx) {
    if (this.showHitEffect) {
      ctx.drawImage(this.hitEffectImg, this.x - 20, this.y - 20, 80, 80);

      if (Date.now() - this.hitEffectStart > this.hitEffectDuration) {
        this.showHitEffect = false;
      }
    }
  }

  stop() {
    clearInterval(this.moveInterval);
  }
}

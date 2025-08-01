class ThrowableObject extends MovableObject {
  constructor(x, y) {
    super().loadImage('img/6_salsa_bottle/bottle_rotation/rotation_sequences.gif');
    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.hit = false;

    // ✅ خصائص التأثير
    this.showHitEffect = false;
    this.hitEffectStart = null;
    this.hitEffectDuration = 500;

    this.throw();
  }

  throw() {
    this.speedY = 30;
    this.applyGravity();
    this.moveInterval = setInterval(() => {
      this.x += 25;
    }, 50);
  }

  // ✅ رسم تأثير الانفجار
  drawHitEffect(ctx) {
    if (this.showHitEffect) {
      const img = new Image();
      img.src = 'img/6_salsa_bottle/all_sequences.gif';
      ctx.drawImage(img, this.x - 20, this.y - 20, 80, 80);

      if (Date.now() - this.hitEffectStart > this.hitEffectDuration) {
        this.showHitEffect = false;
      }
    }
  }

  // 🧹 إيقاف الحركة عند الاصطدام
  stop() {
    clearInterval(this.moveInterval);
  }
}

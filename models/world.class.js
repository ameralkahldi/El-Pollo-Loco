class World {
  character = new Character();
  level = createLevel1();
  statusBar = new StatusBar();
  coinsStatusBar = new CoinsStatusBar();
  bottleStatusBar = new BottlesStatusBar();
  endbossStatusBar = new EndbossStatus();
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  throwableObjects = [];
  gameIsOver = false;
  animationFrameId;
  intervalIds = [];
  collectedCoins = [];
  muted = false;
  chickenDeathSound = new Audio("audio/audio_chicken_death.mp3");
  chickenBossMoveSound = new Audio("audio/audio_chickenBoss.wav");
  coinCollectSound = new Audio("audio/audio_coin_collect.wav");
  bottleCollectSound = new Audio("audio/audio_landing.wav");

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();

    this.statusBar.setPercentage(this.character.energy);

    this.checkCollisions();
    this.checkThrowObject();
    this.checkBottleCollisions();
    this.checkBottleHitsEndboss();
    this.checkCharacterDead();
    this.checkBottleHitsEnemies();
    this.checkCoinCollection();
    this.draw();
  }

   playSound(audio) {
    if (!audio || this.muted) return; // إذا مكتوم الصوت، لا تعمل
    let sound = audio.cloneNode(); // نسخة جديدة لتجنب التعارض
    sound.play();
  }

  toggleMute() {
    this.muted = !this.muted;
    console.log(`Sound is now ${this.muted ? "OFF" : "ON"}`);
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
    this.endBoss = this.level.endboss[0];
  }

  checkThrowObject() {
    this.intervalIds.push(
      setInterval(() => {
        if (this.keyboard.D) {
          if (this.character.bottleCount > 0) {
            let bottle = new ThrowableObject(this.character.x, this.character.y + 100);
            bottle.hit = false;
            this.throwableObjects.push(bottle);

            this.character.bottleCount -= 1;

            let percentage = this.character.bottleCount * 20;
            this.bottleStatusBar.setPercentage(percentage);

            this.playSound(this.bottleCollectSound);
            console.log('Bottles after throw:', this.character.bottleCount);
          }
        }
      }, 200)
    );
  }

  checkCollisions() {
    this.intervalIds.push(
      setInterval(() => {
        this.checkEnemyCollisions();
        this.checkEndbossCollision();
      }, 100)
    );
  }

  checkEnemyCollisions() {
    this.level.enemises.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (this.character.isAbove(enemy) && !enemy.dead) {
          this.hitTargetSuccessfully(enemy);
        } else if (!enemy.dead) {
          this.handleCharacterHit();
        }
      }
    });
  }

  checkEndbossCollision() {
    if (
      this.endBoss &&
      this.character.isColliding(this.endBoss) &&
      !this.endBoss.dead &&
      this.characterCanBeHit()
    ) {
      this.handleCharacterHit();
    }
  }

  handleCharacterHit() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
  }

  checkCoinCollection() {
    this.intervalIds.push(
      setInterval(() => {
        this.level.coins = this.level.coins.filter((coin) => {
          if (this.character.isColliding(coin)) {
            this.character.coinsCount = (this.character.coinsCount || 0) + 1;
            this.coinsStatusBar.setPercentage(this.character.coinsCount * 20);
            this.collectedCoins.push(coin);
            console.log("Coins ist da" + coin);
            this.playSound(this.coinCollectSound);
            return false;
          }
          return true;
        });
      }, 200)
    );
  }

  checkBottleCollisions() {
    this.intervalIds.push(
      setInterval(() => {
        this.level.bottles = this.level.bottles.filter((bottle) => {
          if (this.character.isColliding(bottle)) {
            this.character.bottleCount += 1;
            let percentage = this.character.bottleCount * 20;
            if (percentage > 100) percentage = 100;
            console.log(bottle)
            this.bottleStatusBar.setPercentage(percentage);
            this.playSound(this.bottleCollectSound);
            console.log('Bottles after collect:', this.character.bottleCount);
            return false;
          }
          return true;
        });
      }, 200)
    );
  }

  checkBottleHitsEnemies() {
    this.intervalIds.push(
      setInterval(() => {
        this.throwableObjects.forEach((bottle) => {
          this.level.enemises.forEach((enemy) => {
            if (!enemy.dead && !bottle.hit && bottle.isColliding(enemy)) {
              bottle.hit = true;
              bottle.showHitEffect = true;
              bottle.hitEffectStart = Date.now();
              bottle.stop();

              enemy.dead = true;
              enemy.speed = 0;
              this.character.smallJump();

              setTimeout(() => {
                const index = this.level.enemises.indexOf(enemy);
                if (index > -1) this.level.enemises.splice(index, 1);
              }, 200);

              setTimeout(() => {
                const bottleIndex = this.throwableObjects.indexOf(bottle);
                if (bottleIndex > -1) this.throwableObjects.splice(bottleIndex, 1);
              }, bottle.hitEffectDuration || 500);
            }
          });
        });
      }, 100)
    );
  }

  checkBottleHitsEndboss() {
    this.intervalIds.push(
      setInterval(() => {
        this.throwableObjects.forEach((bottle) => {
          if (this.shouldBottleHitEndboss(bottle)) this.handleBottleHit(bottle);
        });
      }, 100)
    );
  }

  shouldBottleHitEndboss(bottle) {
    return this.endBoss && bottle.isColliding(this.endBoss) && !bottle.hit;
  }

  handleBottleHit(bottle) {
    bottle.hit = true;
    bottle.showHitEffect = true;
    bottle.hitEffectStart = Date.now();
    bottle.stop();

    this.reduceEndbossEnergy(20);
    this.scheduleBottleRemoval(bottle);

    if (this.endBoss.energy <= 0) this.killEndboss();
  }

  reduceEndbossEnergy(amount) {
    this.endBoss.energy -= amount;
    this.endBoss.isHurt = true;
    this.endbossStatusBar.setPercentage(this.endBoss.energy);
  }

  scheduleBottleRemoval(bottle) {
    setTimeout(() => {
      const index = this.throwableObjects.indexOf(bottle);
      if (index > -1) this.throwableObjects.splice(index, 1);
    }, bottle.hitEffectDuration);
  }

  killEndboss() {
    this.endBoss.dead = true;
    this.endBoss.speed = 0;
    this.endBoss.isHurt = false;
    this.gameIsOver = true;

    setTimeout(() => gameOver(true), 2000);
  }

  checkCharacterDead() {
    this.intervalIds.push(
      setInterval(() => {
        if (this.character.energy <= 0) {
          this.character.dead = true;
          gameOver(false);
        }
      }, 200)
    );
  }

  characterCanBeHit() {
    let now = new Date().getTime();
    let timePassed = now - this.character.lastHit;
    return timePassed > 1000;
  }

  hitTargetSuccessfully(enemy) {
    if (enemy == this.endBoss) return;
    if (this.character.isAbove(enemy)) {
      this.character.smallJump();
      enemy.energy = 0;
      enemy.speed = 0;
      enemy.dead = true;
      this.playSound(this.chickenDeathSound);

      setTimeout(() => {
        let index = this.level.enemises.indexOf(enemy);
        if (index > -1) this.level.enemises.splice(index, 1);
      }, 200);
    }
  }

  stop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];
    this.gameIsOver = true;
  }

  updateCamera() {
    this.camera_x = this.character.x > 100 ? -this.character.x + 100 : 0;
  }

  updateEndbossBehavior() {
    if (!this.endBoss || this.endBoss.dead) return;

    const distance = Math.abs(this.character.x - this.endBoss.x);
    const detectionRange = 400;

    if (distance < detectionRange) {
      if (this.endBoss.speed === 0) this.playSound(this.chickenBossMoveSound);
      this.endBoss.speed = 2;
      this.endBoss.isAttacking = true;
      this.endBoss.moveTowards(this.character);
    } else {
      this.endBoss.speed = 0;
      this.endBoss.isAttacking = false;
    }
  }

  draw() {
    if (this.gameIsOver) return;

    this.updateCamera();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.updateEndbossBehavior();

    this.level.backgroundobjects.forEach((bg) =>
      this.ctx.drawImage(bg.img, bg.x, bg.y, bg.width, bg.height)
    );

    this.level.clouds.forEach((cloud) =>
      this.ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height)
    );

    this.level.bottles.forEach((bot) =>
      this.ctx.drawImage(bot.img, bot.x, bot.y, bot.width, bot.height)
    );

    this.level.coins.forEach((con) =>
      this.ctx.drawImage(con.img, con.x, con.y, con.width, con.height)
    );

    this.level.enemises.forEach((enemy) =>
      this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height)
    );

    this.level.endboss.forEach((endb) =>
      this.ctx.drawImage(endb.img, endb.x, endb.y, endb.width, endb.height)
    );

    this.ctx.save();
    if (this.character.otherDirection) {
      this.ctx.translate(this.character.x + this.character.width, 0);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(
        this.character.img,
        0,
        this.character.y,
        this.character.width,
        this.character.height
      );
    } else {
      this.ctx.drawImage(
        this.character.img,
        this.character.x,
        this.character.y,
        this.character.width,
        this.character.height
      );
    }
    this.ctx.restore();

    this.throwableObjects.forEach((obj) => {
      this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
      obj.drawHitEffect(this.ctx);
    });

    this.ctx.translate(-this.camera_x, 0);

    if (this.coinsStatusBar) {
      this.ctx.drawImage(
        this.coinsStatusBar.img,
        this.coinsStatusBar.x,
        this.coinsStatusBar.y,
        this.coinsStatusBar.width,
        this.coinsStatusBar.height
      );
    }

    if (this.statusBar) {
      this.ctx.drawImage(
        this.statusBar.img,
        this.statusBar.x,
        this.statusBar.y,
        this.statusBar.width,
        this.statusBar.height
      );
    }

    if (this.bottleStatusBar) {
      this.ctx.drawImage(
        this.bottleStatusBar.img,
        this.bottleStatusBar.x,
        this.bottleStatusBar.y,
        this.bottleStatusBar.width,
        this.bottleStatusBar.height
      );
    }

    if (this.endbossStatusBar) {
      this.ctx.drawImage(
        this.endbossStatusBar.img,
        this.endbossStatusBar.x,
        this.endbossStatusBar.y,
        this.endbossStatusBar.width,
        this.endbossStatusBar.height
      );
    }

    if (this.endBoss && !this.endBoss.dead) {
      this.ctx.drawImage(
        this.endBoss.img,
        this.endBoss.x,
        this.endBoss.y,
        this.endBoss.width,
        this.endBoss.height
      );
    }

    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }
}

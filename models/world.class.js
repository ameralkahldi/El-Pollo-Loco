class World {
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
  maxStartMoveX = 200;
  startPhaseOver = false;

  constructor(canvas, keyboard, audioManager) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.audioManager = audioManager;
    this.container = document.getElementById("gameContainer");
    this.fullscreenBtn = document.getElementById("fullscreen-btn");
    this.fullscreenBtn.addEventListener("click", () => this.toggleFullScreen());
    this.character = new Character(audioManager);
    this.level = createLevel1();
    this.statusBar = new StatusBar("health");
    this.coinsStatusBar = new CoinsStatusBar("coins");
    this.bottleStatusBar = new BottlesStatusBar("bottles");
    this.setWorld();
    this.statusBar.setPercentage(this.character.energy);
    this.endboss = new Endboss(this.character);
    this.audioManager.toggleBackgroundMusic(false);
    this.checkCollisions();
    this.checkThrowObject();
    this.checkBottleCollisions();
    this.checkBottleHitsEndboss();
    this.checkCharacterDead();
    this.checkBottleHitsEnemies();
    this.checkCoinCollection();
    this.draw();
  }

  playSound(name) {
    if (!this.muted) {
      this.audioManager.playSound(name);
    }
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
    this.endBoss = this.level.endboss[0];
  }

  checkThrowObject() {
    let canThrow = true;
    this.intervalIds.push(
      setInterval(() => {
        if (this.keyboard.D && canThrow && this.character.bottleCount > 0) {
          canThrow = false;

          let bottle = new ThrowableObject(
            this.character.x,
            this.character.y + 100
          );
          bottle.hit = false;
          this.throwableObjects.push(bottle);
          this.character.bottleCount--;

          let percentage = this.character.bottleCount * 20;
          this.bottleStatusBar.setPercentage(percentage);
          this.playSound("bottleCollect");
        }
        if (!this.keyboard.D) canThrow = true;
      }, 100)
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

  characterCanBeHit() {
    return this.character && this.character.canBeHit();
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
            let percentage = Math.min(this.character.coinsCount * 20, 100);
            this.coinsStatusBar.setPercentage(percentage);
            this.collectedCoins.push(coin);
            this.playSound("coinCollect");
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
            if (typeof this.character.bottleCount !== "number") {
              this.character.bottleCount = 0;
            }
            this.character.bottleCount++;
            const percentage = Math.min(this.character.bottleCount * 20, 100);
            this.bottleStatusBar.setPercentage(percentage);
            this.playSound("bottleCollect");
            return false;
          }
          return true;
        });
      }, 100)
    );
  }
  checkBottleHitsEnemies() {
    this.intervalIds.push(
      setInterval(() => {
        this.throwableObjects.forEach((bottle) => {
          this.level.enemises.forEach((enemy) => {
            this.handleBottleEnemyCollision(bottle, enemy);
          });
        });
      }, 100)
    );
  }

  handleBottleEnemyCollision(bottle, enemy) {
    if (!enemy.dead && !bottle.hit && bottle.isColliding(enemy)) {
      this.processBottleHit(bottle, enemy);
    }
  }

  processBottleHit(bottle, enemy) {
    bottle.hit = true;
    bottle.showHitEffect = true;
    bottle.hitEffectStart = Date.now();
    bottle.stop();

    enemy.dead = true;
    enemy.speed = 0;
    this.character.smallJump();
    this.playSound("chickenDeath");

    this.removeEnemyAfterDelay(enemy, 200);
    this.removeBottleAfterDelay(bottle, bottle.hitEffectDuration || 500);
  }

  removeEnemyAfterDelay(enemy, delay) {
    setTimeout(() => {
      const index = this.level.enemises.indexOf(enemy);
      if (index > -1) this.level.enemises.splice(index, 1);
    }, delay);
  }

  removeBottleAfterDelay(bottle, delay) {
    setTimeout(() => {
      const bottleIndex = this.throwableObjects.indexOf(bottle);
      if (bottleIndex > -1) this.throwableObjects.splice(bottleIndex, 1);
    }, delay);
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

    if (this.endBoss.energy <= 0 && !this.endBoss.dead) {
      this.endBoss.die();
      this.playSound("gameOver"); 
    }
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

  checkCharacterDead() {
    this.intervalIds.push(
      setInterval(() => {
        if (this.character.energy <= 0 && !this.character.dead) {
          this.character.die();
          this.playSound("gameOver"); 
        }
      }, 200)
    );
  }
  toggleFullScreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  hitTargetSuccessfully(enemy) {
    if (enemy === this.endBoss) return;
    if (this.character.isAbove(enemy) && !enemy.dead) {
      this.character.smallJump();
      this.killEnemy(enemy);
      this.playSound("chickenDeath"); 
      this.removeEnemyAfterDelay(enemy, 200);
    }
  }

  killEnemy(enemy) {
    if (typeof enemy.kill === "function") {
      enemy.kill();
    } else {
      enemy.energy = 0;
      enemy.speed = 0;
      enemy.dead = true;
      enemy.img = enemy.imageCache
        ? enemy.imageCache[enemy.IMAGE_DEAD[0]]
        : enemy.img;
    }
  }

  stop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];
    this.audioManager.stopAllSounds(); 
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
      if (this.endBoss.speed === 0) this.playSound("bossMove"); 
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

    if (this.coinsStatusBar)
      this.ctx.drawImage(
        this.coinsStatusBar.img,
        this.coinsStatusBar.x,
        this.coinsStatusBar.y,
        this.coinsStatusBar.width,
        this.coinsStatusBar.height
      );

    if (this.statusBar)
      this.ctx.drawImage(
        this.statusBar.img,
        this.statusBar.x,
        this.statusBar.y,
        this.statusBar.width,
        this.statusBar.height
      );

    if (this.bottleStatusBar)
      this.ctx.drawImage(
        this.bottleStatusBar.img,
        this.bottleStatusBar.x,
        this.bottleStatusBar.y,
        this.bottleStatusBar.width,
        this.bottleStatusBar.height
      );

    if (this.endbossStatusBar)
      this.ctx.drawImage(
        this.endbossStatusBar.img,
        this.endbossStatusBar.x,
        this.endbossStatusBar.y,
        this.endbossStatusBar.width,
        this.endbossStatusBar.height
      );

    if (this.endBoss && !this.endBoss.dead)
      this.ctx.drawImage(
        this.endBoss.img,
        this.endBoss.x,
        this.endBoss.y,
        this.endBoss.width,
        this.endBoss.height
      );

    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }
}

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
  chickenDeathSound = new Audio("audio/audio_chicken_death.mp3");
  chickenBossMoveSound = new Audio("audio/audio_chickenBoss.wav");
  coinCollectSound = new Audio("audio/audio_coin_collect.wav");
  bottleCollectSound = new Audio("audio/audio_landing.wav");
  maxStartMoveX = 200;
  startPhaseOver = false;
  /**
   * Creates an instance of the game world.
   * @param {HTMLCanvasElement} canvas - The canvas where the game will be rendered.
   * @param {Object} keyboard - The keyboard input object.
   */
  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    this.character = new Character();
    this.level = createLevel1();

    this.statusBar = new StatusBar("health");
    this.coinsStatusBar = new CoinsStatusBar("coins");
    this.bottleStatusBar = new BottlesStatusBar("bottles");

    this.setWorld();
    this.statusBar.setPercentage(this.character.energy);
    this.endboss = new Endboss(this.character);

    this.checkCollisions();
    this.checkThrowObject();
    this.checkBottleCollisions();
    this.checkBottleHitsEndboss();
    this.checkCharacterDead();
    this.checkBottleHitsEnemies();
    this.checkCoinCollection();
    this.draw();
  }

  /**
   * Plays a sound effect if sound is not muted.
   * @param {HTMLAudioElement} audio - The audio element to play.
   */
  playSound(audio) {
    if (!audio || this.muted) return;
    let sound = audio.cloneNode();
    sound.play();
  }

  /**
   * Toggles the game sound on or off.
   */
  toggleMute() {
    this.muted = !this.muted;
    console.log(`Sound is now ${this.muted ? "OFF" : "ON"}`);
  }

  /**
   * Sets up the world environment and links the character to it.
   */
  setWorld() {
    this.character.world = this;
    this.character.animate();
    this.endBoss = this.level.endboss[0];
  }

  /**
   * Checks if the player throws a bottle and handles it.
   */
  /**
   * Checks if the player throws a bottle (only once per key press).
   */
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
          this.playSound(this.bottleCollectSound);
        }

        if (!this.keyboard.D) {
          canThrow = true;
        }
      }, 100)
    );
  }

  /**
   * Starts checking for enemy and endboss collisions.
   */
  checkCollisions() {
    this.intervalIds.push(
      setInterval(() => {
        this.checkEnemyCollisions();
        this.checkEndbossCollision();
      }, 100)
    );
  }

  /**
   * Checks for collisions with regular enemies.
   */
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

  /**
   * Checks for collision with the endboss and handles it.
   */
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

  /**
   * Determines whether the character can currently be hit by the endboss.
   * @returns {boolean}
   */
  characterCanBeHit() {
    return this.character && this.character.canBeHit();
  }

  /**
   * Applies damage to the character and updates the health bar.
   */
  handleCharacterHit() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
  }

  /**
   * Checks if character collects a coin.
   */
  checkCoinCollection() {
    this.intervalIds.push(
      setInterval(() => {
        this.level.coins = this.level.coins.filter((coin) => {
          if (this.character.isColliding(coin)) {
            this.character.coinsCount = (this.character.coinsCount || 0) + 1;
            let percentage = Math.min(this.character.coinsCount * 20, 100);
            this.coinsStatusBar.setPercentage(percentage);
            this.collectedCoins.push(coin);
            this.playSound(this.coinCollectSound);
            return false;
          }
          return true;
        });
      }, 200)
    );
  }

  /**
   * Checks if character collects a bottle.
   */
  /**
   * Checks if character collects a bottle.
   * Updates bottle count and status bar immediately.
   */
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
            this.playSound(this.bottleCollectSound);
            return false;
          }
          return true;
        });
      }, 100)
    );
  }

  /**
   * Checks if a thrown bottle hits any enemy.
   * This function loops through all bottles and enemies,
   * and triggers appropriate actions if a collision is detected.
   */
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

  /**
   * Handles the collision logic between a single bottle and a single enemy.
   * @param {Object} bottle - The throwable bottle object.
   * @param {Object} enemy - The enemy object.
   */
  handleBottleEnemyCollision(bottle, enemy) {
    if (!enemy.dead && !bottle.hit && bottle.isColliding(enemy)) {
      this.processBottleHit(bottle, enemy);
    }
  }

  /**
   * Processes the effects of a bottle hitting an enemy.
   * Stops the bottle, marks enemy dead, triggers jump and cleans up objects.
   * @param {Object} bottle - The throwable bottle object.
   * @param {Object} enemy - The enemy object.
   */
  processBottleHit(bottle, enemy) {
    bottle.hit = true;
    bottle.showHitEffect = true;
    bottle.hitEffectStart = Date.now();
    bottle.stop();

    enemy.dead = true;
    enemy.speed = 0;
    this.character.smallJump();

    this.removeEnemyAfterDelay(enemy, 200);
    this.removeBottleAfterDelay(bottle, bottle.hitEffectDuration || 500);
  }

  /**
   * Removes the enemy from the level after a delay.
   * @param {Object} enemy - The enemy to remove.
   * @param {number} delay - Delay in milliseconds.
   */
  removeEnemyAfterDelay(enemy, delay) {
    setTimeout(() => {
      const index = this.level.enemises.indexOf(enemy);
      if (index > -1) this.level.enemises.splice(index, 1);
    }, delay);
  }

  /**
   * Removes the bottle from throwable objects after a delay.
   * @param {Object} bottle - The bottle to remove.
   * @param {number} delay - Delay in milliseconds.
   */
  removeBottleAfterDelay(bottle, delay) {
    setTimeout(() => {
      const bottleIndex = this.throwableObjects.indexOf(bottle);
      if (bottleIndex > -1) this.throwableObjects.splice(bottleIndex, 1);
    }, delay);
  }

  /**
   * Checks if a bottle hits the endboss.
   */
  checkBottleHitsEndboss() {
    this.intervalIds.push(
      setInterval(() => {
        this.throwableObjects.forEach((bottle) => {
          if (this.shouldBottleHitEndboss(bottle)) this.handleBottleHit(bottle);
        });
      }, 100)
    );
  }

  /**
   * Checks if the bottle is in range to hit the endboss.
   * @param {ThrowableObject} bottle - The thrown bottle.
   * @returns {boolean} - True if bottle hits the endboss.
   */
  shouldBottleHitEndboss(bottle) {
    return this.endBoss && bottle.isColliding(this.endBoss) && !bottle.hit;
  }

  /**
   * Handles the logic when a bottle hits the endboss.
   * @param {ThrowableObject} bottle - The bottle that hit.
   */
  /**
   * Handles the logic when a bottle hits the endboss.
   * @param {ThrowableObject} bottle - The bottle that hit.
   */
  handleBottleHit(bottle) {
    bottle.hit = true;
    bottle.showHitEffect = true;
    bottle.hitEffectStart = Date.now();
    bottle.stop();

    this.reduceEndbossEnergy(20);
    this.scheduleBottleRemoval(bottle);

    if (this.endBoss.energy <= 0 && !this.endBoss.dead) {
      this.endBoss.die();
    }
  }

  /**
   * Reduces the energy of the endboss.
   * @param {number} amount - The amount to reduce.
   */
  reduceEndbossEnergy(amount) {
    this.endBoss.energy -= amount;
    this.endBoss.isHurt = true;
    this.endbossStatusBar.setPercentage(this.endBoss.energy);
  }

  /**
   * Schedules the removal of a bottle after it hits.
   * @param {ThrowableObject} bottle - The thrown bottle.
   */
  scheduleBottleRemoval(bottle) {
    setTimeout(() => {
      const index = this.throwableObjects.indexOf(bottle);
      if (index > -1) this.throwableObjects.splice(index, 1);
    }, bottle.hitEffectDuration);
  }

  /**
   * Handles the death of the endboss.
   */
  killEndboss() {
    this.endBoss.dead = true;
    this.endBoss.speed = 0;
    this.endBoss.isHurt = false;
    this.gameIsOver = true;
    setTimeout(() => gameOver(true), 2000);
  }

  /**
   * Checks if the character has died.
   */
  checkCharacterDead() {
    this.intervalIds.push(
      setInterval(() => {
        if (this.character.energy <= 0 && !this.character.dead) {
          this.character.die();
        }
      }, 200)
    );
  }

  /**
   * Handles the event when the character successfully jumps on an enemy.
   * Kills the enemy, plays sound, makes character jump, and removes enemy.
   *
   * @param {Enemy} enemy - The enemy that was jumped on.
   */
  hitTargetSuccessfully(enemy) {
    if (enemy === this.endBoss) return;

    if (this.character.isAbove(enemy) && !enemy.dead) {
      this.character.smallJump();
      this.killEnemy(enemy);
      this.playSound(this.chickenDeathSound);
      this.removeEnemyAfterDelay(enemy, 200);
    }
  }

  /**
   * Kills the enemy by setting its state and image.
   * Uses enemy.kill() if available.
   *
   * @param {Enemy} enemy
   */
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

  /**
   * Removes an enemy from the enemies list after a delay.
   * @param {Enemy} enemy
   * @param {number} delay - milliseconds
   */
  removeEnemyAfterDelay(enemy, delay) {
    setTimeout(() => {
      let index = this.level.enemises.indexOf(enemy);
      if (index > -1) this.level.enemises.splice(index, 1);
    }, delay);
  }

  stop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];
    this.gameIsOver = true;
  }

  /**
   * Updates the camera position based on the character's X position.
   */
  updateCamera() {
    this.camera_x = this.character.x > 100 ? -this.character.x + 100 : 0;
  }

  /**
   * Updates the behavior of the endboss based on player distance.
   * Moves the endboss toward the character if within detection range.
   */
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

  /**
   * Main draw function that renders the entire game world.
   * Called recursively using requestAnimationFrame.
   */
  draw() {
    if (this.gameIsOver) return;

    this.updateCamera();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.updateEndbossBehavior();

    // Draw background, clouds, bottles, coins, enemies, and endboss
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

    // Draw character with direction handling
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

    // Draw throwable objects
    this.throwableObjects.forEach((obj) => {
      this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
      obj.drawHitEffect(this.ctx);
    });

    // Reset translation for UI
    this.ctx.translate(-this.camera_x, 0);

    // Draw UI bars
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

    // Draw endboss again (in case it's separate from list)
    if (this.endBoss && !this.endBoss.dead) {
      this.ctx.drawImage(
        this.endBoss.img,
        this.endBoss.x,
        this.endBoss.y,
        this.endBoss.width,
        this.endBoss.height
      );
    }

    // Schedule next frame
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }
}

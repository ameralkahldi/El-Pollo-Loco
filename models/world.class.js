/**
 * The main game world controller responsible for rendering,
 * collision handling, enemy behavior, UI updates, and managing
 * all game loop intervals.
 */

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

  /**
   * Creates a new game world instance.
   * Initializes the canvas, character, level, UI bars, input system,
   * audio, event listeners, collision intervals, and starts the render loop.
   *
   * @param {HTMLCanvasElement} canvas - The game canvas.
   * @param {Keyboard} keyboard - The keyboard input handler.
   * @param {AudioManager} audioManager - Handles game sounds and music.
   */

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
    //this.endboss = new Endboss(this.character);
    this.coinsStatusBar.setPercentage(0);
    this.bottleStatusBar.setPercentage(0);
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

  /**
   * Plays a sound effect if sound is enabled.
   *
   * @param {string} name - The identifier of the sound to play.
   */

  playSound(name) {
    if (this.audioManager.soundEnabled) {
      this.audioManager.playSound(name);
    }
  }

  /**
   * Links the character to this world instance,
   * starts the character animation, and initializes the end boss.
   */

  setWorld() {
    this.character.world = this;
    this.character.animate();
    this.endBoss = this.level.endboss[0];
  }

  /**
   * Continuously checks for bottle throw input (key D).
   * If the player has bottles, spawns a throwable bottle object
   * and updates the bottle status bar.
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
          this.playSound("bottleCollect");
        }
        if (!this.keyboard.D) canThrow = true;
      }, 100)
    );
  }

  /**
   * Sets up interval checks for collisions with enemies and the end boss.
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
   * Detects collisions between the character and standard enemies.
   * If the character jumps on an enemy, the enemy dies.
   * Otherwise, the character receives damage.
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
   * Checks if the character collides with the end boss.
   * Applies damage if the boss is alive and the character can be hit.
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
   * Determines whether the character is currently able to take damage
   * (e.g., not in an invincible state).
   *
   * @returns {boolean} Whether the character can be hit.
   */

  characterCanBeHit() {
    return this.character && this.character.canBeHit();
  }
  /**
   * Applies damage to the character and updates the health status bar.
   */

  handleCharacterHit() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
  }
  /**
   * Detects when the character picks up a bottle.
   * Increases bottle count, updates UI, and removes the bottle.
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
            this.playSound("coinCollect");
            return false;
          }
          return true;
        });
      }, 200)
    );
  }
  /**
   * Continuously checks whether thrown bottles hit standard enemies.
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
            this.playSound("bottleCollect");
            return false;
          }
          return true;
        });
      }, 100)
    );
  }
  /**
   * Continuously checks whether thrown bottles hit standard enemies.
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
   * Checks if a thrown bottle collides with a specific enemy.
   *
   * @param {ThrowableObject} bottle - The thrown bottle object.
   * @param {Enemy} enemy - The enemy being checked.
   */

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
  /**
   * Removes an enemy from the game after a delay.
   *
   * @param {Enemy} enemy - The enemy to remove.
   * @param {number} delay - Delay in milliseconds.
   */

  removeEnemyAfterDelay(enemy, delay) {
    setTimeout(() => {
      const index = this.level.enemises.indexOf(enemy);
      if (index > -1) this.level.enemises.splice(index, 1);
    }, delay);
  }
  /**
   * Removes a thrown bottle from the game after its hit animation ends.
   *
   * @param {ThrowableObject} bottle - The bottle to remove.
   * @param {number} delay - Delay in milliseconds.
   */

  removeBottleAfterDelay(bottle, delay) {
    setTimeout(() => {
      const bottleIndex = this.throwableObjects.indexOf(bottle);
      if (bottleIndex > -1) this.throwableObjects.splice(bottleIndex, 1);
    }, delay);
  }
  /**
   * Continuously checks for thrown bottles hitting the end boss.
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
   * Determines if a bottle should apply damage to the end boss.
   *
   * @param {ThrowableObject} bottle - The bottle to check.
   * @returns {boolean} True if bottle collides and hasn't hit yet.
   */

  shouldBottleHitEndboss(bottle) {
    return this.endBoss && bottle.isColliding(this.endBoss) && !bottle.hit;
  }
  /**
   * Handles a bottle hit on the end boss:
   * - Marks bottle as hit
   * - Reduces boss health
   * - Removes bottle
   * - Plays death sequence if boss reaches zero health
   *
   * @param {ThrowableObject} bottle - The bottle used to hit the boss.
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
      this.playSound("gameOver");
    }
  }
  /**
   * Reduces the end boss's energy by a given amount and updates the UI.
   *
   * @param {number} amount - The amount of damage to apply.
   */

  reduceEndbossEnergy(amount) {
    this.endBoss.energy -= amount;
    this.endBoss.isHurt = true;
    this.endbossStatusBar.setPercentage(this.endBoss.energy);
  }
  /**
   * Removes a bottle object after the hit effect duration.
   *
   * @param {ThrowableObject} bottle - The bottle to remove.
   */

  scheduleBottleRemoval(bottle) {
    setTimeout(() => {
      const index = this.throwableObjects.indexOf(bottle);
      if (index > -1) this.throwableObjects.splice(index, 1);
    }, bottle.hitEffectDuration);
  }
  /**
   * Checks if the character's health reached zero.
   * If so, stops the game and plays death sound.
   */

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
  /**
   * Toggles the game between fullscreen and windowed mode.
   */

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen().catch((err) => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen();
    }
  }
  /**
   * Handles logic when the character successfully jumps on an enemy.
   *
   * @param {Enemy} enemy - The enemy being hit.
   */

  hitTargetSuccessfully(enemy) {
    if (enemy === this.endBoss) return;
    if (this.character.isAbove(enemy) && !enemy.dead) {
      this.character.smallJump();
      this.killEnemy(enemy);
      this.playSound("chickenDeath");
      this.removeEnemyAfterDelay(enemy, 200);
    }
  }
  /**
   * Executes the enemy death behavior.
   * If the enemy has a custom kill() method, it's used.
   *
   * @param {Enemy} enemy - The enemy to kill.
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
   * Completely stops the game:
   * - Cancels animation frame
   * - Clears all intervals
   * - Stops audio
   * - Flags game as over
   */

  stop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.intervalIds.forEach((id) => clearInterval(id));
    this.intervalIds = [];
    this.audioManager.stopAllSounds();
    this.gameIsOver = true;
  }
  /**
   * Updates the camera position to follow the character,
   * maintaining a fixed horizontal margin.
   */

  updateCamera() {
    this.camera_x = this.character.x > 100 ? -this.character.x + 100 : 0;
  }
  /**
   * Controls the end boss AI.
   * If the player is within range, the boss moves and attacks.
   * Otherwise, the boss remains idle.
   */

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
  /**
   * Main render loop:
   * - Updates camera
   * - Clears canvas
   * - Draws all world objects
   * - Draws UI
   * - Requests next animation frame
   */

  draw() {
    if (this.gameIsOver) return;
    this.updateCamera();
    this.clearAndMove();
    this.updateEndbossBehavior();

    this.drawLevelElements();
    this.drawCharacter();
    this.drawThrowables();
    this.resetCameraShift();
    this.drawUI();

    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }
  /**
   * Clears the screen and applies the camera offset transformation.
   */

  clearAndMove() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.camera_x, 0);
  }
  /**
   * Draws all static and dynamic world elements:
   * background, clouds, items, enemies, and the end boss.
   */

  drawLevelElements() {
    [
      ...this.level.backgroundobjects,
      ...this.level.clouds,
      ...this.level.bottles,
      ...this.level.coins,
      ...this.level.enemises,
      ...this.level.endboss,
    ].forEach((obj) =>
      this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height)
    );
  }
  /**
   * Draws the main character, including sprite flipping when facing left.
   */

  drawCharacter() {
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
  }
  /**
   * Draws all thrown bottles and their impact effects.
   */

  drawThrowables() {
    this.throwableObjects.forEach((obj) => {
      this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
      obj.drawHitEffect(this.ctx);
    });
  }
  /**
   * Restores the canvas transform to its default state
   * after rendering world objects.
   */

  resetCameraShift() {
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws all UI components such as:
   * - health bar
   * - coins bar
   * - bottles bar
   * - end boss health bar
   */
  drawUI() {
    [
      this.statusBar,
      this.coinsStatusBar,
      this.bottleStatusBar,
      this.endbossStatusBar,
    ]
      .filter((bar) => bar)
      .forEach((bar) =>
        this.ctx.drawImage(bar.img, bar.x, bar.y, bar.width, bar.height)
      );
  }
}

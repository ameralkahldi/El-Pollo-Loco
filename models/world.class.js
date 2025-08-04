class World {
  character = new Character();
  breakSound = new Audio("audio/audio_break.mp3");
 level = createLevel1(); // ← يتم إنشاء نسخة جديدة من المستوى في كل مرة
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
  intervalIds = [];// 🆕 لتخزين كل الـ setInterval


  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();

    this.statusBar.setPercentage(this.character.energy);

    this.checkCollisions();
    this.checkThrowObject();
    this.collectCoins();
    this.checkBottleCollisions();
    this.checkBottleHitsEndboss();
    this.checkCharacterDead();
    this.checkBottleHitsEnemies();
    this.draw();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
    this.endBoss = this.level.endboss[0];
  }

  checkThrowObject() {
    this.intervalIds.push(setInterval(() => {
      if (this.keyboard.D) {
        let bottle = new ThrowableObject(this.character.x, this.character.y + 100);
        bottle.hit = false;
        this.throwableObjects.push(bottle);
      }
    }, 200));
  }


// Main collision check loop running every 100ms
checkCollisions() {
  this.intervalIds.push(setInterval(() => {
    this.checkEnemyCollisions();   // Check collisions with enemies
    this.checkEndbossCollision();  // Check collision with the end boss
  }, 100));
}

// Check collisions between character and all enemies
checkEnemyCollisions() {
  this.level.enemises.forEach((enemy) => {
    if (this.character.isColliding(enemy)) {
      if (this.character.isAbove(enemy) && !enemy.dead) {
        this.hitTargetSuccessfully(enemy);  // Successfully hit enemy by jumping on top
      } else if (!enemy.dead) {
        this.handleCharacterHit();          // Character takes damage on collision
      }
    }
  });
}

// Check collision between character and the end boss
checkEndbossCollision() {
  if (this.endBoss &&
      this.character.isColliding(this.endBoss) &&
      !this.endBoss.dead &&
      this.characterCanBeHit()) {
    this.handleCharacterHit();  // Character takes damage from end boss
  }
}

// Handle character getting hit: reduce energy and update status bar
handleCharacterHit() {
  this.character.hit();
  this.statusBar.setPercentage(this.character.energy);
}




collectCoins() {
  this.intervalIds.push(setInterval(() => {
    this.level.coins = this.level.coins.filter((coin) => {
      if (this.character.isColliding(coin)) {
        this.character.coinCount += 1; 
        this.coinsStatusBar.setPercentage(this.character.coinCount * 20); 

        return false;
      }
      return true; 
    });
  }, 200));
}


  checkBottleCollisions() {
    this.intervalIds.push(setInterval(() => {
      this.level.bottles = this.level.bottles.filter((bottle) => {
        if (this.character.isColliding(bottle)) {
          this.character.bottleCount += 1;
          this.bottleStatusBar.setPercentage(this.character.bottleCount * 20);
          return false;
        }
        return true;
      });
    }, 200));
  }

checkBottleHitsEnemies() {
  this.intervalIds.push(setInterval(() => {
    this.throwableObjects.forEach((bottle) => {
      this.level.enemises.forEach((enemy) => {
        if (!enemy.dead && !bottle.hit && bottle.isColliding(enemy)) {
          bottle.hit = true;
          bottle.showHitEffect = true;
          bottle.hitEffectStart = Date.now();
          bottle.stop();

          // 🔊 Break-Sound abspielen
          this.breakSound.currentTime = 0;
          this.breakSound.play();

          enemy.dead = true;
          enemy.speed = 0;
          this.character.smallJump();

          setTimeout(() => {
            const index = this.level.enemises.indexOf(enemy);
            if (index > -1) {
              this.level.enemises.splice(index, 1);
            }
          }, 200);

          setTimeout(() => {
            const bottleIndex = this.throwableObjects.indexOf(bottle);
            if (bottleIndex > -1) {
              this.throwableObjects.splice(bottleIndex, 1);
            }
          }, bottle.hitEffectDuration || 500);
        }
      });
    });
  }, 100));
}




checkBottleHitsEndboss() {
  // Check for bottle hits every 100 milliseconds
  this.intervalIds.push(setInterval(() => {
    this.throwableObjects.forEach((bottle) => {
      // If the bottle should hit the endboss
      if (this.shouldBottleHitEndboss(bottle)) {
        this.handleBottleHit(bottle); // Handle what happens after a hit
      }
    });
  }, 100));
}



shouldBottleHitEndboss(bottle) {
  // Returns true only if:
  // - Endboss exists
  // - Bottle is colliding with the endboss
  // - Bottle hasn't already hit something
  return this.endBoss &&
         bottle.isColliding(this.endBoss) &&
         !bottle.hit;
}


handleBottleHit(bottle) {
  bottle.hit = true;                // Mark bottle as used
  bottle.showHitEffect = true;     // Start explosion effect
  bottle.hitEffectStart = Date.now(); // Save the moment of impact
  bottle.stop();                   // Stop the bottle's motion

  this.reduceEndbossEnergy(20);    // Damage endboss by 20
  this.scheduleBottleRemoval(bottle); // Remove bottle after effect

  // If endboss energy is 0 or less → defeat it
  if (this.endBoss.energy <= 0) {
    this.killEndboss();
  }
}


reduceEndbossEnergy(amount) {
  this.endBoss.energy -= amount; // Subtract energy
  this.endBoss.isHurt = true;    // Visual damage state
  this.endbossStatusBar.setPercentage(this.endBoss.energy); // Update health bar
}


scheduleBottleRemoval(bottle) {
  // Wait for the explosion effect to finish
  setTimeout(() => {
    const index = this.throwableObjects.indexOf(bottle);
    if (index > -1) {
      this.throwableObjects.splice(index, 1); // Remove from game
    }
  }, bottle.hitEffectDuration); // Duration of hit animation
}


killEndboss() {
  this.endBoss.dead = true;     // Boss is now dead
  this.endBoss.speed = 0;       // Stop movement
  this.endBoss.isHurt = false;  // Clear hurt state
  this.gameIsOver = true;       // End the game

  // Wait 2 seconds then show win screen
  setTimeout(() => {
    gameOver(true);
  }, 2000);
}



  checkCharacterDead() {
    this.intervalIds.push(setInterval(() => {
      if (this.character.energy <= 0) {
        this.character.dead = true;
        gameOver(false);
      }
    }, 200));
  }

  characterCanBeHit() {
    let now = new Date().getTime();
    let timePassed = now - this.character.lastHit;
    return timePassed > 1000;
  }

  hitTargetSuccessfully(enemy) {
    if (enemy == this.endBoss) {
      return;
    } else if (this.character.isAbove(enemy)) {
      this.character.smallJump();
      enemy.energy = 0;
      enemy.speed = 0;
      enemy.dead = true;
      setTimeout(() => {
        let index = this.level.enemises.indexOf(enemy);
        if (index > -1) {
          this.level.enemises.splice(index, 1);
        }
      }, 200);
    }
  }

  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.intervalIds.forEach(id => clearInterval(id));
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

    this.level.backgroundobjects.forEach(bg =>
      this.ctx.drawImage(bg.img, bg.x, bg.y, bg.width, bg.height)
    );

    this.level.clouds.forEach(cloud =>
      this.ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height)
    );

    this.level.bottles.forEach(bot =>
      this.ctx.drawImage(bot.img, bot.x, bot.y, bot.width, bot.height)
    );

    this.level.coins.forEach(con =>
      this.ctx.drawImage(con.img, con.x, con.y, con.width, con.height)
    );

    this.level.enemises.forEach(enemy =>
      this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height)
    );

    this.level.endboss.forEach(endb =>
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

 this.throwableObjects.forEach(obj => {
  this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);
  obj.drawHitEffect(this.ctx);
});


    this.ctx.translate(-this.camera_x, 0);

    // Status Bars
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

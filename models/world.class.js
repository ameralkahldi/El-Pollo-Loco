class World {
  character = new Character();
  level = level1;
  statusBar = new StatusBar();
  coinsStatusBar = new CoinsStatusBar();
  bottleStatusBar = new BottlesStatusBar();
  endbossStatusBar = new EndbossStatus();
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  throwableObjects = [];
 ;
  
constructor(canvas, keyboard) {
  this.ctx = canvas.getContext("2d");
  this.canvas = canvas;
  this.keyboard = keyboard;
  this.setWorld();

  // Anfangswerte der StatusBars setzen
  this.coinsStatusBar.setPercentage(0);
  this.bottleStatusBar.setPercentage(0);
  this.statusBar.setPercentage(this.character.energy);
  this.endbossStatusBar.setPercentage(100); // Anfangswert für den Endboss


  // Logik starten
  this.checkCollisions();
  this.checkThrowObject();
  this.checkCoinCollisions();
  this.checkBottleCollisions();
  this.hitTargetSuccessfully();
  this.checkBottleHitOnBoss();
  this.draw();
}


  setWorld() {
    this.character.world = this;
    this.character.animate();
    this.endBoss = this.level.endBoss;
  }

  //Diese Funktion überwacht ständig (alle 200 Millisekunden), ob der Spieler die Taste "D" auf der Tastatur drückt.
  checkThrowObject() {
    setInterval(() => {
      if (this.keyboard.D) {
        let bottle = new ThrowableObject(
          this.character.x,
          this.character.y + 100
        );
        this.throwableObjects.push(bottle);
      }
    }, 200);
  }
  //Diese Funktion prüft regelmäßig (alle 200 Millisekunden), ob das Charakter mit einem Feind kollidiert:
 checkCollisions() {
  setInterval(() => {
    this.level.enemises.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        if (this.character.isAbove(enemy) && !enemy.dead) {
          this.hitTargetSuccessfully(enemy); // ✅ Auf Gegner gesprungen
        } else if (!enemy.dead) {
          this.character.hit(); // ❌ Gegner trifft Spieler
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
  }, 100);
}


checkCoinCollisions() {
  setInterval(() => {
    this.level.coins = this.level.coins.filter((coin) => {
      if (this.character.isColliding(coin)) {
        this.character.collectedCoins += 1;
        this.coinsStatusBar.setPercentage(this.character.collectedCoins * 20);
        return false; // ✅ Entfernt diese Münze aus dem Array
      }
      return true; // bleibt erhalten
    });
  }, 200);
}



checkBottleCollisions() {
  setInterval(() => {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.character.isColliding(bottle)) {
       this.character.bottles += 1;
      this.bottleStatusBar.setPercentage(this.character.bottles * 20);
  
        return false; // ✅ Flasche entfernen
      }
      return true;
    });
  }, 200);
}


hitTargetSuccessfully(enemy) {
  if (enemy == this.endBoss) {
    // Optional: Boss-Logik
  } else if (this.character.isAbove(enemy)) {
    this.character.smallJump();  // Charakter springt leicht hoch
    enemy.energy = 0;
    enemy.speed = 0;
    enemy.dead = true;
    // Optional: nach kurzer Zeit entfernen (verstecken)
    setTimeout(() => {
      let index = this.level.enemises.indexOf(enemy);
      if (index > -1) {
        this.level.enemises.splice(index, 1);
      }
    }, 200);  // Feind nach 200ms entfernen
  }
}

 /**This function checks if the caracter stepped properly on enemys head.*/
    steppedOnProperly(enemy){
        return this.character.isColliding(enemy) && this.character.isAboveGround() && !enemy.energy == 0 && this.character.isFalling();
    }
  /**This function handles the removal of a smaller enemy from the world after being stepped on by the main player. */
    killChicken() {
        this.level.enemies.forEach((enemy, i) => {
            if (enemy.dead)
                this.level.enemies.splice(i, 1)
            if (this.steppedOnProperly(enemy))
                this.hitTargetSuccessfully(enemy)
        })
    }

checkBottleHitOnBoss() {
  setInterval(() => {
    this.throwableObjects.forEach((bottle, i) => {
      if (this.endBoss && bottle.isColliding(this.endBoss) && !this.endBoss.dead) {
        this.endBoss.energy -= 20; // z. B. 20% Schaden pro Treffer
        this.endbossStatusBar.setPercentage(this.endBoss.energy);

        this.throwableObjects.splice(i, 1); // Flasche entfernen

        // Falls Boss besiegt:
        if (this.endBoss.energy <= 0) {
          this.endBoss.dead = true;
          // Optional: Entferne Boss oder spiele Animation
        }
      }
    });
  }, 100);
}
   

   
  updateCamera() {
    if (this.character.x > 100) {
      this.camera_x = -this.character.x + 100;
    } else {
      this.camera_x = 0;
    }
  }

  draw() {
    this.updateCamera();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Hintergrund
    this.ctx.translate(this.camera_x, 0);

    this.level.backgroundobjects.forEach((bg) => {
      this.ctx.drawImage(bg.img, bg.x, bg.y, bg.width, bg.height);
    });

    this.level.clouds.forEach((cloud) => {
      this.ctx.drawImage(
        cloud.img,
        cloud.x,
        cloud.y,
        cloud.width,
        cloud.height
      );
    });

    this.level.bottles.forEach((bot) => {
      this.ctx.drawImage(bot.img, bot.x, bot.y, bot.width, bot.height);
    });

    this.level.coins.forEach((con) => {
      this.ctx.drawImage(con.img, con.x, con.y, con.width, con.height);
    });

    this.level.enemises.forEach((enemy) => {
      this.ctx.drawImage(
        enemy.img,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height
      );
    });
    
    this.level.endboss.forEach((endb) => {
      this.ctx.drawImage(
        endb.img,
        endb.x,
        endb.y,
        endb.width,
        endb.height
      );
    });

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
    });

    this.ctx.translate(-this.camera_x, 0);

    // ✅ StatusBar manuell zeichnen (anstatt .draw(ctx))
    if (this.coinsStatusBar) {
      this.ctx.drawImage(
        this.coinsStatusBar.img,
        this.coinsStatusBar.x,
        this.coinsStatusBar.y,
        this.coinsStatusBar.width,
        this.coinsStatusBar.height
      );
    }

    // ✅ StatusBar Energie
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

   if (this.endbossStatusBar && this.endBoss && this.endBoss.x < this.character.x + 800) {
  this.ctx.drawImage(
    this.endbossStatusBar.img,
    this.endbossStatusBar.x,
    this.endbossStatusBar.y,
    this.endbossStatusBar.width,
    this.endbossStatusBar.height
  );
}
      this.ctx.translate(this.camera_x, 0);

      this.ctx.translate(-this.camera_x, 0);

      requestAnimationFrame(() => this.draw());
    }
  }
}

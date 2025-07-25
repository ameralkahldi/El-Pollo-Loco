class World {
  character = new Character();
   statusBar = new StatusBar();
   throwableObjects = [new ThrowableObject()];
   coinsStatusBar = new CoinsStatusBar();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  throwableObjects = [];
 

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.checkCollisions();
    this.checkThrowObject(),
    this.draw();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate(); // <- WICHTIG!
  }


checkThrowObject(){
  setInterval(() => {
    if(this.keyboard.D){
      let bottle = new ThrowableObject (this.character.x,this.character.y +100);
      this.throwableObjects.push(bottle);

    }
  },200);

}
  checkCollisions() {
    setInterval(() => {
      this.level.enemises.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy); // ✅ Energie synchronisieren
        }
      });
    }, 200);
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


    this.ctx.translate(-this.camera_x, 0);

  // ✅ StatusBar manuell zeichnen (anstatt .draw(ctx))

  
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

// ✅ CoinsStatusBar hinzufügen
if (this.coinsStatusBar) {
  this.ctx.drawImage(
    this.coinsStatusBar.img,
    this.coinsStatusBar.x,
    this.coinsStatusBar.y,
    this.coinsStatusBar.width,
    this.coinsStatusBar.height
  );
}


  // 🔽 Kamera danach verschieben
  this.ctx.translate(this.camera_x, 0);

 

  // Charakter
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

  // Gegner
  this.level.enemises.forEach((enemy) => {
    this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // Wolken
  this.level.clouds.forEach((cloud) => {
    this.ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
  });

  this.throwableObjects.forEach((obj) => {
    this.ctx.drawImage(obj.img, obj.x, obj.y, obj.width, obj.height);

});




  // Kamera zurücksetzen
  this.ctx.translate(-this.camera_x, 0);

  // Weiterzeichnen
  requestAnimationFrame(() => this.draw());
}
}
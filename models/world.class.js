class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.checkCollisions();
    this.draw();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate(); // <- WICHTIG!
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

  // ✅ StatusBar zeichnen (fixe Position)
  this.statusBar.draw(this.ctx);

  // 🔽 Kamera danach verschieben
  this.ctx.translate(this.camera_x, 0);



    // Hintergrund zeichnen
    this.level.backgroundobjects.forEach((background) => {
      this.ctx.drawImage(
        background.img,
        background.x,
        background.y,
        background.width,
        background.height
      );
    });

    // Charakter zeichnen (mit Spiegelung)
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
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "blue";
      this.ctx.rect(0, this.character.y, this.character.width, this.character.height);
      this.ctx.stroke();
    } else {
      this.ctx.drawImage(
        this.character.img,
        this.character.x,
        this.character.y,
        this.character.width,
        this.character.height
      );
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "blue";
      this.ctx.rect(this.character.x, this.character.y, this.character.width, this.character.height);
      this.ctx.stroke();
    }
    this.ctx.restore();

    // Gegner zeichnen
    this.level.enemises.forEach((enemy) => {
      this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "red";
      this.ctx.rect(enemy.x, enemy.y, enemy.width, enemy.height);
      this.ctx.stroke();
    });

    // Wolken zeichnen
    this.level.clouds.forEach((cloud) => {
      this.ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
    });

    // Kamera zurücksetzen
    this.ctx.translate(-this.camera_x, 0);

    // Nächster Frame
    requestAnimationFrame(() => this.draw());
  }
}

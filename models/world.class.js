class World {
  character = new Character();
 level=level1;
  canvas;
  ctx;
  keyboard;
 // Initial camera position

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
  }

  setWorld() {
  this.character.world = this;
  this.character.animate(); // <- WICHTIG!
  
}


updateCamera() {
  // Kamera bewegt sich nur, wenn der Charakter nach rechts läuft
  if (this.character.x > 100) {
    this.camera_x = -this.character.x + 100;
  } else {
    this.camera_x = 0; // Kamera bleibt am linken Rand stehen
  }
}



draw() {
  this.updateCamera(); // Kamera-Position berechnen
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Bildschirm löschen
  this.ctx.translate(this.camera_x, 0); // Kamera-Verschiebung aktivieren

  // 🖼 Hintergrund zeichnen
  this.level.backgroundobjects.forEach((background) => {
    this.ctx.drawImage(
      background.img,
      background.x,
      background.y,
      background.width,
      background.height
    );
  });

  // 🧍 Charakter zeichnen (ggf. gespiegelt)
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

    // 🔷 Blauer Rahmen um Charakter (gespiegelt)
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

    // 🔷 Blauer Rahmen um Charakter
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "blue";
    this.ctx.rect(this.character.x, this.character.y, this.character.width, this.character.height);
    this.ctx.stroke();
  }
  this.ctx.restore();

  // 🐔 Gegner (Chicken) zeichnen mit Rahmen
  this.level.enemises.forEach((enemy) => {
    this.ctx.drawImage(
      enemy.img,
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height
    );

    // 🔷 Blauer Rahmen um Gegner
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "red";
    this.ctx.rect(enemy.x, enemy.y, enemy.width, enemy.height);
    this.ctx.stroke();
  });

  // ☁️ Wolken zeichnen mit Rahmen
  this.level.clouds.forEach((cloud) => {
    this.ctx.drawImage(
      cloud.img,
      cloud.x,
      cloud.y,
      cloud.width,
      cloud.height
    );

    // 🔷 Blauer Rahmen um Wolke
    this.ctx.beginPath();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = "red";
    this.ctx.rect(cloud.x, cloud.y, cloud.width, cloud.height);
    this.ctx.stroke();
  });

  // Kamera zurücksetzen
  this.ctx.translate(-this.camera_x, 0);

  // Wiederholen (Animation)
  requestAnimationFrame(() => this.draw());
}

}

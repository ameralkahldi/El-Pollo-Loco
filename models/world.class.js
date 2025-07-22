class World {
  character = new Character();

  enemises = [new Chicken(), new Chicken(), new Chicken()];

  clouds = [new Cloud()];

backgroundobjects = [
  // 1. Abschnitt
  new BackgroundObject("img/5_background/layers/air.png", 0),
  new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
  new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 0),
  new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 0),

  // 2. Abschnitt (rechts daneben)
  new BackgroundObject("img/5_background/layers/air.png", 719),
  new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719),
  new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
  new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

  // 3. Abschnitt (noch weiter rechts)
  new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
  new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 719 * 2),
  new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 2),
  new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 2),
];


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
  }


updateCamera() {
  let newCameraX = -this.character.x + 0;
  // begrenzt nach links
}





 draw() {
  this.updateCamera(); // Kamera-Position berechnen

  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Bildschirm löschen

  this.ctx.translate(this.camera_x, 0); // Kamera-Verschiebung aktivieren

  // 🖼 Hintergrund zeichnen
  this.backgroundobjects.forEach((background) => {
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

  // 🐔 Gegner zeichnen
  this.enemises.forEach((enemy) => {
    this.ctx.drawImage(
      enemy.img,
      enemy.x,
      enemy.y,
      enemy.width,
      enemy.height
    );
  });

  // ☁️ Wolken zeichnen
  this.clouds.forEach((cloud) => {
    this.ctx.drawImage(
      cloud.img,
      cloud.x,
      cloud.y,
      cloud.width,
      cloud.height
    );
  });

  //  Kamera-Verschiebung rückgängig machen für nächsten Frame
  this.ctx.translate(-this.camera_x,0);

  //  Wiederholen (Animation)
  requestAnimationFrame(() => this.draw());
}

}

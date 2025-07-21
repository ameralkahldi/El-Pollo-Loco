class World {
  character = new Character();

  enemises = [new Chicken(), new Chicken(), new Chicken()];

  clouds = [new Cloud()];

  backgroundobjects = [
    new BackgroundObject("img\\5_background\\layers\\air.png"),
    new BackgroundObject("img\\5_background\\layers\\3_third_layer\\1.png"),
    new BackgroundObject("img\\5_background\\layers\\2_second_layer\\2.png"),
    new BackgroundObject("img\\5_background\\layers\\1_first_layer\\2.png"),
  ];

  canvas;
  ctx;
  keyboard;

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

  draw() {
    
    this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.width);

    // Draw all background objects

    this.backgroundobjects.forEach((background) => {
      this.ctx.drawImage(
        background.img,
        background.x,
        background.y,
        background.height,
        background.width
      );
    });

    this.ctx.drawImage(
      this.character.img,
      this.character.x,
      this.character.y,
      this.character.height,
      this.character.width
    );
    this.enemises.forEach((enemy) => {
      this.ctx.drawImage(
        enemy.img,
        enemy.x,
        enemy.y,
        enemy.height,
        enemy.width
      );
    });

    this.clouds.forEach((cloud) => {
      this.ctx.drawImage(
        cloud.img,
        cloud.x,
        cloud.y,
        cloud.height,
        cloud.width
      );
    });

if (this.character.otherDirection) {
      this.ctx.save();
      this.ctx.scale(-1, 1);
      //this.ctx.translate(-this.character.x - this.character.width / 2, 0);
      this.ctx.drawImage(
        this.character.img,
        -this.character.x - this.character.width,
        this.character.y,
        this.character.height,
        this.character.width
      );
      this.ctx.restore();
    }
  if(this.character.otherDirection ) {
    this.flipImage(this.character.img);

  }
  flipImage(image) {
    this.ctx.save();
    this.ctx.scale(-1, 1);
    this.ctx.drawImage(
      image,
      -this.character.x - this.character.width,
      this.character.y,
      this.character.height,
      this.character.width
    );
    this.ctx.restore();

    // Draw all chickens
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }
}

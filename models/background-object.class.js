class BackgroundObject extends MovableObject {
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 0;
    this.width = 719; // oder die echte Breite deiner Hintergrundbilder
    this.height = 500;
  }
}

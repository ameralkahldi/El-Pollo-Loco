class BackgroundObject extends MovableObject {

  
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.x = x;
    this.y = 0;
    this.width = 719; 
    this.height = 500;
  }
}

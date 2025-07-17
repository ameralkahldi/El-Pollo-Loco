class BackgroundObject extends MovableObject{
   constructor(imagePath, x, y, width, height) {
    
        super();
        this.loadImage(imagePath);
        this.x = 0;
        this.y = 0;
        this.width = 500;
        this.height = 720;
    }

}
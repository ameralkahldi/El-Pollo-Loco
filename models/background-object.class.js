class BackgroundObject extends MovableObject{
    constructor() {
        super();
        this.loadImage('img\\5_background\\layers\\3_third_layer\\1.png');
        this.x = 0;
        this.y = 0;
        this.width = 600; // Assuming full width of the canvas
        this.height = 350; // Assuming full height of the canvas
    }

}
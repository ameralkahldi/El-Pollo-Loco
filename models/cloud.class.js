class Cloud extends MovableObject {
    width = 600;
    height = 100;
    speed;
    selector;

    constructor() {
        super();
        this.selector = Math.random() * 2;
        this.chooseImg();

        this.x = Math.random() * canvas.width; // spread across screen
        this.y = Math.random() * 200;          // random vertical position
        this.speed = 0.05 + Math.random() * 0.1; // random speed

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 50);
    }

    chooseImg() {
        if (this.selector < 1) {
            this.loadImage('img/5_background/layers/4_clouds/1.png'); 
        } else {
            this.loadImage('img/5_background/layers/4_clouds/2.png'); 
        }
    }
}

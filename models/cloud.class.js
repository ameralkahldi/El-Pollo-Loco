class Cloud extends MovableObject {
    width = 600;
    height = 100;
    speed;
    selector;

    /**
     * Creates a new Cloud object with a randomly selected image, position, and speed.
     */
    constructor() {
        super();
        this.selector = Math.random() * 2;
        this.chooseImg();

        /**
         * The x-coordinate where the cloud starts.
         * @type {number}
         */
        this.x = Math.random() * canvas.width;

        /**
         * The y-coordinate of the cloud (upper part of the sky).
         * @type {number}
         */
        this.y = Math.random() * 200;

        /**
         * Horizontal movement speed of the cloud.
         * @type {number}
         */
        this.speed = 0.05 + Math.random() * 0.1;

        this.animate();
    }

    /**
     * Starts the cloud animation by continuously moving it to the left.
     * Uses a fixed interval of 50 FPS.
     */
    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 50);
    }

    /**
     * Chooses a cloud image based on a random selector.
     * Loads one of two possible cloud sprite images.
     */
    chooseImg() {
        if (this.selector < 1) {
            this.loadImage('img/5_background/layers/4_clouds/1.png');
        } else {
            this.loadImage('img/5_background/layers/4_clouds/2.png');
        }
    }
}

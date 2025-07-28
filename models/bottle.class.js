class Bottle extends MovableObject {
    constructor() {
        super();
        this.x = 300; // Direkt sichtbar
        this.y = 430;
        this.width = 50;
        this.height = 60;

        this.BOTTLE_IMAGES = [
            './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            './img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        ];

       this.loadImage(this.getRandomImage());

    }

    getRandomImage() {
        const index = Math.floor(Math.random() * this.BOTTLE_IMAGES.length);
        return this.BOTTLE_IMAGES[index];
    }
}

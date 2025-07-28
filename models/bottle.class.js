class Bottle extends MovableObject {
    constructor() {
        super();
        this.x = 300 + Math.random() * 2000;
        this.y =350;
        this.width = 100;
        this.height = 100;

        this.BOTTLE_IMAGES = [
            './img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
            './img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
        ];

        const randomImage = this.getRandomImage();  // ← zufälliges Bild auswählen
        this.loadImage(randomImage);               // ← wichtig: Bild laden!
    }

    getRandomImage() {
        const index = Math.floor(Math.random() * this.BOTTLE_IMAGES.length);
        return this.BOTTLE_IMAGES[index];
    }
}

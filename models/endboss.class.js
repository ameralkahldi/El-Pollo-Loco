class Endboss extends MovableObject {

    IMAGE_WALKING = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGE_WALKING[0]);
        this.loadImages(this.IMAGE_WALKING);
        this.x = 2000;
        this.y = -35;
        this.width = 300;
        this.height = 500;
        this.currentImage = 0;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playWalkingAnimation();
        }, 200);
    }

    playWalkingAnimation() {
        let i = this.currentImage % this.IMAGE_WALKING.length;
        let path = this.IMAGE_WALKING[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}

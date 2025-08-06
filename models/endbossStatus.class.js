class EndbossStatus extends StatusBar {

    
    IMAGES_end = [
        "img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue´60.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "img/7_statusbars/2_statusbar_endboss/blue/blue100.png"
    ];

    constructor() {
        super();
        this.loadImages(this.IMAGES_end);
        this.setPercentage(100); // Start bei 100%
        this.x = 500 ;             // Position auf dem Canvas
        this.y = 5;
        this.width = 200;
        this.height = 60;
    }

}
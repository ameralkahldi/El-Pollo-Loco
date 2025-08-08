class StatusBar extends DrawableObject {
  IMAGES = [
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "./img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png"
  ];

  percentage = 100;

  /**
   * Creates a new StatusBar instance.
   * Loads the images and sets initial position, size, and percentage.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 10;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Sets the current percentage value and updates the displayed image accordingly.
   * @param {number} percentage - The current percentage (0 to 100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let index = this.resolveImageIndex(percentage);
    let path = this.IMAGES[index];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the correct image index based on the given percentage.
   * @param {number} percentage - The current percentage.
   * @returns {number} Index of the corresponding image in the IMAGES array.
   */
  resolveImageIndex(percentage) {
    if (percentage === 100) return 5;
    else if (percentage > 80) return 4;
    else if (percentage > 60) return 3;
    else if (percentage > 40) return 2;
    else if (percentage > 20) return 1;
    else return 0;
  }
}

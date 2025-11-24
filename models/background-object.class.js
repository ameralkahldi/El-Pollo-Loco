/**
 * Represents a background object in the game world.
 * Extends the `MovableObject` class and is typically used
 * for parallax layers or static scenery elements.
 */
class BackgroundObject extends MovableObject {
  /**
   * Creates a new BackgroundObject.
   *
   * @param {string} imagePath - The path to the image used as the background.
   * @param {number} x - The horizontal position where the background object will be placed.
   */
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);

    /**
     * The x-coordinate of the background object.
     * @type {number}
     */
    this.x = x;

    /**
     * The y-coordinate of the background object (always 0 for full-height backgrounds).
     * @type {number}
     */
    this.y = 0;

    /**
     * The width of the background image layer.
     * @type {number}
     */
    this.width = 719;

    /**
     * The height of the background image layer.
     * @type {number}
     */
    this.height = 500;
  }
}

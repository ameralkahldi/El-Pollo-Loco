/**
 * Represents a collectible bottle object in the game.
 * Inherits from MovableObject.
 */
class Bottle extends MovableObject {
  /**
   * Array of bottle image paths.
   * Used to randomly assign one of the available bottle images.
   * @type {string[]}
   */
  BOTTLE_IMAGES = [
    "./img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "./img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Creates a new Bottle instance with random X position and image.
   */
  constructor() {
    super();
    this.x = 300 + Math.random() * 2000; // Random X position
    this.y = 350; // Fixed Y position
    this.width = 100;
    this.height = 100;

    const randomImage = this.getRandomImage(); // Select random image
    this.loadImage(randomImage); // Load selected image
    this.offset = {
      top: 50,
      bottom: 50,
      left: 50,
      right: 50,
    };
  }

  /**
   * Selects a random image from the bottle images array.
   *
   * @returns {string} The path to the selected bottle image.
   */
  getRandomImage() {
    const index = Math.floor(Math.random() * this.BOTTLE_IMAGES.length);
    return this.BOTTLE_IMAGES[index];
  }
}

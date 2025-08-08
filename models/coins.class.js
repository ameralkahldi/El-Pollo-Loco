/**
 * Represents a coin collectible in the game.
 * Inherits from DrawableObject.
 */
class Coins extends DrawableObject {
  /** Path to coin image */
  IMAGES_COIN = [
    "img/8_coin/coin_1.png"
  ];

  /**
   * Creates a new Coin object at a specific position.
   * @param {number} x - Horizontal position of the coin.
   * @param {number} y - Vertical position of the coin (default: 250).
   */
  constructor(x, y = 250) {
    super();
    this.loadImage(this.IMAGES_COIN[0]);
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
  }
}

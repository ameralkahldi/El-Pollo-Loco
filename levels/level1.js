/**
 * Creates and returns level 1 of the game.
 * This includes enemies (chickens), clouds, bottles, coins, background objects, and the endboss.
 * All elements are positioned in a structured and spaced layout.
 *
 * @returns {Level} A new Level object populated with enemies, collectibles, and scenery.
 */
function createLevel1() {
  /**
   * Generate clouds with consistent horizontal spacing and random vertical positions.
   * @type {Cloud[]}
   */
  let clouds = [];
  let cloudSpacing = 400;
  for (let i = 0; i < 5; i++) {
    let cloud = new Cloud();
    cloud.x = i * cloudSpacing;
    cloud.y = 20 + Math.random() * 80;
    clouds.push(cloud);
  }

  /**
   * Create chicken enemies with even spacing.
   * Alternates between big and small chickens.
   * @type {(Chicken|ChickenSmall)[]}
   */
  let chickens = [];
  let firstChickenX = 600;  // Distance from the character to first chicken
  let spacing = 300;        // Spacing between chickens
  let numberOfChickens = 10;

  for (let i = 0; i < numberOfChickens; i++) {
    let x = firstChickenX + i * spacing;
    if (i % 2 === 0) {
      chickens.push(new Chicken(x));       // Big chicken
    } else {
      chickens.push(new ChickenSmall(x));  // Small chicken
    }
  }

  /**
   * Bottles placed at fixed positions throughout the level.
   * @type {Bottle[]}
   */
  let bottles = [
    new Bottle(300),
    new Bottle(450),
    new Bottle(600),
    new Bottle(750),
    new Bottle(900),
    new Bottle(1200),
    new Bottle(1500),
    new Bottle(1800),
  ];

  /**
   * Coins placed at regular intervals starting from a specific x position.
   * @type {Coins[]}
   */
  let coins = [];
  let firstCoinX = 500;
  let coinSpacing = 250;
  let numberOfCoins = 6;

  for (let i = 0; i < numberOfCoins; i++) {
    let x = firstCoinX + i * coinSpacing;
    coins.push(new Coins(x));
  }

  /**
   * Creates repeating background objects to cover the entire horizontal level.
   * Each "screen" width is 719 pixels.
   * @type {BackgroundObject[]}
   */
  let backgrounds = [];
  for (let i = -1; i <= 6; i++) {
    for (let j = 0; j < 3; j++) {
      backgrounds.push(
        new BackgroundObject("img/5_background/complete_background.png", 719 * i)
      );
    }
  }

  /**
   * Endboss enemy that appears later in the level.
   * @type {Endboss[]}
   */
  let endboss = [new Endboss()];

  /**
   * Returns a new level instance with all created elements.
   * @type {Level}
   */
  return new Level(chickens, clouds, bottles, coins, backgrounds, endboss);
}

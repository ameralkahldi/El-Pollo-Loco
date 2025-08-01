function createLevel1() {
  return new Level(
    [
  new Chicken(400),
  new Chicken(800),
  new Chicken(1200),
  new ChickenSmall(1000),
  new ChickenSmall(1100),
  new ChickenSmall(1200),
  new ChickenSmall(1300),
  new ChickenSmall(1400),
  new ChickenSmall(1500)
],

    [new Cloud()],
    [
      new Coins(),
      new Coins(),
      new Coins(),
      new Coins(),
      new Coins()
    ],
    [
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle(),
      new Bottle()
    ],
    [
      new BackgroundObject("img/5_background/layers/air.png", -719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", -719),

      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

      new BackgroundObject("img/5_background/layers/air.png", 719),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 2),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 2),

      new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719 * 3),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719 * 3)
    ],
    [new Endboss()]
  );
}

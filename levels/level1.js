function createLevel1() {
  return new Level(
    [
  new Chicken(100),
  new Chicken(500),
  new Chicken(1000),
  new Chicken(1300),
  new Chicken(1600),
  new Chicken(2000),
  new ChickenSmall(200),
  new ChickenSmall(700),
  new ChickenSmall(1200),
  new ChickenSmall(1600),
  new ChickenSmall(2000)
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

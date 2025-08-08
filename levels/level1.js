function createLevel1() {
  // الغيوم
  let clouds = [];
  let cloudSpacing = 400;
  for (let i = 0; i < 5; i++) {
    let cloud = new Cloud();
    cloud.x = i * cloudSpacing;
    cloud.y = 20 + Math.random() * 80;
    clouds.push(cloud);
  }

  // ✨ الدجاج يبدأ بعد 600 بكسل من الشخصية
  let chickens = [];
  let firstChickenX = 600;      // أول دجاجة
  let spacing = 300;            // المسافة بين كل دجاجة
  let numberOfChickens = 10;

  for (let i = 0; i < numberOfChickens; i++) {
    let x = firstChickenX + i * spacing;
    if (i % 2 === 0) {
      chickens.push(new Chicken(x));        // دجاجة كبيرة
    } else {
      chickens.push(new ChickenSmall(x));   // دجاجة صغيرة
    }
  }

  // الزجاجات
  let bottles = [
    new Bottle(300),
    new Bottle(600),
    new Bottle(900),
    new Bottle(1200),
    new Bottle(1500),
    new Bottle(1800),
  ];

  // العملات
  let coins = [
    new Coins(), new Coins(), new Coins(), new Coins(), new Coins()
  ];

  // الخلفية
  let backgrounds = [];
  for (let i = -1; i <= 6; i++) {
    for (let j = 0; j < 3; j++) {
      backgrounds.push(
        new BackgroundObject("img/5_background/complete_background.png", 719 * i)
      );
    }
  }

  // الزعيم
  let endboss = [new Endboss()];

  // إرجاع المستوى
  return new Level(chickens, clouds, bottles, coins, backgrounds, endboss);
}

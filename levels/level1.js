function createLevel1() {
    // إنشاء الغيوم جنب بعض
    let clouds = [];
    let cloudSpacing = 500; // المسافة بين كل غيمة والأخرى
    for (let i = 0; i < 4; i++) {
        let cloud = new Cloud();
        cloud.x = i * cloudSpacing; // الغيوم جنب بعض
        clouds.push(cloud);
    }

    return new Level(
        [
            // ترتيب الدجاج حسب الإحداثي الأفقي
            new Chicken(100),
            new ChickenSmall(200),
            new Chicken(500),
            new ChickenSmall(700),
            new Chicken(1000),
            new ChickenSmall(1200),
            new Chicken(1300),
            new ChickenSmall(1600),
            new Chicken(1700),
            new ChickenSmall(2000),
            new Chicken(2200)
        ],
        clouds, 
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
            new BackgroundObject("img/5_background/complete_background.png", -719),
            new BackgroundObject("img/5_background/complete_background.png", 0),
            new BackgroundObject("img/5_background/complete_background.png", 719),
            new BackgroundObject("img/5_background/complete_background.png", 719 * 2),
            new BackgroundObject("img/5_background/complete_background.png", 719 * 3),
            new BackgroundObject("img/5_background/complete_background.png", 719 * 4),
            new BackgroundObject("img/5_background/complete_background.png", 719 * 5)
        ],
        [new Endboss()]
    );
}

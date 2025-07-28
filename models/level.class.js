class Level {
    enemises;
    clouds;
    bottles;
    coins;
    backgroundobjects;
    level_end_x = 700 * 7 - 200;

    constructor(enemises, clouds, bottles, coins, backgroundobjects){
        this.enemises = enemises;
        this.clouds = clouds;
        this.bottles = bottles;
        this.coins = coins;
        this.backgroundobjects = backgroundobjects;
    }
}
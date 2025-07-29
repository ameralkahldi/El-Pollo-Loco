class Coins extends DrawableObject{
   
   IMAGES_COIN = [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png"
   ];


   constructor(){
    super();
        this.loadImage('img/8_coin/coin_1.png'); // Beispielpfad
        this.x = 300 + Math.random() * 500;
        this.y = 200 + Math.random() * 100;
        this.width = 100;
        this.height = 100;
      
   }
  
   
}  
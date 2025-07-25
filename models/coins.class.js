class Coins extends MovableObject{
   IMAGES_COIN = [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png"
   ];


   constructor(){
    super().loadImage('img/8_coin/coin_2.png');
    this.loadImages(this.IMAGES_COIN);
   

   }
   animate(){
    setInterval(() => {
        this.playWalkingAnimation(this.IMAGES_COIN);
    },200)
   }





}  
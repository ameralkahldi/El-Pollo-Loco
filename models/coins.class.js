class Coins extends DrawableObject{
   IMAGES_COIN = [
    "img/8_coin/coin_1.png",
    "img/8_coin/coin_2.png"
   ];


   constructor(){
    super().loadImage('img/8_coin/coin_2.png');
    this.loadImages(this.IMAGES_COIN);
    this.animate();
   

   }
   animate(){
    setInterval(() => {
        this.playWalkingAnimation(this.IMAGES_COIN);
    },200)
   }

 playWalkingAnimation(images) {
    let i = this.currentImage % images.length;
  let path = images[i];
  this.img = this.imageCache[path];
  this.currentImage++;
}



}  
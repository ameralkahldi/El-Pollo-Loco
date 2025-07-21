class MovableObject {
   x = 120;
   y =250;
   img;
   height = 150;
   width = 200;
   imageCache = {};
   speed = 0.15; // Default speed for movement 
   otherDirection = false; // Default direction for movement
   

   loadImage(path) {
    this.img = new Image();
    this.img.src = path;
   }


   loadImages(arr) {
  arr.forEach((path) => {
    let img = new Image();
    img.src = path;
    this.imageCache[path] = img;
  });
}


   moveRight(){
      setInterval(() => {
         this.x += this.speed;
      }, 1000 / 60); // 60 FPS
   }
   

  moveLeft(){
      setInterval(() => {
         this.x -= this.speed;
      }, 1000 / 60); // 60 FPS
  }
}

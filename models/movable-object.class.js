class MovableObject {
   x = 120;
   y =250;
   img;
   height = 150;
   width = 200;

   loadImage(path) {
    this.img = new Image();
    this.img.src = path;
   }


   moveRight(){
    console.log("Moving right");
   }

   moveLeft(){
    console.log("Moving left");

   }
}

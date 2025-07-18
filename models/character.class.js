class Character extends MovableObject {
  y = 235;
  height = 200;

  IMAGE_WALKTING=[
     "/img/2_character_pepe/2_walk/W-21.png",
      "/img/2_character_pepe/2_walk/W-22.png",
      "/img/2_character_pepe/2_walk/W-23.png",
      "/img/2_character_pepe/2_walk/W-24.png",
      "/img/2_character_pepe/2_walk/W-25.png",
      "/img/2_character_pepe/2_walk/W-26.png"
  ];

  currentImage=0;

  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGE_WALKTING);
    this.animate();
  }


  
  animate() {
    setInterval(() => {
      let i= this.currentImage % this.IMAGE_WALKTING.length;
      let path= this.IMAGE_WALKTING[i];
      this.img = this.imageCache[path];
      this.currentImage++;
    }, 1000);


  }



  jump() {}
}

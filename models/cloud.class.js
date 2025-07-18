class Cloud  extends MovableObject{
     y = 50 ;
        width = 200;
        height=400;
     constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png');

        this.x = Math.random() * 500; // Random x position
        this.animate();

 }

animate(){
    setInterval(() => {
       this.x -=0.15;
    }, 1000 / 60);

}
    

}
class World{

    character = new Character();

 enemises=[
    new Chicken(),
    new Chicken(),
    new Chicken()
];



clouds =[new Cloud()

];



backgrounds = [new BackgroundObject()
];

canvas;
ctx;


constructor(canvas){
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
}

    draw(){

        
        this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.width);

        this.ctx.drawImage(this.character.img, this.character.x, this.character.y ,this.character.height, this.character.width);
        this.enemises.forEach(enemy => {
            this.ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.height, enemy.width);
        });

        this.clouds.forEach(cloud => {
            this.ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.height, cloud.width);
        });

        this.backgrounds.forEach(bg => {
            this.ctx.drawImage(bg.img, bg.x, bg.y, 720, 600)});


// Draw all chickens
        let self =this;
      requestAnimationFrame(function(){
        self.draw();
      });
      
    

}



}
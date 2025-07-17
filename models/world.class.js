class World{

    character = new Character();

 enemises=[
    new Chicken(),
    new Chicken(),
    new Chicken()
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
     


// Draw all chickens
        let self =this;
      requestAnimationFrame(function(){
        self.draw();
      });
    

}}
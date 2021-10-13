// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas);
let gameOver;
let running = false;

let AnimationId;

var laVenenosa;
var t1;
var messageBox;

// Used to monitor whether paddles and ball are
// moving and in what direction
let DIRECTION = {
    STOPPED: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};
let cirSpeed = 5;
let cirX = 5;
let cirY = 1;

function SetupCanvas(){

    // Reference to the canvas element
    canvas = document.querySelector("canvas");

    // Context provides functions used for drawing and 
    // working with Canvas
    ctx = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    document.addEventListener('keydown', MovePlayerPaddle);
 
    // trigger Animation
    //AnimationId = requestAnimationFrame(gameLoop); //loop infinito
    gameOver = false;
    //console.log("Yo termine SetupCanvas");
    laVenenosa = new Snake(innerWidth/2, innerHeight/2, 0, 'green');

    laVenenosa.grow(15);
    laVenenosa.draw();
    
}
class Snake{

    constructor(x, y, tamano, color){
        this.color = color;

        this.x = x;
        this.y = y;

        this.move = DIRECTION.STOPPED;
        this.velocity = 5;

        this.body = [];
    }
    draw(){
        // snake's head
        ctx.rect (this.x, this.y, 20, 20);
        ctx.stroke();

        console.log("length " + this.body.length)

        //drawing the snake's body
        for (let i = 0; i < this.body.length; i++) {
            const element = this.body[i];
            element.draw();
        }
        console.log(this.body)
    }
    update(posX, posY){
        this.x += posX;
        this.y += posY;
    }
    grow(numeroDeTiles){

        var PosX = this.x + 20;

        for (let i = 0; i < numeroDeTiles; i++) {
            PosX += 23;
            var t1 = new Tile(PosX, this.y, generateRandomColor(), i)
            this.body.push(t1); 
        }

       var t2 = new Tile(170, 150,'green', '#')
       this.body.push(t2);

        console.log(this.body)
        console.log("grow length " + this.body.length)
    }
}
class Tile {

    constructor(x, y, color, decoration){
        this.x = x;
        this.y = y;
        this.color = color;
        this.decoration = decoration;
        this.velocity = 5;
        this.previousX = 0;
        this.previousY = 0;
    }
    draw(){
       
        //creating rectangle
        ctx.beginPath();
        ctx.rect(this.x, this.y, 20, 20);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();

        ctx.font = "15px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText(this.decoration, this.x+6, this.y+15);

    }

}
class MessageBox{
    constructor(x, y, color, message){
        this.x = x;
        this.y = y;            //buscar como hacer cajita de textos con efecto
        this.color = color;
        this.message = message;

    }
    draw(){
        ctx.beginPath();
        ctx.rect(this.x, this.y, 300, 300);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();

        ctx.font = "15px Arial";
        ctx.fillStyle = this.color;
        ctx.fillText(this.message, this.x+6, this.y+15);
    }
}
function gameLoop(){
   // console.log("veces que pase por aqui");

    if(gameOver==false) {

        AnimationId = requestAnimationFrame(gameLoop);
        update();
        paint();

    } else {

        //Finish the game
        cancelAnimationFrame(AnimationId)

        // ctx.font = '30px Arial';
        // ctx.textAlign = 'center';
        // ctx.fillStyle = "red";
        // ctx.fillText = ("Game Over!!!",canvas.width/2, canvas.height/2);

        messageBox = new MessageBox(innerWidth/2, innerHeight/2,'black','Game Over!!')
        messageBox.draw();


    }
}
function paint(){
    //for (let index = 0; index<innerWidth; index+=50) {
        {
            //Clear the canvas 
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            laVenenosa.draw();

            // //Draw Canvas background
            // ctx.fillStyle = 'rgb(0, 0, 0, 0.3)';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);
            

            // //creating circles
            // ctx.beginPath();
            // ctx.fillStyle = 'White';
            // var speed = 0;
            // speed += 0;

            //     ctx.arc(cirX, cirY, 30, 0, 2 * Math.PI);
            //     ctx.stroke();
            //     ctx.fillStyle = "yellow";
            //     ctx.fill();
            //     console.log("x: " + index + "y: " + index);

            // //creating rectangle
            // ctx.beginPath();
            // ctx.rect(innerWidth-index+speed, index+speed, 40, 40, 40);
            // ctx.fillStyle = "red";
            // ctx.fill();
            // ctx.stroke();
            
            // //escribir en el canvas
            // canvas = document.querySelector("canvas");
            // ctx = canvas.getContext("2d");
            // ctx.font = "20px Arial";
            // ctx.strokeText("Soy Arielle de Madet ", innerWidth/2, index);

        }
    
    //}
    // gameOver = true;

    // console.log(gameOver);
    // if (gameOver) {
    //     console.log("gameOver: " + gameOver);    
    //     cancelAnimationFrame(AnimationId);
    //     clearInterval(refreshInterValId);

    // }

}
function update(){
    cirX += cirSpeed;
    cirY += cirSpeed;

    //enemies off the screen?
    if(cirX > canvas.height ) {
        cirSpeed = cirSpeed * -1;
    } else if (cirX < 0) {
        cirSpeed = cirSpeed * -1
    }
}
function MovePlayerPaddle(key){

    if(running === false){
        running = true;
        window.requestAnimationFrame(gameLoop);
    }
    
    // handle scape as game over
    if(key.keyCode === 27) gameOver = true;

    // Handle space bar for PAUSE
    if(key.keyCode === 32) {
        running = false;
    }

    // Handle up arrow and w input
    if(key.keyCode === 38 || key.keyCode === 87) {
        laVenenosa.update(0, -10)
        laVenenosa.move = DIRECTION.UP;
    }
    // Handle down arrow and s input
    if(key.keyCode === 40 || key.keyCode === 83) {
        laVenenosa.update(0, 10)
        laVenenosa.move = DIRECTION.DOWN;
    }    

    // Handle left arrow and a input
    if(key.keyCode === 37 || key.keyCode === 65){
        laVenenosa.update(-10, 0)
        laVenenosa.move = DIRECTION.LEFT;
    }
    // Handle right arrow and d input
    if(key.keyCode === 39 || key.keyCode === 68) {
        laVenenosa.update(10, 0)
        laVenenosa.move = DIRECTION.RIGHT;
    }
    
    update();
}
 // Creating of Colors  ramdon
 function generateRandomColor(){
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
    //random color will be freshly served
}
    
// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas);
let gameOver;
let AnimationId;
let cirSpeed = 5;
let cirX = 5;
let cirY = 1;
var mySnake = "";


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
    AnimationId = requestAnimationFrame(gameLoop); //loop infinito
    gameOver = false;
    //console.log("Yo termine SetupCanvas");
}
class Snake{

    constructor(tamano, color){
        this.color = color;
        this.cabeza = "";

        this.x = x;
        this.y = y;

        this.move = DIRECTION.STOPPED;
        this.velocity = 5;
    }
    draw(){

        ctx.rect (this.x, this.y, 150, 100);
        ctx.stroke()

    }

}
function gameLoop(){
    console.log("Yo pase por aqui");

    if(gameOver==false) {

        AnimationId = requestAnimationFrame(gameLoop);
        update();
        paint();

    } else {

        //Finish the game
        cancelAnimationFrame(AnimationId)

        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = "red";
        ctx.fillText = ("Game Over!!!",canvas.width/2, canvas.height/2);
    }
}
function paint(){
    //for (let index = 0; index<innerWidth; index+=50) {
        {
            //Clear the canvas 
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            //Draw Canvas background
            ctx.fillStyle = 'rgb(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            
            //creating circles
            ctx.beginPath();
            ctx.fillStyle = 'White';
            var speed = 0;
            speed += 0;

            // ctx.arc(cirX, cirY, 30, 0, 2 * Math.PI);
            // ctx.stroke();
            // ctx.fillStyle = "yellow";
            // ctx.fill();
            //console.log("x: " + index + "y: " + index);

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
    //handle scape as game Over
    if(key.keyCode === 27) gameOver = true;
    
    if(key.keyCode === 38) cirSpeed += 10;

    if(key.keyCode === 40) cirSpeed -= 10;

    console.log("key.Code: " + key.keyCode)
}
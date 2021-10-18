// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas);
let gameOver;
let running = false;

let AnimationId;

let laVenenosa;
let t1;
let messageBox;
let timeBox;
let scoreBox;
let vitamina;
let dashboard;
let gameTitle;

var today = new Date();
var clock = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
 

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
    
    dashboard = new MessageBox(0, 0, innerWidth, 70, 'white', '', '', '');
    dashboard.draw();

    timeBox = new MessageBox(innerWidth-110, 15, 80, 40, 'orange', 'white','14px Courier', clock);
    timeBox.draw();

    messageBox    = new MessageBox(innerWidth/4, innerHeight/4, 300, 150, 'grey', 'white', '30px Courier', 'Game Over!!!');
    
    vitamina = new Vitamina(200, 100, 'aqua')
    vitamina.draw();

    scoreBox = new MessageBox(20, 15, 120, 45, 'orange', 'white', '22px Courier', 'Score: ');
    scoreBox.draw();

    gameTitle = new MessageBox(innerWidth*0.45, 15, 70, 40, 'blue', 'white', '18px Courier', 'Snake');
    gameTitle.draw();
   
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

        ctx.save();
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

        ctx.restore();
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
        ctx.save();
        //creating rectangle
        ctx.beginPath();
        ctx.rect(this.x, this.y, 20, 20);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();

        ctx.font = "15px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText(this.decoration, this.x+6, this.y+15);
        ctx.restore();
    }

}
class MessageBox{
    constructor(x, y, wWidth, wHeight, bgColor, foreColor, font, message){
        this.x = x;
        this.y = y;            //buscar como hacer cajita de textos con efecto

        this.wWidth = wWidth;
        this.wHeight = wHeight;

        this.bgColor = bgColor;
        this.foreColor = foreColor;
        this.font = font;

        this.message = message;

    }
    draw(){
        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.wWidth, this.wHeight);
        ctx.fillStyle = this.bgColor;
        ctx.fill();
        ctx.stroke();

        ctx.font = this.font;
        ctx.fillStyle = this.foreColor;
        ctx.fillText(this.message, this.x + (this.wWidth*0.19), this.y + (this.wHeight*0.65)); //hacer una equacion para que el text box sea en coordinacion con el tamano del canvas
        ctx.restore();
    }
}
class Vitamina{

    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;
    }
    draw(){
        //creating circles
        ctx.save();
        ctx.beginPath();
        // ctx.fillStyle = 'White';
        // var speed = 0;
        // speed += 0;

        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
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

        messageBox.draw();
    }
}
function paint(){
    //for (let index = 0; index<innerWidth; index+=50) {
        {
            //Clear the canvas 
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            laVenenosa.draw();
            messageBox.draw();
            timeBox.draw();
            vitamina.draw();

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
   // timeBox.draw();

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
 function generateRandomColor(){
     // Creating of Colors  ramdon
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
    //random color will be freshly served
}
    
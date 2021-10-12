// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas);
let gameOver;
let AnimationId;

function SetupCanvas() {

    // Reference to the canvas element
    canvas = document.querySelector("canvas");

    // Context provides functions used for drawing and 
    // working with Canvas
    ctx = canvas.getContext('2d');

    canvas.width = innerWidth;
    canvas.height = innerHeight;
 
    // trigger Animation
    AnimationId = requestAnimationFrame(paint);
    gameOver = false;
}

function paint() {

    for (let index = 0; index<innerWidth; index+=50) {
      
        {
            //creating circles

            ctx.beginPath();
            ctx.fillStyle = 'White';
            var speed = 0;
            speed += 0;

            ctx.arc(index+speed, index+speed, 20, 0, 2 * Math.PI);
            ctx.stroke();
            console.log("x: " + index + "y: " + index);

            //creating rectangle
            ctx.beginPath();
            ctx.rect(innerWidth-index+speed, index+speed, 30, 30, 40);
            ctx.stroke();
            
            //escribir en el canvas
            canvas = document.querySelector("canvas");
            ctx = canvas.getContext("2d");
            ctx.font = "20px Arial";
            ctx.strokeText("Soy Arielle de Madet ", innerWidth/2, index+speed);

        }
    
    }
    
     
    gameOver = true;

    console.log(gameOver);
    if (gameOver) {
        console.log("gameOver: " + gameOver);    
        cancelAnimationFrame(AnimationId);
        clearInterval(refreshInterValId);

    }

}

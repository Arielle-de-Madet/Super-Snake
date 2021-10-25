// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas); //cuanda hay una interracion con la paginaWeb (juego),activa o llama la funcion setupCanvas

let steppedGame = false;
let gameOver = false;
let running = false;
let gamePaused = false;

let score = 0;
let dashboardHeight = 60;

let AnimationId;

let oSnake; 
let oMessageBox;
let oTimeBox;
let oScoreBox;
let oVitamin;
let oDashboard;
let oGameTitle;
let stopWatch;
let oEat;
let oCrash;
let oGameOver;

let oGameSoundtrack;

let lives = 3;

//let today = new Date();

// moving and in what direction
let DIRECTION = {
    STOPPED: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};
let cirSpeed = 0.001;
let cirX = 5;
let cirY = 1;

function SetupCanvas(){

    // Reference to the canvas element
    canvas = document.querySelector("canvas");

    // Context provides functions used for drawing and 
    // working with Canvas
    ctx = canvas.getContext('2d');

    canvas.width = 880; //Math.floor(innerWidth * 0.50);
    canvas.height = 580; //Math.floor(innerHeight * 0.70);

    document.addEventListener('keydown', ProcessUserCommands);
 
    
    oSnake = new Snake(440, 300, 0, 'green');
    oSnake.grow(1);

    oVitamin = new Vitamina(0, 0);
    oVitamin.move();

    stopWatch = new Stopwatch("stopWatchDisplay");
    stopWatch.reset();


    oDashboard = new MessageBox(0, 0, canvas.width, dashboardHeight, 'white', '', '', '');
    oTimeBox   = new MessageBox(canvas.width-130, 10, 120, 40, 'orange', 'white','14px Courier', stopWatch.update());
    oScoreBox  = new MessageBox(20, 10, 130, 40, 'orange', 'white', '20px Courier', 'Score:' + score);
    oGameTitle = new MessageBox(canvas.width*0.45, 10, 120, 40, 'black', 'yellow', 'bold 26px Courier', 'Snake');


    draw();

    oEat = new SoundPlayer('beepSound1', "assets/crunch.6.ogg");
    oCrash= new SoundPlayer('beepSound2', "assets/stop.flac");
    oGameOver= new SoundPlayer('beepSound3', "assets/010609168_prev.mp3");
    oGameSoundtrack = new SoundPlayer('beepSound4', "assets/forest.mp3"); 
    

   console.log('canvas.width: ' + canvas.width + ' canvas.height: ' + canvas.height);
   console.log('DashBoard: ' + dashboardHeight );
}
class Snake {

    constructor(x, y, color){

        this.color = color;
        
        this.x = x;
        this.y = y;

        this.width = 20;
        this.height = 20;

        this.prevX = x-20;
        this.prevY = y;

        // defines movement direction of paddles
        this.move = DIRECTION.STOPPED;

        // defines how quickly tiles can be moved
        this.velocity = 20;
        this.cuerpo = [];

        this.bodySize = 0;

       // save head's positon for next tile
       let tilePosX = this.prevX;
       let tilePosY = this.prevY;


        // console.log("Snake.constructor.1");
        // console.log(this.snappedTiles)
    }
    draw(){

        ctx.save();

        // draw head
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // draw ojo
        ctx.beginPath();
        ctx.arc(this.x+12, this.y+5, 2, 0, Math.PI*2, false);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.strokeStyle = 'green';
        ctx.stroke();

        // draw individual tiles into body
        for (let index = 0; index < this.cuerpo.length; index++) {
            const currentTile = this.cuerpo[index];
            currentTile.draw();
        }
        ctx.restore();

        this.#drawLives();   

    }
    update(){

        // save previous position
        this.prevX = this.x;
        this.prevY = this.y;

        // here it is where my next tile should be
        switch (this.move) {
            case DIRECTION.DOWN:
                this.y += this.velocity;
                break;
            case DIRECTION.UP:
                this.y -= this.velocity;
                break;        
            case DIRECTION.RIGHT:
                this.x += this.velocity;
                break;     
            case DIRECTION.LEFT:
                this.x -= this.velocity;
                break;
        }

        // console.log("Snake Postions -> x: " + this.x + " y: " + this.y);
        // console.log("Snake Prev Postions -> x: " + this.prevX + " y: " + this.prevY);


        // save head's positon for next tile
        let tilePosX = this.prevX;
        let tilePosY = this.prevY;

        // draw individual tiles into body
        for (let index = 0; index < this.cuerpo.length; index++) {

            // console.log("Set tile new Postions to -> x: " + tilePosX + " y: " + tilePosY);
            
            const currentTile = this.cuerpo[index];
            currentTile.update(tilePosX, tilePosY);

            // set the positon for the next tile
            // console.log("Save tile prev Pos for next tile's new Pos -> x: " + currentTile.prevX + " y: " + currentTile.prevY);
            tilePosX = currentTile.prevX;
            tilePosY = currentTile.prevY;

        }
    }
    grow(numberOfTiles){

        let tilePosX = 0;
        let tilePosY = 0;   

        // if only head, follow it
        // console.log(this.snappedTiles);

        if (this.cuerpo.length == 0){
            tilePosX = this.prevX;
            tilePosY = this.prevY;   
        } else {
            // if not, follow tail
            let tile = this.cuerpo[this.cuerpo.length-1];
            if (tile != undefined){
                tilePosX = tile.prevX;
                tilePosY = tile.prevY;         
            }
        }

        // adding default tiles to initial body
        for (let index = 0; index < numberOfTiles; index++) {
            // console.log("tile: " + index); 
            this.bodySize +=1;
            this.cuerpo.push(new Tile(tilePosX, tilePosY, this.velocity, 'yellow', this.bodySize, tilePosX-20, tilePosY))
            tilePosX -= 20; // TODO: Check if whether of not the head should always grow to the right???
            //tilePosY -= tilePosY;    // Y does not change for the initial setup       
        }
    }
    crashWithBody(tile){
    
        let crash = false;

        if ((this.x == tile.x) && (this.y == tile.y)) crash = true;
        return crash;

    }
    crashWithOthers(otherObj){

        //console.log('s-x: '  + this.x , 's-y: ' + this.y)

        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherObj.x;
        var otherright = otherObj.x + (otherObj.width);
        var othertop = otherObj.y;
        var otherbottom = otherObj.y + (otherObj.height);
        var crash = true;

        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    resetPosition(){
        this.x = 400;
        this.y = 400;
    }
    #drawLives(x, y){

        let posX = 500;
 
        for (let index = 0; index < lives; index++) {
            posX += 25;
            const snakeImg  = new Image(); 
            snakeImg.src = './assets/king_cobra-red.png';
            ctx.drawImage(snakeImg, 1, 128, 64, 64, posX, 17, 25, 25);
            
        }    
    }
}
class Tile {

    constructor(x, y, velocity, color, letter, previousX, previousY){

        this.color = color;

        // position on canvas
        this.x = x;
        this.y = y;

        this.prevX = previousX;
        this.prevY = previousY;

        this.width = 20;
        this.height = 20;

        this.velocity = velocity;

        // Defines movement direction of snake
        this.move = DIRECTION.STOPPED;

        this.letter = letter;

        this.snapped = false;
    }
    draw(){

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,255)';
        ctx.font = "10pt sans-serif";
        ctx.strokeText(this.letter, this.x+3, this.y+15);
        ctx.restore();
    }
    update(posX, posY){

        // console.log("Tile.update.enter-> " + this.prevX  + ", " + this.prevY + " / " + (this.x) + ", " + (this.y) + " / " + (posX) + ", " + (posY));

        // save my current postion & velocity
        this.prevX = this.x;
        this.prevY = this.y;

        // set my new postion
        this.x = posX;
        this.y = posY;
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
    update(newMessage){
        if (newMessage != undefined){
            this.message = newMessage;
        }

    }
}
class Vitamina{

   particles = [];

    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.color = color;

        this.width = 20;
        this.height = 20;
    }
    draw(){

        // Draw particles
        this.particles.forEach((particle, particleIndex) => {

            if (particle.alpha <= 0) {
                // after alpha hit < 0 the particle reappears on the screen. 
                // let's make sure that does not happen
                this.particles.splice(particleIndex, 1)
            } else {
                // console.log("show particles on screeen")
                // console.log(particle);

                particle.update();
                particle.draw();    
            }
        })

        // creating rectangle
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "transparent"; //make it transparent
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();
        ctx.restore();
 
        //drawApple(this.x, this.y);
        this.#drawImage(this.x, this.y)

    }
    splashIt(){

        // console.log("Boom - Enemy Splased!!!")
    
        for (let index = 0; index < 8   ; index++) {
            // particles.push(new Particle(target.x, target.y, 3, {x: Math.random()-0.5, y: Math.random()-0.5}, color))    
            this.particles.push(new Particle(this.x, this.y, 3,   {x: (Math.random())*10-5, y: (Math.random())*10-5}, 'red'))    
        }
        // console.log(particles)
    }
    update(){

    }
    move(){
   
        this.x = Math.floor(Math.random() * canvas.width-40);
        this.y = Math.floor(Math.random() * canvas.height-40);

        //ensure to discount the dashboard space 
        if(this.y < 60  ||  this.y > canvas.height) this.y = 80;
        if(this.x < 20  ||  this.x > canvas.width) this.x = 80;
            
    }
    #drawImage(x, y){

     //   var img = document.getElementById("source");  // Image implementation (both work with not error by the image does not show)
        const appleImg  = new Image();
        appleImg.src = './assets/jabolko(red)-48.png';
        ctx.drawImage(appleImg, 1, 1, 100, 120, x-6, y-6, 70, 70);
            
    }

}
class Particle {

    constructor(x, y, radius, velocity, color){

        this.radius = radius;
        this.color = color;

        this.x = x;
        this.y = y;

        this.velocity = velocity;
        this.alpha = 1;
    }
    draw(){
        ctx.save();
        canvas.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    update(){
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -=  0.10 ;
    }
}
class Stopwatch {
    constructor(id, delay=100) { //Delay in ms ->
      this.state = "paused";
      this.delay = delay;
      this.display = document.getElementById(id);
      this.value = 0;
    }
    
    formatTime(ms) {
      var hours   = Math.floor(ms / 3600000);
      var minutes = Math.floor((ms - (hours * 3600000)) / 60000);
      var seconds = Math.floor((ms - (hours * 3600000) - (minutes * 60000)) / 1000);
      var ds = Math.floor((ms - (hours * 3600000) - (minutes * 60000) - (seconds * 1000))/100);
   
      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds+'.'+ds;
    }
    
    update() {
      if (this.state=="running") {
        this.value += this.delay;
      }

      return this.formatTime(this.value);
    }
    
    start() {
      if (this.state=="paused") {
        this.state="running";
        if (!this.interval) {
          var t=this;
          this.interval = setInterval(function(){t.update();}, this.delay);
        }
      }
    }
    
    stop() {
         if (this.state=="running") {
        this.state="paused";
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
         }
    }
    
    reset() {
      this.stop();
      this.value=0;
      this.update();
    }
  }
class SoundPlayer{
    //Used to play sound when requested
    #beepSound;                   
    
    constructor(id, source){

        //Allow for playing sound
        this.#beepSound = document.getElementById(id);
        this.#beepSound.src = source;
        //(this.#beepSound);
    }
    play(){
        this.#beepSound.play();
    }
}
function gameLoop(){
    if (gamePaused==true) {
          //Finish the game
          cancelAnimationFrame(AnimationId)
          oMessageBox    = new MessageBox((canvas.width/2)-100, (canvas.height/2)-40, 200, 100, 'black', 'red', '20px Courier', 'Game Paused!');
          oMessageBox.draw('Game Paused!');
          return;
        }

    if(!gameOver && !gamePaused) {

        if(!steppedGame) requestAnimationFrame(laggedRequestAnimationFrame)

        update();
        draw();
        

    } else {

        if(lives==0){
            setGameOver();
        } else {
            resetBoard()
        }
         
    }
    oGameSoundtrack.play();

}
function draw(){
    {
        //Clear the canvas 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        oDashboard.draw();
        oTimeBox.draw();
        oScoreBox.draw("Score: " + score);
        oGameTitle.draw();
        oSnake.draw();
        oVitamin.draw();

    }
}
function update(){

    oSnake.update();
    oScoreBox.update()
    oTimeBox.update(stopWatch.update());
    
    // if player tries to move off the board Game
    console.log("Snake Postions -> x: " + oSnake.x + " y: " + oSnake.y);
    if(oSnake.y <= dashboardHeight-20 || oSnake.y == canvas.height){
        // oSnake.y = oSnake.previousY;
        // oSnake.update();
        // oSnake.draw();
       
        oCrash.play();
        gameOver = true;
        lives--;

    } else if(oSnake.x < 0 || oSnake.x > canvas.width-20){
       // oSnake.x = canvas.width-20;
        oCrash.play();
        gameOver = true;
        lives--;
    }
    if(oSnake.crashWithOthers (oVitamin)) {

        // circle explosion
        oEat.play();
        oVitamin.splashIt();
        oVitamin.move();
        addScore();
        oScoreBox = new MessageBox(20, 10, 130, 40, 'orange', 'white', '20px Courier', 'Score:' + score);
        setTimeout(function(){ oSnake.grow(1);}, 1000);
    }

    // si la cabeza de la snake toca una de las partes de su cuerpo(empezando despues de 2), game over.

    for ( let index = 2; index < oSnake.cuerpo.length; index++) {

        var tile = oSnake.cuerpo[index];

        if (oSnake.crashWithBody(tile)) {
            oCrash.play();
            gameOver = true;
            lives--;
        }
    }
}
function ProcessUserCommands(key){

    if ((key.keyCode === 32)  && (running == true)){

        // reset pause the game
        gamePaused = !gamePaused;

        if(gamePaused) {
            stopWatch.stop();
        } else{
            stopWatch.start();
            lives=0;
        }
        gameLoop();
        return;

    } else if(running === false){

        // game started
        running = true;
        gamePaused = false;
        stopWatch.start();
        if (!steppedGame) requestAnimationFrame(laggedRequestAnimationFrame)
        oSnake.move = DIRECTION.RIGHT; 
    }

    switch (true) {
        
        // Handle scape as game over
        case (key.keyCode === 27):      
            if (!gamePaused) gameOver = true;
            break;

        // Handle up arrow and w input
        case (key.keyCode === 38 || key.keyCode === 87) && oSnake.move != DIRECTION.DOWN: 
            oSnake.move = DIRECTION.UP;
            //update();
            break;

        // Handle down arrow and s input
        case (key.keyCode === 40 || key.keyCode === 83) && oSnake.move != DIRECTION.UP:
            oSnake.move = DIRECTION.DOWN;
            //update();
            break;
        
        // Handle left arrow and a input
        case (key.keyCode === 37 || key.keyCode === 65) && oSnake.move != DIRECTION.RIGHT:
            oSnake.move = DIRECTION.LEFT;
            //update();
            break;

        // Handle right arrow and d input
        case (key.keyCode === 39 || key.keyCode === 68)  && oSnake.move != DIRECTION.LEFT:
            oSnake.move = DIRECTION.RIGHT;
            //update();
            break;

        default:
            break;
    }
    if(steppedGame) gameLoop();
}
function getTime(){

    let clock = today.getHours().toString()   + ":" + 
                today.getMinutes().toString() + ":" + 
                today.getSeconds().toString();
    
                return clock;
}
var fps = 10; 
// Article reference: http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
function laggedRequestAnimationFrame(timestamp){
    setTimeout(function(){ //throttle requestAnimationFrame to 20fps
        AnimationId = requestAnimationFrame(gameLoop);
    }, 1000/fps)
}
function recCollisionDectetion(targetA, targetB) {
    return !(targetB.x > (targetA.x + targetA.width) || 
             (targetB.x + targetB.width) < targetA.x || 
             targetB.y > (targetA.x + targetA.height) ||
             (targetB.y + targetB.height) < targetA.y);
}
function circleCollisionDetection(circle1, circle2){

    // Article reference: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection

    var dx = (circle1.x + circle1.radius) - (circle2.x + circle2.radius);
    var dy = (circle1.y + circle1.radius) - (circle2.y + circle2.radius);
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.radius + circle2.radius) {
        // collision detected!
        // this.color = "green";
        return true;
    } else {
        // no collision
        // this.color = "blue";
        return false;
    }
}
// return true if the rectangle and circle are colliding
function RectToCircleColliding(circle, rect){

    // console.log("cicle: x-" + circle.x + " y-" + circle.y);

    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}
function setGameOver(){

    // Finish the game
    cancelAnimationFrame(AnimationId)
    oGameOver.play();
        
    oMessageBox = new MessageBox((canvas.width/2)-100, (canvas.height/2)-40, 200, 80, 'black', 'red', "20px Courier", "Game Over!!!");
    oMessageBox.draw("GameOver");
    
}
function addScore(){
    score += 5;
}
function generateRandomColor(){
     // Creating of Colors  ramdon
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
    //random color will be freshly served
}
function resetBoard(){

    let bodySize = oSnake.bodySize;
    
    oSnake.resetPosition();
    //oSnake.grow(bodySize);
    oVitamin.move();
   
    gameOver = false;
    gamePaused = false;
    
    gameLoop();
}
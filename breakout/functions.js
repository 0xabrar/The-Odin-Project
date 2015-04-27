$(function() {
		
	var canvas = $("canvas")[0];
	var context = canvas.getContext('2d');

	// Sound content kept here.
	var bouncingSound = new Audio("bounce.mp3");
	var breakingSound = new Audio("break.mp3");

	// Set default information for the paddle.
	var paddleX = 200;
	var paddleY = 460;

	var paddleWidth = 100;
	var paddleHeight = 15;


	function drawPaddle() {
		context.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);
	}


	// Set default inforamtion for the ball. 
	var ballX = 300;
	var ballY = 300;
	var ballRadius = 10;

	// Draw circul for 2PI radians, which makes for a full circle. 
	function drawBall() {
		context.beginPath();
		context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, true);
		context.fill();
	}


	// Begin creating bricks.
	var bricksPerRow = 8;
	var brickHeight = 20;
	var brickWidth = canvas.width/bricksPerRow;

	// Brick layout: 1 orange, 2 green, 3 gray, 0 no brick
	var bricks = [
		[1,	1, 1, 1, 1, 1, 1, 2],
		[1,	1, 3, 1, 1, 1, 1, 1],
		[2,	1, 2, 1, 2, 1, 1, 1],
		[1,	2, 1, 1, 1, 3, 1, 1],
	];

	// Iterate through bricks and draw each brick using drawBrick()
	function createBricks() {
		for (var i = 0; i < bricks.length; i++) {
			for (var j = 0; j < bricks[i].length; j++) {
				drawBrick(j, i, bricks[i][j]);
			}
		}
	}	

	// Draw a single brick.
	function drawBrick(x, y, type){   
	    switch(type){ 
	    	case 1:
	    	context.fillStyle = 'orange';
	    	break;
	    	case 2:
	    	context.fillStyle = 'rgb(100,200,100)';                     
	    	break;
	    	case 3:
	    	context.fillStyle = 'rgba(50,100,50,.5)';
	    	break;                              
	    	default:
	    	context.clearRect(x*brickWidth,y*brickHeight,brickWidth,brickHeight);
	    	break;

	    }
	    if (type){
	        //Draw rectangle with fillStyle color selected earlier and black border. 
	        context.fillRect(x*brickWidth,y*brickHeight,brickWidth,brickHeight);
	        context.strokeRect(x*brickWidth+1,y*brickHeight+1,brickWidth-2,brickHeight-2);
	    } 
	}  

	var score = 0;
	function displayScoreBoard() {
		// Set the text and its colour.
		context.fillStyle = 'black';
		context.font = "20px Times New Roman";

		// Place text at the bottom of the screen.
		context.clearRect(0, canvas.height - 30, canvas.width, 30);
		context.fillText("Score: " + score, 10, canvas.height - 5);
	}


	drawBall();
	drawPaddle();
	createBricks();
	displayScoreBoard();


	// TODO: begin animating

	var ballDeltaY;
	var ballDeltaX;

	var paddleMove;
	var paddleDeltaX;
	var paddleSpeedX = 10;


	function moveBall() {

		if (ballY + ballDeltaY - ballRadius < 0 || collisionYWithBricks()) {
			ballDeltaY = -ballDeltaY;
			bouncingSound.play();
		}

		if (ballY + ballRadius > canvas.height) {
			endGame();
		}

		if ((ballX + ballDeltaX + ballRadius> canvas.width) || 
			(ballX + ballDeltaX - ballRadius < 0) || collisionXWithBricks()) {
			ballDeltaX = -ballDeltaX;
			bouncingSound.play();
		}

		// Bottom of the ball reaches top of the padddle area.
		if (ballY + ballDeltaY + ballRadius >= paddleY) {
			// Ball is positioned between the 2 ends of the paddle. 
			if (ballX + ballDeltaX >= paddleX &&
				ballX + ballDeltaX <= paddleX + paddleWidth) {
				bouncingSound.play();
				ballDeltaY = -ballDeltaY;
			}
		}

		ballX = ballX + ballDeltaX;
		ballY = ballY + ballDeltaY;
	}

	function animate() {
		context.clearRect(0, 0, canvas.width, canvas.height);

		createBricks();
		displayScoreBoard();

		moveBall();
		movePaddle();
		drawPaddle();
		drawBall();
	}

	function movePaddle() {
		if (paddleMove == "LEFT") {
			paddleDeltaX = -paddleSpeedX;
		} else if (paddleMove == "RIGHT") {
			paddleDeltaX = paddleSpeedX;
		} else {
			paddleDeltaX = 0;
		}

		// Check that the paddle has not moved off of the screen. 
		if (paddleX + paddleDeltaX < 0 || paddleX + paddleDeltaX + 
			paddleWidth > canvas.width) {
			paddleDeltaX = 0;
		}
		paddleX = paddleX + paddleDeltaX;
	}

	function startGame() {
		ballDeltaX = -4; 
		ballDeltaY = -2;
		paddleMove = "NONE";
		gameLoop = setInterval(animate, 20);

		//Track user keystrokes in order to move the paddle accordingly. 
		$(document).keydown(function(e) {
			if (e.keyCode == 39) {
				paddleMove = "RIGHT";
			} else if (e.keyCode == 37) {
				paddleMove = "LEFT";
			}
		});

		$(document).keyup(function(e) {
			if (e.keyCode == 39) {
				paddleMove = "NONE"; 
			} else if (e.keyCode == 37) {
				paddleMove = "NONE";
			}
		});
	}

	function endGame() { 
		clearInterval(gameLoop);
		context.fillText("The end!", canvas.width / 2, canvas.height / 2);
	}

	startGame();

		function collisionXWithBricks(){
	    var bumpedX = false;    
	    for (var i=0; i < bricks.length; i++) {
	        for (var j=0; j < bricks[i].length; j++) {
	            if (bricks[i][j]){ // if brick is still visible
	                var brickX = j * brickWidth;
	                var brickY = i * brickHeight;
	                if (
	                    // barely touching from left
	                    ((ballX + ballDeltaX + ballRadius >= brickX) &&
	                    (ballX + ballRadius <= brickX))
	                    ||
	                    // barely touching from right
	                    ((ballX + ballDeltaX - ballRadius <= brickX + brickWidth)&&
	                    (ballX - ballRadius >= brickX + brickWidth))
	                    ){      
	                    if ((ballY + ballDeltaY -ballRadius <= brickY + brickHeight) &&
	                        (ballY + ballDeltaY + ballRadius >= brickY)){                                                    
	                        // weaken brick and increase score
	                        explodeBrick(i,j);

	                        bumpedX = true;
	                    }
	                }
	            }
	        }
	    }
	        return bumpedX;
	}               

	function collisionYWithBricks(){
	    var bumpedY = false;
	    for (var i=0; i < bricks.length; i++) {
	        for (var j=0; j < bricks[i].length; j++) {
	            if (bricks[i][j]){ // if brick is still visible
	                var brickX = j * brickWidth;
	                var brickY = i * brickHeight;
	                if (
	                    // just touching from below
	                    ((ballY + ballDeltaY - ballRadius <= brickY + brickHeight) && 
	                    (ballY - ballRadius >= brickY + brickHeight))
	                    ||
	                    // barely touching from above
	                    ((ballY + ballDeltaY + ballRadius >= brickY) &&
	                    (ballY + ballRadius <= brickY ))){
	                    if (ballX + ballDeltaX + ballRadius >= brickX && 
	                        ballX + ballDeltaX - ballRadius <= brickX + brickWidth){                                      
	                        // weaken brick and increase score
	                        explodeBrick(i,j);                          
	                        bumpedY = true;
	                    }                       
	                }
	            }
	        }
	    }
	    return bumpedY;
	}

	function explodeBrick(i,j){
	    // First weaken the brick (0 means brick has gone)
	    bricks[i][j] --;

	    // Brick still exists. 
	    if (bricks[i][j]>0){ 
	        score++;
	    } else {
	        // Brick disappears
	        score += 2;     
	        breakingSound.play();
	    }
	}



});
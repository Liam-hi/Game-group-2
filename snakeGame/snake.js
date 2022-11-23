"use strict";
//Show the score
document.addEventListener("DOMContentLoaded", function () {
    let score = document.querySelector("div");
    let newVal = document.createElement("p");
    newVal.innerHTML = '';
    score.appendChild(newVal);
  });

const timerEl = document.getElementById("timer");
let timer;
let timerStart;
  
//create start button element to run main and gen_food function (and hide the button) to start the game
let startButtonEl = document.getElementById("start-button");
let refreshButtonEl = document.getElementById("refresh-button");

function startGame(){ 
    timerStart = Date.now();
    startButtonEl.classList.add("hidden");
    refreshButtonEl.classList.remove("hidden");
    main();
    gen_food();
    timer = setInterval(() => {
        updateTimer();
      }, 10);
}
startButtonEl.addEventListener("click", startGame);

function updateTimer() {
    const time = Date.now() - timerStart;
    const minutes = Math.floor(time/ 1000 /60);
    const seconds = Math.floor(time / 1000) % 60;
    const centiseconds = Math.floor(time / 10) % 100;

    let displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
    let displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
    let displayCentiseconds = centiseconds < 10 ? `0${centiseconds}` : centiseconds;
  
    timerEl.innerHTML = `${displayMinutes}:${displaySeconds}:${displayCentiseconds}`;
}
//Add function to refresh-button, to start a new game
const refreshPage = () => {
    window.location.reload();
  }
  
  refreshButtonEl.addEventListener('click', refreshPage);


//get canvas element
const snakeBoard = document.getElementById("gameCanvas");
const snakeBoard_ctx = gameCanvas.getContext("2d");

//set colors for snake and board
const board_border = 'black';
const board_background = 'white';
const snake_col = 'lightblue';
const snake_border = 'darkblue';
   
//create array that is the snake
let snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
    ]

let score = 0;
// True if changing direction
let changing_direction = false;
// Horizontal velocity
let food_x;
let food_y;
// Horizontal velocity, delta x
let dx = 10;
// Vertical velocity, delta y
let dy = 0;

function drawSnakePart(snakePart) 
{  
  snakeBoard_ctx.fillStyle = 'lightblue';  
  snakeBoard_ctx.strokestyle = 'darkblue';
  snakeBoard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);  
  snakeBoard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}
 
/*Function that prints the parts*/
function drawSnake() 
{  
  snake.forEach(drawSnakePart);
}

document.addEventListener("keydown", change_direction);
    
    // main function called repeatedly to keep the game running
    function main() {  
        if (has_game_ended()) {
            alert("Game over!");
            clearInterval(timer);
            return;
        }

        else {
            changing_direction = false;
            setTimeout(function onTick() 
            {    
                clearCanvas(); 
                drawFood();   
                moveSnake();  
                drawSnake();
                // Call main again, recursive method
                main();
            }, 100)
        }
    }
    
    // draw a border around the canvas
    function clearCanvas() {
      //  Select the colour to fill the drawing
      snakeBoard_ctx.fillStyle = board_background;
      //  Select the colour for the border of the canvas
      snakeBoard_ctx.strokestyle = board_border;
      // Draw a "filled" rectangle to cover the entire canvas
      snakeBoard_ctx.fillRect(0, 0, snakeBoard.width, snakeBoard.height);
      // Draw a "border" around the entire canvas
      snakeBoard_ctx.strokeRect(0, 0, snakeBoard.width, snakeBoard.height);
    }
    
    // Draw the snake on the canvas
    function drawSnake() {
      // Draw each part
      snake.forEach(drawSnakePart)
    }

    function drawFood() {
        snakeBoard_ctx.fillStyle = 'lightgreen';
        snakeBoard_ctx.strokestyle = 'darkgreen';
        snakeBoard_ctx.fillRect(food_x, food_y, 10, 10);
        snakeBoard_ctx.strokeRect(food_x, food_y, 10, 10);
      }
    
    // Draw one snake part
    function drawSnakePart(snakePart) {

      // Set the colour of the snake part
      snakeBoard_ctx.fillStyle = snake_col;
      // Set the border colour of the snake part
      snakeBoard_ctx.strokestyle = snake_border;
      // Draw a "filled" rectangle to represent the snake part at the coordinates
      // the part is located
      snakeBoard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
      // Draw a border around the snake part
      snakeBoard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }

    //Set parameters to see if snake hits wall or self
    function has_game_ended() {
        for (let i = 4; i < snake.length; i++) {
          if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
        }
        const hitLeftWall = snake[0].x < 0;
        const hitRightWall = snake[0].x > snakeBoard.width - 10;
        const hitToptWall = snake[0].y < 0;
        const hitBottomWall = snake[0].y > snakeBoard.height - 10;
        return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
      }

      //Generate random number between min and max
      function random_food(min, max) {
        return Math.round((Math.random() * (max-min) + min) / 10) * 10;
      }
  
      function gen_food() {
        // Generate a random number the food x-coordinate
        food_x = random_food(0, snakeBoard.width - 10);
        // Generate a random number for the food y-coordinate
        food_y = random_food(0, snakeBoard.height - 10);
        // if the new food location is where the snake currently is, generate a new food location
        snake.forEach(function has_snake_eaten_food(part) {
          const has_eaten = part.x == food_x && part.y == food_y;
          if (has_eaten) gen_food();
        });
      }

      //Naming keys, connecting them to keyboard number
    function change_direction(event) {
        const LEFT_KEY = 37;
        const RIGHT_KEY = 39;
        const UP_KEY = 38;
        const DOWN_KEY = 40;

        // Prevent the snake from reversing
    
        if (changing_direction) return;

        else {
            changing_direction = true;
            const keyPressed = event.keyCode;
            const goingUp = dy === -10;
            const goingDown = dy === 10;
            const goingRight = dx === 10;
            const goingLeft = dx === -10;
        
            if (keyPressed === LEFT_KEY && !goingRight) {
                dx = -10;
                dy = 0;
            }
            if (keyPressed === UP_KEY && !goingDown) {
                dx = 0;
                dy = -10;
            }
            if (keyPressed === RIGHT_KEY && !goingLeft) {
                dx = 10;
                dy = 0;
            }
            if (keyPressed === DOWN_KEY && !goingUp) {
                dx = 0;
                dy = 10;
            }
        }
    }

    function moveSnake() {
        // Create the new Snake's head
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        // Add the new head to the beginning of snake body
        snake.unshift(head);
        const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
        if (has_eaten_food) {
          // Increase score
          score += 10;
          // Display score on screen
          document.getElementById('score').innerHTML = score;
          // Generate new food location
          gen_food();
        } else {
          // Remove the last part of snake body
          snake.pop();
        }
      }

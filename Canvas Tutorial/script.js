/**
 * Created with JetBrains WebStorm.
 * User: Kappy
 * Date: 8/22/13
 * Time: 4:20 PM
 * To change this template use File | Settings | File Templates.
 */

// Credit to Bill Mill for this tutorial at
// http://billmill.org/static/canvastutorial/

//region Initialize variables
var score = 0;
var highScore;

var gameOver = false;
var playAgain;

var canvasRef;
var width, height;

var paddleX;
var paddleH = 10;
var paddleW = 75;
var paddleColor = "F0710B";

var bricks, brickWidth, rowHeight, colWidth, row, col;
var rows = 5;
var cols = 5;
var brickHeight = 15;
var padding = 1;
var rowColors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];

var ballX, ballY, dx, dy;
var ballR = 10;
var ballColor = "#FFFFFF";


var rightDown = false;
var leftDown = false;

var intervalID = 0;
//endregion

$(document).ready(function ()
{
    //region Ugly way to draw
    /*canvasRef = $('#canvas')[0].getContext("2d");

    canvasRef.beginPath();
    canvasRef.arc(75, 75, 10, 0, Math.PI * 2, true);
    canvasRef.closePath();
    canvasRef.fill();

    function init()
    {
        canvasRef = $('#canvas')[0].getContext("2d");
        return setInterval(draw, 10);
    }
    function draw()
    {
        canvasRef.clearRect(0, 0, 300, 300);
        canvasRef.beginPath();
        canvasRef.arc(x, y, 10, 0, Math.PI * 2, true);
        canvasRef.closePath();
        canvasRef.fill();
        x += dx;
        y += dy;
    }

    init();*/
    //endregion

    //region Clean way

    function init()
    {
        canvasRef = $('#canvas')[0].getContext("2d");

        width = $('#canvas').width();
        height = $('#canvas').height();

        score = 0;

        ballX = 25;
        ballY = 250;
        dx = 2;
        dy = -3;
        paddleX = width / 2;

        rightDown = false;
        leftDown = false;

        brickWidth = (width / cols) - 1;
        rowHeight = brickHeight + padding;
        colWidth = brickWidth + padding;

        bricks = new Array(rows);
        for(var i = 0; i < rows; i++)
        {
            bricks[i] = new Array(cols);
            for(var j = 0; j < cols; j++)
            {
                bricks[i][j] = 1;
            }
        }
    }

    //region Keyboard functionality
    function  onKeyDown(e)
    {
        if(e.keyCode === 39)
        {
            rightDown = true;
        }
        else if(e.keyCode === 37)
        {
            leftDown = true;
        }
    }

    function onKeyUp(e)
    {
        if(e.keyCode === 39)
        {
            rightDown = false;
        }
        else if(e.keyCode === 37)
        {
            leftDown = false;
        }
    }

    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);
    //endregion

    //region Draw functions
    function drawCircle(x, y, r)
    {
        canvasRef.beginPath();
        canvasRef.arc(x, y, r, 0, Math.PI * 2, true);
        canvasRef.closePath();
        canvasRef.fill();
    }

    function drawRect(x, y, w, h)
    {
        canvasRef.beginPath();
        canvasRef.rect(x, y, w, h);
        canvasRef.closePath();
        canvasRef.fill()
    }

    function drawBricks()
    {
        for(var i = 0; i < rows; i++)
        {
            canvasRef.fillStyle = rowColors[i];
            for(var j = 0; j< cols; j++)
            {
                if(bricks[i][j] === 1)
                {
                    drawRect((j * (brickWidth + padding)) + padding, (i * (brickHeight + padding)) + padding,
                        brickWidth, brickHeight);
                }
            }
        }
    }
    //endregion

    function clear()
    {
        canvasRef.clearRect(0, 0, width, height);
    }

    //The game loop
    function update()
    {
        clear();

        if(gameOver === true)
        {
            init();
            gameOver = false;
        }

        $('#score').html("Score: " + score);
        canvasRef.fillStyle = ballColor;
        drawCircle(ballX, ballY, ballR);

        canvasRef.fillStyle = paddleColor;
        drawRect(paddleX, height - paddleH, paddleW, paddleH);

        drawBricks();

        //region Game mechanic - Destroying bricks
        row = Math.floor(ballY / rowHeight) - 1; col = Math.floor(ballX / colWidth);

        if((ballY - ballR) < (rows * rowHeight) && row >= 0 && col >= 0 && bricks[row][col] === 1)
        {
            dy = -dy; bricks[row][col] = 0;

            if(row === 4)
            {
                score += 10;
            }

            if(row === 3)
            {
                score += 30;
            }

            if(row === 2)
            {
                score += 55;
            }

            if(row === 1)
            {
                score += 75;
            }

            if(row === 0)
            {
                score += 100;
            }
        }

        //Keyboard functionality
        if(rightDown && (paddleX + paddleW ) < width)
        {
            paddleX += 4;
        }
        else if(leftDown && paddleX > 0)
        {
            paddleX -= 4;
        }

        //region Ball animation
        if((ballX + dx + ballR) > width || (ballX + dx - ballR) < 0)
        {
            dx = -dx;
        }

        if((ballY + dy - ballR) < 0)
        {
            dy = -dy;
        }
        else if((ballY + dy + ballR) > (height - paddleH))
        {
            //If ball hits the paddle
            if(ballX > paddleX && ballX < (paddleX + paddleW))
            {
                dx = 8 * ((ballX - (paddleX + (paddleW / 2))) / paddleW);
                dy = -dy;
            }
            else if(ballY + dy + ballR > height)
            {
                //Game Over
                gameOver = true;
                playAgain = prompt("GAME OVER! Play again? (Y/N)").toLowerCase();

                if(playAgain[0] === "n")
                {
                    clearInterval(intervalID);
                }
            }
        }

        ballX += dx;
        ballY += dy;
        //endregion
    }
    //endregion

    init();
    intervalID = setInterval(update, 10);
    //endregion

    //region Canvas Tutorial Shading/Color demo
    /*var ctx = $('#canvas')[0].getContext("2d");

    ctx.fillStyle = "#00A308";
    ctx.beginPath();
    ctx.arc(220, 220, 50, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#FF1C0A";
    ctx.beginPath();
    ctx.arc(100, 100, 100, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();

    //the rectangle is half transparent
    ctx.fillStyle = "rgba(255, 255, 0, .5)"
    ctx.beginPath();
    ctx.rect(15, 150, 120, 120);
    ctx.closePath();
    ctx.fill();*/
    //endregion
});

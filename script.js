var c = document.getElementById("automata");
var ctx = c.getContext("2d");

// var randbool = Math.random() < 0.5;

var boxw = 10;
var boxh = 10;
var posx = 0;
var posy = 0;

var playerx = 306;
var playery = 306;
var speed = 5;
var lifespeed = 4;
var moving = false;
var velx = 0;
var vely = 0;

var fruitx = 40;
var fruity = 40;
var shootdl = false;

var gridarray = [];
var copyarray = [];
var gridsize = 50; // its 51 actually, just go with it

var counter = 0;
var dead = false;
var score = 0;
var timer = 100;

startGrid();
spawnFruit();

// setInterval(doGrid, 200);
setInterval(drawScreen, 10);

window.addEventListener('keydown',doKeyDown,true);
window.addEventListener('keyup',doKeyUp,true);

function drawScreen() {
    document.getElementById("score").innerHTML = "<span class=\"label\">SCORE</span>" + score.toString();
    document.getElementById("timer").innerHTML = timer.toString() + "<span class=\"label\">TIME</span>";

    if(dead) {
        ctx.font = "40px Arial";
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4;
        ctx.strokeText("THAT'S LIFE",playerx-110,playery-20);
        ctx.fillText("THAT'S LIFE",playerx-110,playery-20);
        ctx.font = "20px Arial";
        return; 
    }
    clear();
    counter = counter + 1;
    playerMovement();
    playerHurtbox();
    doGrid(counter); // life updates every 20 ticks (200 speed)
    if(counter >= lifespeed) { 
        timer = timer - 1;
        counter = 0; 
    }
    ctx.fillStyle = "#F0A";
    playerCircle(playerx,playery,5);
    drawFruit();

    if(timer == 0) {
        dead = true;
    }
}

function playerCircle(x,y,radius) { // circle path
    ctx.beginPath();
    ctx.arc(x,y,radius,0,Math.PI*2,true);
    ctx.fill();
}

function clear() { // clear space between grid squares
    for(var i = 0; i < 612; i += 1) {
        if(i % 12 == 11) { ctx.clearRect(0,i,612,2); ctx.clearRect(i,0,2,612); }
        else if(i == 0 || i == 611) { ctx.clearRect(0,i,612,1); ctx.clearRect(i,0,1,612); }
    }
}

function playerMovement() { // handle player's controls
    var movey = playery+vely*speed;
    var movex = playerx+velx*speed;
    if(movey > 6 && movey < 606) { playery = movey; }
    else { playery = clampNumber(movey, 6, 606); }
    if(movex > 6 && movex < 606) { playerx = movex; }
    else { playerx = clampNumber(movex, 6, 606); }
}

function playerHurtbox() { // draw hurtbox and its collision
    var left = playerx-1;
    var top = playery-1;
    var right = playerx+1;
    var bot = playery+1;

    var gridleft = Math.floor(left/12);
    var gridtop = Math.floor(top/12);
    var gridright = Math.floor(right/12);
    var gridbot = Math.floor(bot/12);

    var size = 12;
    var collision = gridarray[gridtop][gridleft] + 
                    gridarray[gridtop][gridright] + 
                    gridarray[gridbot][gridleft] + 
                    gridarray[gridbot][gridright];
    // console.log(collision + " . " + gridleft + " " + gridright + " " + gridtop + " " + gridbot);

    if (collision >= 1) {
        dead = true;
    }

    // ctx.strokeStyle = "yellow";
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.moveTo(gridleft*12,gridtop*12);
    // ctx.lineTo(gridright*12+size,gridtop*12);
    // ctx.lineTo(gridright*12+size,gridbot*12+size);
    // ctx.lineTo(gridleft*12,gridbot*12+size);
    // ctx.lineTo(gridleft*12,gridtop*12);
    // ctx.stroke();
}

function playerShoot(dirx, diry, key) {
    var gridy = Math.floor(playerx/12)+dirx;
    var gridx = Math.floor(playery/12)+diry;
    
    copyarray[gridx][gridy] = 1;
    switch(key) {
        case 'u':
            copyarray[gridx+1][gridy+1] = 1;
            copyarray[gridx-1][gridy] = 1;
            copyarray[gridx][gridy-1] = 1;
            copyarray[gridx+1][gridy-1] = 1;
            break;
        case 'j':
            copyarray[gridx-1][gridy+1] = 1;
            copyarray[gridx+1][gridy] = 1;
            copyarray[gridx][gridy-1] = 1;
            copyarray[gridx-1][gridy-1] = 1;
            break;
        case 'o':
            copyarray[gridx+1][gridy-1] = 1;
            copyarray[gridx-1][gridy] = 1;
            copyarray[gridx][gridy+1] = 1;
            copyarray[gridx+1][gridy+1] = 1;
            break;
        case 'l':
            copyarray[gridx-1][gridy-1] = 1;
            copyarray[gridx+1][gridy] = 1;
            copyarray[gridx][gridy+1] = 1;
            copyarray[gridx-1][gridy+1] = 1;
            break;
    }
}

function doKeyDown(e) {
    if(!e.repeat && vely >= -1 && vely <= 1 && velx >= -1 && velx <= 1) {
        var distance = 3;

        switch (e.keyCode) {
            case 87: //w
                vely = -1;
                break;
            case 83: //s
                vely = 1;
                break;
            case 65: //a
                velx = -1;
                break;
            case 68: //d
                velx = 1;
                break;
            case 32: //space
                score = 0;
                startGrid();
                break; 
            case 85: //u
                playerShoot(distance*-1,distance*-1, 'u');
                break;
            case 74: //j
                playerShoot(distance*-1,distance, 'j');
                break;
            case 79: //o
                playerShoot(distance,distance*-1, 'o');
                break;
            case 76: //l
                playerShoot(distance,distance, 'l');
                break;
        }
    }
}

function doKeyUp(e) {
    switch(e.keyCode) {
        case 87:
            if(vely == -1) { vely = 0; }
            break;
        case 83:
            if(vely == 1) { vely = 0; }
            break;
        case 65:
            if(velx == -1) { velx = 0; }
            break;
        case 68:
            if(velx == 1) { velx = 0; }
            break;
    }
}


function doGrid(counter) { // big grid function
    if(counter>=lifespeed) {
        gridarray = structuredClone(copyarray);
    }

    for(var x = 0; x <= gridsize; x += 1) {
        posy = x*12+1;
        for(var y=0; y <= gridsize; y += 1) {
            posx = y*12+1;

            if(counter>=lifespeed) {
                copyarray[x][y] = rulesEnforcer(nearbyCells(x,y),gridarray[x][y]);
            }

            if(gridarray[x][y] == 0 && copyarray[x][y] == 0) { ctx.fillStyle = "#112"; }
            else if(gridarray[x][y] == 0 ) { ctx.fillStyle = "#116"; }
            else if(copyarray[x][y] == 0) { ctx.fillStyle = "#599"; }
            else { ctx.fillStyle = "#8CC"; }
            ctx.fillRect(posx,posy,boxw,boxh);
            ctx.stroke();
        }
    }
}

function startGrid() { // initialize 2d array at defined size with randomized cells
    playerx = 306;
    playery = 306;
    timer = 100;
    dead = false;
    
    for(var x = 0; x <= gridsize; x += 1) {
        gridarray[x] = [];
        copyarray[x] = [];
        for(var y = 0; y <= gridsize; y += 1) {
            gridarray[x][y] = 0; 
            copyarray[x][y] = gridarray[x][y];
        }
    }
}

function spawnFruit() {
    var tempx = randomCoord()+5;
    var tempy = randomCoord()+5;
    timer = timer + 15;

    while(gridarray[tempx][tempy] == 1) {
        tempx = randomCoord()+5;
        tempy = randomCoord()+5;
    }

    fruitx = tempx;
    fruity = tempy;
}

function drawFruit() {
    var size = 12;

    if(gridarray[fruity][fruitx] == 1) {
        copyarray[fruity][fruitx] = 0;
        copyarray[fruity+1][fruitx] = 0;
        copyarray[fruity-1][fruitx] = 0;
        copyarray[fruity+2][fruitx] = 1;
        copyarray[fruity-2][fruitx] = 1;
        copyarray[fruity+1][fruitx+1] = 1;
        copyarray[fruity+1][fruitx-1] = 1;
        copyarray[fruity-1][fruitx-1] = 1;
        copyarray[fruity-1][fruitx+1] = 1;
        copyarray[fruity][fruitx+1] = 1;
        copyarray[fruity][fruitx+2] = 1;
        copyarray[fruity][fruitx-1] = 1;
        copyarray[fruity][fruitx-2] = 1;

        score += 1;
        spawnFruit();
    }

    ctx.strokeStyle = "yellow";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(fruitx*12,fruity*12);
    ctx.lineTo(fruitx*12+size,fruity*12);
    ctx.lineTo(fruitx*12+size,fruity*12+size);
    ctx.lineTo(fruitx*12,fruity*12+size);
    ctx.lineTo(fruitx*12,fruity*12);
    ctx.stroke();
}

function rulesEnforcer(total, cell) { // automata rules. currently, conway's game of life.
    if(total < 2) { cell = 0; }
    else if(total > 3) { cell = 0; }
    else if(total == 3) { cell = 1; }
    return cell;
}

/* life rules
    Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    Any live cell with two or three live neighbours lives on to the next generation.
    Any live cell with more than three live neighbours dies, as if by overpopulation.
    Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

    live < 2 : 0
    live > 3 : 0
    dead = 3 : 1
*/

function nearbyCells(x, y) { // check all nearby cells according to automata scale and return total value

    var left = x-1;
    var right = x+1;
    if (x == 0) { left = 50; }
    else if (x == 50) { right = 0; }
    var up = y-1;
    var down = y+1;
    if (y == 0) { up = 50 }
    else if (y == 50) { down = 0; }

    var total =
        gridarray[left][up] +
        gridarray[x][up] +
        gridarray[right][up] +
        gridarray[left][y] +
        gridarray[right][y] +
        gridarray[left][down] +
        gridarray[x][down] +
        gridarray[right][down];

    return total;
}

function randomCoord() { // a random cell
    return Math.floor(Math.random() * 41);
}

function clampNumber(num, a, b) {
    return Math.max(Math.min(num, Math.max(a, b)), Math.min(a, b));
}
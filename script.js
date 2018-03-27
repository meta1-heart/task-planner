var canvas, context;
var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;

//document.addEventListener("DOMContentLoaded", main, true);


var tasks = new Array();
var tasksAmount = 50;
var size = WIDTH / 100;
var spaceSize = size * 0.1;
var fullSize = size + spaceSize;
var expectationLenght = 15;
var lambda = 5000; // task coming intensivity 
var solvingTime = 0.5; // in seconds
var sigma = 3;
var multiplier = 1;
var isStarted = false;


function Task() {
    this.x = 0;
    this.y = 0;
    this.t0 = 0;
    this.L = 0;
    this.number = 0;
}


function main(){
        if (!isStarted) {
            prepareCanvas();
            createFirstTasks();
            Draw();
            isStarted = true;
        }
        let timer = setInterval(oneIterationStep, solvingTime * 1000);
}

function prepareCanvas() {
    canvas = document.createElement('canvas');
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
    document.body.appendChild(canvas);
    context = canvas.getContext("2d");
}

function createFirstTasks() {
    for(let i = 0; i < tasksAmount; i++) {
        let aTask = new Task();
        aTask.t0 = expTime(lambda);
        aTask.x = aTask.t0 - (aTask.t0 % (fullSize));
        let rnd = Math.random();
        aTask.y = Math.round(rnd * HEIGHT - (rnd * HEIGHT % fullSize));
        aTask.L = Math.round(multiplier * GaussRand(expectationLenght, sigma));
        aTask.number = i;
        tasks.push(aTask);
    }
}

function oneIterationStep() {
    tasks.forEach(changePosition);
    Draw();
}

function changePosition(task) {
    task.x -= fullSize;
}

function GaussRand(Mx, sigma) { // Box-Muller можно оптимизировать
    let firstRandom = 2 * Math.random() - 1;
    let secondRandom = 2 * Math.random() - 1;
    let r = firstRandom * firstRandom + secondRandom * secondRandom;
    if(r == 0 || r > 1) {
        
        return GaussRand(Mx, sigma);
    }

        return Mx + sigma * firstRandom * Math.sqrt(-2 * Math.log(r) / r);
}

function expTime(lambda) {
    
    return -lambda * Math.log(1 - Math.random());
}
    


function Draw() {
    // clear screen
    context.fillStyle = "#000000";
    context.fillRect(0, 0, WIDTH, HEIGHT);

     // line
     context.beginPath();
     context.lineWidth="1.5";
     context.strokeStyle="white"; // Purple path
     context.moveTo(fullSize * 20, 0);
     context.lineTo(fullSize * 20, HEIGHT); 
     context.stroke();

    // draw rectangles
    
    for(let i = 0; i < tasksAmount; i++) {
        for(let j = 0; j < tasks[i].L; j++) {
            if (tasks[i].x + j * fullSize  < fullSize * 20 - 1) {
                context.fillStyle = "#56f12a";
            } else {
                context.fillStyle =  "#f2d72b";
            }
            context.fillRect(j * fullSize  + tasks[i].x, tasks[i].y, size, size);
        }
    }
}
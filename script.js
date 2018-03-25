var canvas, context;
var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;

//document.addEventListener("DOMContentLoaded", main, true);


var tasks = new Array();
var tasksAmount = 50;
var size = 10;
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
        aTask.x = aTask.t0;
        aTask.y = Math.random() * HEIGHT;
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
    task.x -= size;
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
    


function Draw(){
    // clear screen
    context.fillStyle = "#000000";
    context.fillRect(0, 0, WIDTH, HEIGHT);

    // draw circles
    context.fillStyle = "#53f442";
    for(let i = 0; i < tasksAmount; i++) {
        for(let j = 0; j < tasks[i].L; j++) {
            context.fillRect(j * size * 1.1  + tasks[i].x, tasks[i].y, size, size);
        }
    }
}
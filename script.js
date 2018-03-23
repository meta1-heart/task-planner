var canvas, context;
var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;

document.addEventListener("DOMContentLoaded", main, true);


var tasks = new Array();
var tasksAmount = 30;
var size = 10;
var expectationLenght = 15;
var sigma = 3;
var multiplier = 1;


function Task() {
    this.x = 0;
    this.y = 0;
    this.t0 = 0;
    this.L = 0;
    this.number = 0;
}


function main(){
        canvas = document.createElement('canvas');
        canvas.height = HEIGHT;
        canvas.width = WIDTH;
        document.body.appendChild(canvas);
        context = canvas.getContext("2d");
        
        for(let i = 0; i < tasksAmount; i++) {
            let aTask = new Task();
            aTask.x = size * i * 2;
            aTask.y = size * i * 2;
            aTask.L = Math.round(multiplier * GaussRand(expectationLenght, sigma));
            aTask.number = i;
            tasks.push(aTask);
        }
        Draw();
}

function GaussRand(Mx, sigma) { // Box-Muller
    let firstRandom = 2 * Math.random() - 1;
    let secondRandom = 2 * Math.random() - 1;
    let r = firstRandom * firstRandom + secondRandom * secondRandom;
    if(r == 0 || r > 1) {
        
        return GaussRand(Mx, sigma);
    }

        return Mx + sigma * firstRandom * Math.sqrt(-2 * Math.log(r) / r);
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
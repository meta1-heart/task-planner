var canvas, context;
var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;

var tasks = new Array();
var tasksAmount;

var queue1 = new Array();
var queue2 = new Array();
var queue3 = new Array();
var queue4 = new Array();
var queueConstants = [0, 30, 20, 15];
var queueArray = [queue1, queue2, queue3, queue4];

var pressCounter = 0;
var completedTasksCounter = 0;

var size = HEIGHT / 100;
var spaceSize = size * 0.1;
var fullSize = size + spaceSize;
var strokePosition = 50 * fullSize;

var expectationLenght;
var lambda;
var solvingTime;
var sigma;

var isPaused = false;

var anim, timer;

class Task
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.t0 = 0;
        this.L = 0;
        this.tmax = [-1, 0];
        this.number = 0;
        this.isInQueue = false;
        this.isCompleted = false;
        this.isExecuting = false;
    }
}

function start( form )
{
    getParameters.call( form );
    prepareCanvas();
    createFirstTasks();
    main();
}

function main()
{
    /*oneIterationStep();
    timer = setTimeout( function() {
        anim = requestAnimationFrame( main );
    }, 1000 * solvingTime );*/
}

function getParameters() 
{
    tasksAmount = Number( this.tasksAmount.value );
    expectationLenght = Number( this.expectationLenght.value );
    lambda = Number( this.lambda.value );
    sigma = Number( this.sigma.value );
    solvingTime = Number( this.solvingTime.value );
}

function prepareCanvas() 
{
    canvas = document.createElement( "canvas" );
    canvas.height = HEIGHT;
    canvas.width = WIDTH;
    document.body.appendChild( canvas );
    context = canvas.getContext( "2d" );
}

function createFirstTasks() 
{
    for ( let i = 0; i < tasksAmount; i++ )  
    {
        let aTask = new Task();
        aTask.t0 = strokePosition + fullSize + expTime( lambda );
        aTask.x = aTask.t0 - ( aTask.t0 % ( fullSize ) );
        aTask.L = Math.ceil( Math.abs( GaussRand( expectationLenght, sigma ) ) );
        tasks.push( aTask );
    }
    tasks.sort( tasksSort );
    //
    for( let i = 0; i < tasksAmount; i++ )
     {
        tasks[i].number = i;
        tasks[i].y = ( ( i + 5 ) * fullSize );
    }
}


function tasksSort( task1, task2 )
{
    let x1 = task1.t0;
    let x2 = task2.t0;
    if ( x1 === x2 )
    {
        return 0;
    }

    return ( x1 > x2 ) ? 1 : -1; // по возрастанию времени
}
    

function oneIterationStep() 
{
    solveTasks();
    //
    tasks.forEach( task => checkForExecuting( task ) );
    tasks.forEach( task => checkForQueue( task ) );
    //
    Draw();
}

function solveTasks()
{
    if ( queueArray[0].length != 0 ) 
    {
        RoundRobin( queueArray[0] );
    } 
    else if ( queueArray[1].length != 0 )
    {
        RoundRobin( queueArray[1] );
    } 
    else if ( queueArray[2].length != 0 )
    {
        RoundRobin( queueArray[2] );
    } 
    else if ( queueArray[3].length != 0 )
    {
        FCFS( queueArray[3] );
    }
    tasks.forEach( task => {
        if ( !task.isInQueue ) 
        {
            changePositionX( task );
        }
        else
        {
            if ( task.tmax[1] != 0 )
            {
                if ( task.tmax[0] > 0 )
                {
                    task.tmax[0] -= 1;
                }
                if ( task.tmax[0] === 0 )
                {
                    queueArray[task.tmax[1]].splice( queueArray[task.tmax[1]].indexOf( task ), 1 );
                    queueArray[task.tmax[1] - 1].push( task );
                    task.tmax = [Math.ceil( queueConstants[task.tmax[1] - 1] * task.L ), task.tmax[1] - 1];
                    
                }
            }
        }
    });
}

function RoundRobin( queue )
{    
    changePositionX( queue[0] );
    if ( checkForCompletion( queue[0] ) )
    {
        queue.splice( 0, 1 );
    } else
    {
        queue.push( queue[0] );
        queue.splice( 0, 1 );
    }
}

function FCFS( queue )
{
    changePositionX( queue[0] );
    if ( checkForCompletion( queue[0] ) )
    {
        queue.splice( 0, 1 );
    };
}

function changePositionX( task ) 
{
    task.x -= fullSize;
}

function changePositionY( task, direction ) 
{
    task.y -= 10 * direction * fullSize;
}

function checkForCompletion( task ) 
{
    if ( task.x + task.L * fullSize < strokePosition + 1 )
    {
        task.isCompleted = true;
        completedTasksCounter++;
        
        return true;
    }

    return false;
}

function checkForExecuting ( task )
{
    if ( task.x < strokePosition - 1 && task.x + ( task.L - 1 ) * fullSize > strokePosition - 1 ) 
    {
        task.isExecuting = true;

    } 
    else 
    {
        task.isExecuting = false;
    }
}

function checkForQueue( task ) 
{
    if ( Number( task.x.toFixed( 2 ) ) === Number( ( strokePosition ).toFixed( 2 ) ) && !task.isInQueue ) 
    {
        task.isInQueue = true;
        //
        let L = task.L;
        if ( L <= expectationLenght - sigma ) // 1
        {
            queueArray[0].push( task );
            task.tmax[1] = 0; 
        }
        if ( L > expectationLenght - sigma && L <= expectationLenght ) // 2
        {
            queueArray[1].push( task );
            task.tmax = [Math.ceil( queueConstants[1] * L ), 1];
        }
        if ( L > expectationLenght && L <= expectationLenght + sigma ) // 3
        {
            queueArray[2].push( task );
            task.tmax = [Math.ceil( queueConstants[2] * L ), 2];
        }
        if ( L > expectationLenght + sigma ) // 4
        {
            queueArray[3].push( task );
            task.tmax = [Math.ceil( queueConstants[3] * L ), 3];
        }
    }
    //
    if ( task.isCompleted )
    {
        task.isInQueue = false;
    }
}

//Box-Muller
function GaussRand( Mx, sigma ) 
{
    let firstRandom = 2 * Math.random() - 1;
    let secondRandom = 2 * Math.random() - 1;
    let r = firstRandom * firstRandom + secondRandom * secondRandom;
    //
    if( r == 0 || r > 1 ) 
    {
        return GaussRand( Mx, sigma );
    }

    return Mx + sigma * firstRandom * Math.sqrt( -2 * Math.log( r ) / r );
}

function expTime( lambda ) 
{
    return -lambda * Math.log( 1 - Math.random() );
}

function Draw() 
{
    // clear screen
    context.fillStyle = "#f0f0f0";
    context.fillRect( 0, 0, WIDTH, HEIGHT );

    // line
    context.beginPath();
    context.lineWidth = "1.5";
    context.strokeStyle = "black";
    context.moveTo( strokePosition, 0 );
    context.lineTo( strokePosition, HEIGHT ); 
    context.stroke();
    context.fillStyle = "#000000";
    context.font = "30px Arial";
    context.fillText( completedTasksCounter + " tasks completed", WIDTH * 0.8, HEIGHT * 0.1  );
    context.fillText( pressCounter + " kvants passed", WIDTH * 0.8, HEIGHT * 0.2 );

    // draw rectangles
    for( let i = 0; i < tasksAmount; i++ ) 
    {
        for( let j = 0; j < tasks[i].L; j++ ) 
        {
            if ( tasks[i].x + j * fullSize  < strokePosition - 1 ) 
            {
                context.fillStyle = "#cfcf00";
            } 
            else if ( tasks[i].isExecuting ) 
            {
                context.fillStyle = "#b00000";
            } 
            else 
            {
                context.fillStyle = "#800000";
            }
            if (tasks[i].isCompleted)
            {
                context.fillStyle = "#32cd32";
            }
            context.fillRect( j * fullSize  + tasks[i].x, tasks[i].y, size, size );
        }
    }
}

document.addEventListener( "keydown", onKeyDown );

function onKeyDown( /*KeyDownEvent*/ e ) 
{
    if ( e.keyCode == 80 ) // P 
    {
        pause();
    }
    //
    if ( e.keyCode == 40 ) // arrow up
    {
        for ( let i = 0; i < tasks.length; i++ ) 
        {
            changePositionY( tasks[i], 1 );
        }
        Draw();
    }
    //
    if ( e.keyCode == 38 ) // arrow down 
    {
        for ( let i = 0; i < tasks.length; i++ ) 
        {
            changePositionY( tasks[i], -1 );
        }
        Draw();
    }
    //
    if ( e.keyCode == 37 ) // arrow left 
    {
        pressCounter++;
        main();
    }
}

function pause() 
{
    if ( isPaused === false ) 
    {
        clearTimeout( timer );
        cancelAnimationFrame( anim );
        isPaused = true;
    } 
    else
    {
        isPaused = false;
        main();
    }
}
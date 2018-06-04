var canvas, context;
var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;

var tasks = new Array();
var tasksAmount;

var queue1 = new Array();
var queue2 = new Array();
var queue3 = new Array();
var queue4 = new Array();
var firstQueueIndex;

var size = WIDTH / 100;
var spaceSize = size * 0.1;
var fullSize = size + spaceSize;
var strokePosition = 20 * fullSize;

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
        this.tmax =0;
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
    oneIterationStep();
    /*timer = setTimeout( function() {
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
    if ( queue1.length != 0 ) 
    {
        RoundRobin( queue1 );
    } 
    else if ( queue2.length != 0 )
    {
        RoundRobin( queue2 );
    } 
    else if ( queue3.length != 0 )
    {
        RoundRobin( queue3 );
    } 
    else if ( queue4.length != 0 )
    {
        FCFS( queue4 );
    }
    tasks.forEach( task => {
        if ( !task.isInQueue ) 
        {
            changePositionX( task );
        } 
    });
    //
    tasks.forEach( task => checkForExecuting( task ) );
    tasks.forEach( task => checkForQueue( task ) );
    //
    Draw();
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
        if ( task.L <= 4 ) // 1
        {
            queue1.push( task ); 
        }
        if ( task.L > 4 && task.L <= 8 ) // 2
        {
            queue2.push( task );
            task.tmax = task.L;
        }
        if ( task.L > 8 && task.L <= 12 ) // 3
        {
            queue3.push( task );
            task.tmax = 1.5 * task.L;
        }
        if ( task.L > 12 ) // 4
        {
            queue4.push( task );
            task.tmax = 2 * task.L;
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
    context.fillStyle = "#000000";
    context.fillRect( 0, 0, WIDTH, HEIGHT );

     // line
     context.beginPath();
     context.lineWidth = "1.5";
     context.strokeStyle = "white";
     context.moveTo( strokePosition, 0 );
     context.lineTo( strokePosition, HEIGHT ); 
     context.stroke();

    // draw rectangles
    for( let i = 0; i < tasksAmount; i++ ) 
    {
        for( let j = 0; j < tasks[i].L; j++ ) 
        {
            if ( tasks[i].x + j * fullSize  < strokePosition - 1 ) 
            {
                context.fillStyle = "#56f12a";
            } 
            else if ( tasks[i].isExecuting ) 
            {
                context.fillStyle = "#f2d72b";
            } 
            else 
            {
                context.fillStyle = "#ffffff";
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
    if ( e.keyCode == 38 ) // arrow up
    {
        for ( let i = 0; i < tasks.length; i++ ) 
        {
            changePositionY( tasks[i], 1 );
        }
        Draw();
    }
    //
    if ( e.keyCode == 40 ) // arrow down 
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
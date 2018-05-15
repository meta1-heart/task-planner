var canvas, context;
var HEIGHT = window.innerHeight, WIDTH = window.innerWidth;

var tasks = new Array();
var tasksAmount;

var queue = new Array();
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
        this.number = 0;
        this.isInQueue = false;
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
    Draw();
    timer = setTimeout( function() {
        anim = requestAnimationFrame( main );
    }, 1000 * solvingTime );
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
    for (let i = 0; i < tasksAmount; i++)  
    {
        let aTask = new Task();
        aTask.t0 = strokePosition + fullSize + expTime( lambda );
        aTask.x = aTask.t0 - (aTask.t0 % (fullSize));
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
    for ( let i = 0; i < tasks.length; i++ ) 
    {
        changePositionX( tasks[i] );
    } 
    for ( let i = 0; i < tasks.length; i++ ) 
    {
        check( tasks[i] );
    }
    //
    firstQueueIndex = queue[0];
    if ( !checkForExecuting() && firstQueueIndex !== undefined ) 
    {
        tasks[firstQueueIndex].isInQueue = false;
        queue.splice( 0, 1 );
        //
        if ( queue.length !== 0 )
        {
            for ( let i = 0; i < tasks.length; i++ ) 
            {
                changePositionY( tasks[i] );
            }
        }
    } 
}

function changePositionX( task ) 
{
    if ( !task.isInQueue ) 
    {
        task.x -= fullSize;
    }
}

function changePositionY( task ) 
{
    task.y -= fullSize;
}

function check( task ) 
{
    // check for executing
    if ( task.x < strokePosition - 1 && task.x + ( task.L - 1 ) * fullSize > strokePosition - 1 ) 
    {
        task.isExecuting = true;

    } 
    else 
    {
        task.isExecuting = false;
    }
    // check for queue
    if ( Number( task.x.toFixed( 2 ) ) === Number( ( strokePosition ).toFixed( 2 ) ) ) 
    {
        task.isInQueue = true;
        //
        if ( queue.indexOf( task.number ) === -1 )
        {
            queue.push( task.number );
        }
    }
}

function checkForExecuting() 
{
    for ( let i = 0; i < tasks.length; i++ ) 
    {
        if ( tasks[i].isExecuting ) 
        {
            return true;
        }
    }

    return false;
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
}

function pause() 
{
    if ( !isPaused ) 
    {
        clearTimeout( timer );
        isPaused = true;
    } 
    else
    {
        main();
        isPaused = false;
    }
}
/*
 @author Zachary Wartell
 @brief This is code is part of the gradable tutorial at https://zwartell.gitlab.io/javascript-tutorial/,
 in particular the step called "MDN Advanced Chapter: Using Promises"
 */

/*
 * set time required for task1 through task3 to complete (in seconds)
 */
const task1Duration = 5;
const task2Duration = 5;
const task3Duration = 5;

/*
 * These functions provide 3 tasks that are executed in sequence "doTask3(doTask2(doTask1())" such that the return value of Task1 is the input to Task2, and the return value of Task 2 is the input to Task 3.
 * This implementation executes synchronously with respect to the JavaScript event loop.
 */

/*
 * @brief doTask1 takes 'task1Duration' seconds to compute a simple return value of '1'
 */
function doTask1()
{
    let result;
    sleep(task1Duration*1000);
    result = 1;
    console.log("doTask1: complete in " + task1Duration*1000 + " ms.  Return value: " + result.toString() );
    return result;
}

/*
 * @brief task2 takes 'task2Duration' seconds to compute a simple return value of 'input+1'
 */
function doTask2(input)
{
    let result;
    sleep(task2Duration*1000);
    result = 1+input;
    console.log("doTask2: complete in " + task2Duration*1000 + " ms.  Return value: " + result.toString() );
    return result;
}

/*
 * @brief task3 takes 'task3Duration' seconds to compute a simple return value of 'input+1'
 */
function doTask3(input)
{
    let result;
    sleep(task3Duration*1000);
    result = 1+input;
    console.log("doTask3: complete in " + task3Duration*1000 + " ms.  Return value: " + result.toString() );
    return result;
}

/*
 * These functions provide 3 tasks that are executed in sequence "doTask3_Async(doTask2_Async(doTask1_Async())" such that the return value of Task1 is the input to Task2, and the return value of Task 2 is the input to Task 3.
 * This implementation executes the tasks asynchronously with respect to the JavaScript event loop.  Therefore, the return value is retrieve via a callback 'completionCallback' whose parameter is the integer return value.
 *
 * (For illustrative purposes The code is designed so each task takes 'taskXDuration' seconds to complete).
 */

/**
 * @brief doTask1 takes 'task1Duration' seconds to compute a return value of '1'.  The return value is passed the callback function 'completionCallback' when Task1 completes it's computation.
 * @param completionCallback
 */
function doTask1_Async (completionCallback)
{
    let duration=task1Duration * 1000;
    let start = new Date();
    setTimeout(function task1 ()
    {
        let curDate = new Date(),
            delta = curDate - start;
        if (delta >= duration )
        {// the simulated task1 is completed after 'duration' seconds, so it now return's task1's computed result via a callback called 'completionCallback'
            const result = 1;
            console.log("doTask1_Async: complete in " + delta + " ms.  Return value: " + result.toString() );
            completionCallback(result);
        }
        else
            setTimeout(task1,0);
    },0);
}

/**
 * @brief doTask2_Async takes 'task2Duration' seconds to compute a return value of 'input+1'.  The return value is passed the callback function 'completionCallback' when Task1 completes it's computation.
 * @param input
 * @param completionCallback
 */
function doTask2_Async (input, completionCallback)
{
    let duration=task2Duration * 1000;
    let start = new Date();
    setTimeout(function task2 ()
    {
        let curDate = new Date(),
            delta = curDate - start;
        if (delta >= duration )
        {// the simulated task2 is completed after 'duration' seconds, so it return's task2's computed result via a callback called 'completionCallback'
            const result = input+1;
            console.log("doTask2_Async: complete in " + delta + " ms.  Return value: " + result.toString() );
            completionCallback(result);
        }
        else
            setTimeout(task2,0);
    },0);
}

/**
 * @brief doTask3_Async takes 'task3Duration' seconds to compute a return value of 'input+1'.  The return value is passed the callback function 'completionCallback' when Task1 completes it's computation.
 * @param input
 * @param completionCallback
 */
function doTask3_Async (input, completionCallback)
{
    let duration=task3Duration * 1000;
    let start = new Date();
    setTimeout(function task3 ()
    {
        let curDate = new Date(),
            delta = curDate - start;
        if (delta >= duration )
        {// the simulated task3 is completed after 'duration' seconds, so it return's task3's computed result via a callback called 'completionCallback'
            const result = input+1;
            console.log("doTask3_Async: complete in " + delta + " ms.  Return value: " + result.toString() );
            completionCallback(result);
        }
        else
            setTimeout(task3,0);
    },0);
}

/*
 * These are functions that used as callbacks for the 'case 2' asynchronous implementation of task sequence "Task1,Task2,Task3"
 */
function whenTask1Complete(task1Result)
{
    console.log("whenTask1Complete:  task1Result = " + task1Result);
    doTask2_Async(task1Result,whenTask2Complete);
}
function whenTask2Complete(task2Result)
{
    console.log("whenTask2Complete:  task2Result = " + task2Result);
    doTask3_Async(task2Result,whenTask3Complete)
}

function whenTask3Complete(task3Result)
{
    console.log("whenTask3Complete:  task3Result = " + task3Result);
}

/*
 * These are the Promise wrapped versions of doTask1_Async, doTask2_Async, doTask3_Async
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#creating_a_promise_around_an_old_callback_api
 */
function doTask1_Promise ()
{
    return new Promise(
        function(whenComplete)
        {
            doTask1_Async(whenComplete);
        });
}

function doTask2_Promise (input)
{
    return new Promise(
        function (whenComplete) {
             doTask2_Async(input,whenComplete);
        });
}

function doTask3_Promise (input)
{
    return new Promise(
        function  (whenComplete)
        {
            doTask3_Async(input,whenComplete);
        });
}

async function doTaskAll()
{
    let ret1 = await doTask1_Promise(1);
    console.log("extra print #1");
    let ret2 = await doTask2_Promise(ret1);
    console.log("extra print #1");
    let ret3 = await doTask3_Promise(ret2);
    console.log("extra print #1");

    console.log("task3Result: " + ret3);
    return ret3;
}
async function doTask1_await()
{
    await doTask2_await(1);
}
async function doTask2_await(input)
{
    await doTask1_await();
}
async function doTask3_await(input)
{
    await doTask2_await();
}

/*
 * taskMethod controls which of 4 different implementations of the (Task1,Task2,Task3) sequence is executed.
 */
var taskMethod = 1;

function onload()
{
    /*
     *  create simplest interactive painting program possible
     */
    let canvas = document.querySelector('canvas');
    canvas.style.backgroundColor = "lightgrey";
    canvas.addEventListener('mousemove',
        (e )=>
        {
            /* draw pixels at current mouse location */
            if (e.buttons & 0x1)
                e.target.getContext('2d').fillRect(e.clientX,e.clientY,2,2)
        });

    /*
     *  create button with event listener that triggers computation of (Task1,Task2,Task3) sequence.
     */
    let button = document.querySelector('button');
    button.addEventListener('click',
        (e)=>
            {
                switch(taskMethod)
                {
                    case 1:
                        /*
                         synchronous version of (Task1,Task2,Task3) sequence.
                         */
                        console.log("\nStart - sync version");
                        let ret1 = doTask1();
                        let ret2 = doTask2(ret1);
                        let ret3 = doTask3(ret2);
                        console.log("task3Result: " + ret3);
                        break;
                    case 2:
                        /*
                        asynchronous version of the (Task1,Task2,Task3) sequence.
                        Implemented with callbacks,  Callbacks are declared and defined in standard way (see above).
                        */
                        console.log("\nStart - async version 1");
                        doTask1_Async(whenTask1Complete);
                        break;
                    case 3:
                        /*
                         asynchronous version of the (Task1,Task2,Task3) sequence.
                         Implemented with callbacks,  But, callbacks are declared and defined inline to shorten code
                         and enhance readability.  (Alternatives syntax that us anonymous functions or arrow functions would shorten this code further).
                         */
                        console.log("\nStart - async version 2");
                        doTask1_Async(
                            function whenTask1Complete_Inline(task1Result)
                            {
                                doTask2_Async(task1Result,
                                    function whenTask2Complete_Inline(task2Result)
                                    {
                                        doTask3_Async(task2Result,
                                            function whenTask3Complete_Inline(task3Result)
                                            {
                                                console.log("task3Result: " + task3Result);
                                            })
                                    })
                            });
                        break;
                    case 4:
                        /*
                        asynchronous version of the (Task1,Task2,Task3) sequence.
                        Implementation uses Promises using explicit triplet of .then calls.
                        */
                        console.log("\nStart - promise version");
                        doTask1_Promise()
                            .then(task1Result => doTask2_Promise(task1Result))
                            .then(task2Result => doTask3_Promise(task2Result))
                            .then(task3Result => { console.log("task3Result: " + task3Result);});
                        break;
                    case 5:
                        /*
                        asynchronous version of the (Task1,Task2,Task3) sequence.
                        Implementation uses Promises using await (see doTaskAll()).
                        */
                        console.log("\nStart - async await version");
                        doTaskAll();
                        break;
                }
            });
    //window.requestAnimationFrame(computeFrame);

    /*
     *  create radio button event listener to select which implementation of (Task1,Task2,Task3) sequence is executed.
     */
    document.querySelector("input#Synchronous").addEventListener('click',(e)=>{taskMethod=1;});
    document.querySelector("input#Asynchronous1").addEventListener('click',(e)=>{taskMethod=2;});
    document.querySelector("input#Asynchronous2").addEventListener('click',(e)=>{taskMethod=3;});
    document.querySelector("input#Asynchronous3").addEventListener('click',(e)=>{taskMethod=4;});
    document.querySelector("input#Asynchronous4").addEventListener('click',(e)=>{taskMethod=5;});
}

/***
 *** UNUSED EXPERIMENTAL CODE
 ***/
function successCallback(result)
{
    console.log("successCallback: " + result);
    return;
}

function failureCallback(error)
{
    console.log("failureCallback: " + error);
    return;
}

function doSomething()
{
    console.log("doSomething");
    for(i=1;i<10;i++)
        console.log(i);
}

function doSomethingElse()
{
    console.log("doSomething");
    for(i=1;i<10;i++)
        console.log(i);
}

function simulateGetMessage(source)
{
    switch(Math.round(Math.random()*4))
    {
        case 0: return "hello";
        case 1: return "bye";
        case 2: return "[CONNECTION CLOSED]";
        case 4: return "[ERROR]";
    }
}
/*
    request,
    sample,
    event,
*/
function sleep(ms) {
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < ms);
    return;
}
function ReadChatMessage_Request(source)
{
    let delay = Math.random()*10*1000;
    sleep(delay);

    let ret = ReadChatMessage_Sample();
    console.log("Response Time:" + Math.round(delay/1000) + "s");
    console.log(ret);
    return;
}

function ReadChatMessage_Sample(source)
{
    if (Math.round(Math.random()*4) === 0)
        console.log("[NO MESSAGE]");
    else
        console.log (simulateGetMessage());
    return;
}

function ReadChatMessage_AsyncEvent(source,success, failure)
{
    let delay = Math.random()*10*1000;
    setTimeout(
        ()=>{
            let ret = simulateGetMessage();
            console.log("Read Delay:" + Math.round(delay/1000) + "s");
            if (ret === "[ERROR]")
                failure(ret);
            else
                success(ret);
            return;
        },
        delay
    )
    return;
}

function ReadChatMessage_Promise(source)
{
    let p = new Promise(
        (success,failure)=>
        {
            ReadChatMessage_AsyncEvent(source,success,failure);
        }
    );
    return p;
}


function countToTen()
{
    let i = 1;
    console.log("Now counting to ten....");
    let id = setInterval(()=>{console.log(i++); if (i===11) clearInterval(id); return;},1000);
    return;
}

var frameCount = BigInt(0);
function computeFrame(timestamp)
{
    frameCount++;
    //console.log("frameCount: " + frameCount);
    window.requestAnimationFrame(computeFrame);


}

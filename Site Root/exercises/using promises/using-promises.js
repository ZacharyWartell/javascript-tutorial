/*
 @author Zachary Wartell
 @Designed to accompany  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
 */
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


const task1Duration = 5;
const task2Duration = 5;
const task3Duration = 5;
function doTask1()
{
    let ret1;
    sleep(task1Duration*1000);
    ret1 = 1;
    console.log("doTask1: complete in " + task1Duration*1000 + " ms.");
    return ret1;
}
function doTask2(input)
{
    let ret2;
    sleep(task2Duration*1000);
    ret2 = 1+input;
    console.log("doTask2: complete in " + task2Duration*1000 + " ms.");
    return ret2;
}
function doTask3(input)
{
    let ret3;
    sleep(task3Duration*1000);
    ret3 = 1+input;
    console.log("doTask3: complete in " + task3Duration*1000 + " ms.");
    return ret3;
}

/*
 * these functions simulate 3 asynchronous tasks. The simulated tasks could be reading from a file, writing to a file,
 * reading from the network, reading from some external sensor device, etc.
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
        {// simulated time required for task1 is completed, so return computed result through completionCallback
            console.log("doTask1_Async: complete in " + delta + " ms.");
            completionCallback(1);
        }
        else
            setTimeout(task1,0);
    },0);
}

function doTask2_Async (input, completionCallback)
{
    let duration=task2Duration * 1000;
    let start = new Date();
    setTimeout(function task2 ()
    {
        let curDate = new Date(),
            delta = curDate - start;
        if (delta >= duration )
        {// simulated time required for task2 is completed, so return computed result through completionCallback
            console.log("doTask2_Async: complete in " + delta + " ms.");
            completionCallback(input+1);
        }
        else
            setTimeout(task2,0);
    },0);
}
function doTask3_Async (input, completionCallback)
{
    let duration=task3Duration * 1000;
    let start = new Date();
    setTimeout(function task3 ()
    {
        let curDate = new Date(),
            delta = curDate - start;
        if (delta >= duration )
        {// simulated time required for task3 is completed, so return computed result through completionCallback
            console.log("doTask3_Async: complete in " + delta + " ms.");
            completionCallback(input+1);
        }
        else
            setTimeout(task3,0);
    },0);
}


function whenTask1Complete(task1Result)
{
    console.log("whenTask1Complete:  task1Result = " + task1Result);
    doTask2_Async(task1Result,whenTask2Complete);
}
function whenTask2Complete(task2Result)
{
    console.log("whenTask2Complete:  task2Result = " + task2Result);
    doTask3Async(task2Result,whenTask3Complete)
}

function whenTask3Complete(task3Result)
{
    console.log("whenTask3Complete:  task3Result = " + task3Result);
}

/*
 * Promise versions of doTask1_Async, doTask2_Async, doTask3_Async
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#creating_a_promise_around_an_old_callback_api
 */
const doTask1_Promise =
    function ()
    {
        return new Promise(
            function(whenComplete)
            {
                doTask1_Async(whenComplete);
            });
    };
const doTask2_Promise =
    function (input)
    {
        return new Promise(
            function (whenComplete) {
                 doTask2_Async(input,whenComplete);
            });
    };

const doTask3_Promise =
    function (input)
    {
        return new Promise(
            function  (whenComplete)
            {
                doTask3_Async(input,whenComplete);
            });
    };

var  taskMethod = 1;
function onload()
{
    /*
     *  create simplest interactive painting program possible
     */
    let canvas = document.querySelector('canvas');
        canvas.addEventListener('mousemove',
        (e )=>
        {
            /* draw pixels at current mouse location */
            if (e.buttons & 0x1)
                e.target.getContext('2d').fillRect(e.clientX,e.clientY,2,2)
        });

    /*
     *  create button to trigger sync or async computation
     */
    let button = document.querySelector('button');
    button.addEventListener('click',
        (e)=>
            {
                switch(taskMethod)
                {
                    case 1:
                        /*
                         synchronous version
                         */
                        console.log("\nStart - sync version");
                        let ret1 = doTask1();
                        let ret2 = doTask2(ret1);
                        let ret3 = doTask3(ret2);
                        console.log("task3Result: " + ret3);
                        break;
                    case 2:
                        /*
                        asynchronous version , with callbacks,  Callbacks are declared and defined in standard way (see above).
                        */
                        console.log("\nStart - async version 1");
                        doTask1_Async(whenTask1Complete);
                        break;
                    case 3:
                        /*
                         asynchronous version , with callbacks,  Note, callbacks are declared and defined inline to shorten code
                         and enhance readability.
                         (Alternatives syntax such as anonymous functions or arrow functions would shorten the code further).
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
                         asynchronous with Promises
                         */
                        console.log("\nStart - promise version");
                        doTask1_Promise()
                            .then(task1Result => doTask2_Promise(task1Result))
                            .then(task2Result => doTask3_Promise(task2Result))
                            .then(task3Result => { console.log("task3Result: " + task3Result);});
                        break;
                }
            });
    //window.requestAnimationFrame(computeFrame);
    document.querySelector("input#Synchronous").addEventListener('click',(e)=>{taskMethod=1;});
    document.querySelector("input#Asynchronous1").addEventListener('click',(e)=>{taskMethod=2;});
    document.querySelector("input#Asynchronous2").addEventListener('click',(e)=>{taskMethod=3;});
    document.querySelector("input#Asynchronous3").addEventListener('click',(e)=>{taskMethod=4;});
}


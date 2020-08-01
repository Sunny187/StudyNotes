/*
    作用： 循环的执行某个函数的功能
*/
function delayedSend(timer , callback) {
    setInterval (callback  , timer) ;
}
function test () {
    console.log ("xxx") ;
}
delayedSend (3000 ,test) ;
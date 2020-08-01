let moment = require ('moment') ;
function setAutoFinishOrderTimer(time , callback){
    var bizSwitchTime = time ;
    var now = moment() ;
    console.log ("now-->" , now);
    var tomorrow = moment().add(1, 'days') ;
    var todaySwitchTime = moment(now.format('YYYY-MM-DD') + ' ' + bizSwitchTime) ;
    var tomorrowSwitchTime = moment(tomorrow.format('YYYY-MM-DD') + ' ' + bizSwitchTime) ;
    var beginAutoFinishOrder = () => {
        callback() ;
        setTimeout(beginAutoFinishOrder, 24 * 60 * 60 * 1000) ;
    }
    if (now > todaySwitchTime) {
        setTimeout(beginAutoFinishOrder, tomorrowSwitchTime - now) ;
    } else {
        setTimeout(beginAutoFinishOrder, todaySwitchTime - now) ;  
    }
}
setAutoFinishOrderTimer ('18:54:20' , function test (){
    console.log(10) ;
});
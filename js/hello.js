// document.write ("<h1>吴志敏</h1>") ;
// document.getElementById("pid").innerHTML = "你一定可以成为你想要的那个人的" ;

// function demo () {
//     alert( "吴志敏是最帅的") ;
// }


// function demo () {
//     try {
//         alert (str) ;
//     } catch (err) {
//         alert (err) ;
//     }

// }

// demo () ;


// function demo () {
//     let str = document.getElementById("txt").value ;
//     try {
//         if (str == "") {
//             throw "用户输入异常请输入" ;
//         }
//     } catch (err) {
//         alert (err);
//     }
// }


// function onOver (ooj) {
//     console.log(ooj) ;
//     ooj.innerHTML = "hello" ;
// }


// function onOut (ooj) {
//     console.log(ooj) ;
//     ooj.innerHTML = "world" ;
// }


// function changeDemo (bg) {
//     alert("文本发生变化");
// }


// function demo (){
//     document.write("world");
// }

// function demo () {
//     document.getElementById("pid").innerHTML="好好加油" ;
// }


// function demo () {
//     document.getElementById("aid").href="#" ;
// }


// function demo () {
//     document.getElementById("did").style.backgroundColor= "red" ;
// }


// document.getElementById("btn").addEventListener("click" , function(){
//     alert ("haoha") ;
// });


// document.getElementById("btn").addEventListener("click" , function(){
//     alert ("hello") ;
// });

// document.getElementById("btn").addEventListener("click" , function(){
//     alert ("world") ;
// });


// document.getElementById("btn").addEventListener("click" , demo);
// document.getElementById("did").addEventListener("click" , demo1);


// function demo(event){
//     // alert (event.type) ;
//     alert(event.target);
//     event.stopPropagation();//阻止事件冒泡
    
// }
// function demo1(event){
//     // alert (event.type) ;
//     alert("div") ;
// }

//访问子节点
// function getChildNode () {
//     var  childnode = document.getElementsByTagName ("ul")[0].childNodes ;
//     alert(childnode.length);
// }
// getChildNode ();

// //访问父节点
// function getParent () {
//     let a = document.getElementById("pid").parentNode ;
//     alert (a.nodeName) ;
// }

// getParent ();

// function createNodes () {
//     let body = document.body ;    
//     let input = document.createElement("input") ;
//     input.type = "button" ;
//     input.value = "按钮" ;
//     body.appendChild (input) ;
//  }
// createNodes () ;

 
// function addNode () {
//     let body = document.body ;
//     let div = document.getElementById ("div") ;
//     let node = document.getElementById ("pid") ;
//     let newNode = document.createElement ("p") ;
//     newNode.innerHTML = "动态添加一个元素" ;
//     body.insertBefore(newNode , div) ;
// }
// addNode () ;


//document.write ("宽度 : " , window.innerWidth , " 高度 : " , window.innerHeight) ;

// function btnClick () {
//     window.open ("new.html") ;
// }

var myTime = setInterval (function () {
    getTime () ;
} , 1000) ;

function getTime () {
    var  d = new Date () ;
    var  t = d.toLocaleTimeString();
    document.getElementById ("pid").innerHTML = t ;
}





















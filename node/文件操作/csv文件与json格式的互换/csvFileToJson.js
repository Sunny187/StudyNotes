var fs = require("fs") ;
/*
	文件小结 : 文件在读入的时候，都是读出Buffer ， 根据buffer ，转换为相应的文件格式

*/

function csvFileToJson ( filePath ) {
	return new Promise ( (resolve ,reject)=> {
		fs.readFile ( filePath , (err , data)=>{
			if (err) {
				reject (err) ;
			}
			let fileText = data.toString ("utf-8") ;
			let arr = fileText.split ("\r\n") ;
			if ( arr[arr.length-1] === '') { //如果最后一行有换行符 ， 去掉最后一行
				arr.pop () ;
			} 

			let sendArr = [] ;
			for ( let i = 0 ; i<arr.length ; ++i ) {
				let tempArr = arr[i].split (",") ;
				let tempObj = {} ;
				for ( let i = 0 ; i < tempArr.length ; ++i ) {
					tempObj [i] =  tempArr[i] ; 
				}	
				sendArr.push (tempObj) ;
			}
			resolve (sendArr) ;
		} ) ;
		

	}) ;

}

async function test () {
	try {
		let data = await csvFileToJson ("D:\\NodeJSCode\\wzm.csv") ;
		console.log("data-->" , data);
	} catch (err) {
		console.log ( "数据获取错误-->err" , err ) ;
	}
 
}

test () ;


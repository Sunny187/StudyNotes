var fs = require('fs');
var path = require('path') ;
/*
	算法思路： 首先将jsonArr 转为 arrArr , 再次将这些小数组进行拼接,用join 将其拼接在一次
*/
function jsonToCsvFile ( jsonArr , filePath ) {
	let arrArr = jsonArr.reduce ((result , curObj) => {
		let tempArr = [] ;
		for (let key in curObj) {
			tempArr.push (curObj[key]);
		}
		result.push (tempArr) ;
		return result ;
	}, []) ;
	
	let sendText = arrArr.map ((item) => {
		return item.join(',');
	}).join('\r\n') ;
	console.log ("sendText-->" , sendText) ;
	
	try {
		return fs.writeFileSync(filePath , sendText) ;
	} catch (err) {
		console.log ("文件路径错误-->" , err) ;
		throw (err) ;
	}

}

function test() {
	let obj = [
		{
			ID: "1005",
			CreateTime: "202002020",
			ContentType: "5041"
		},
		{
			ID: "1006",
			CreateTime: "202002021",
			ContentType: "5042"

		},
		{
			ID: "10066",
			CreateTime: "202002020",
			ContentType: "5043"

		}

	];
	jsonToCsvFile(obj, 'D:\\NodeJsCode\\hj.csv');
}
test();
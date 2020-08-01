const fs = require ("fs") ;
const JSZIP = require ("jszip") ;
const path = require ("path") ;
/*
    函数作用： 压缩当前文件夹下面不包括文件的所有文件。

*/

async function zipFile(dirPath , zipName) {
    let jszip = new JSZIP () ;
    try {
        let fileNames = fs.readdirSync (dirPath) ;
        fileNames.forEach ((fileName , index)=> {
            let filePath = path.join (dirPath , fileName) ;
            let fileDescription = fs.statSync (filePath) ;
            if (!fileDescription.isDirectory()) {
                let fileBuf = fs.readFileSync (filePath) ;
                jszip.file (fileName , fileBuf) ;
            }
        });
        let content = await jszip.generateAsync({
            type : "nodebuffer" ,
            compression : "DEFLATE" ,
            compressionOptions : {
                level : 9 
            }
        }) ;
        fs.writeFileSync (path.join(dirPath , zipName) , content , 'utf-8') ;

    } catch (err) {
        console.log ("该文件夹不存在--->" , err) ;
    }

}

zipFile ("D:\\NodeJSCode" , "xxx.zip" ) ;
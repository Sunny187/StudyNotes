const ini = require ("ini") ;
const fs = require ("fs") ;

function getObjFromIni (iniFilePath) {
    try {
        let content = fs.readFileSync (iniFilePath , 'utf-8') ;
        let iniObj = ini.parse (content) ;
        return iniObj ;
    } catch (err) {
        console.log ("没有该ini文件-->" , err) ;
    }

}

getObjFromIni ("D:\\NodeJSCode\\test.ini") ;
const MysqlHelper = require('./mysqlHelp') ;
const iconv = require('iconv-lite') ;
async function test() {
    var connectionInfo = {
        host: '172.161.25.116',
        user: 'hmsnc',
        password: 'hm',
        database: 'hmsh'
    } ;
    
    let mysqlHelper = new MysqlHelper (connectionInfo) ;
    try {
        let bufObj = await mysqlHelper.dbOp("select BIN from hmpara_extend where PARA_TYPE_HEX = 3011 ") ;
        let buf = bufObj[0].BIN ;
        buf = buf.slice(8,72) ;
        let temp = iconv.decode(buf,'gbk') ;
        let result = temp.split('\u0000') ;
        result = result.join('');
        return result;
     
    } catch (err) {
        console.log ("数据获取失败--->" , err) ;
    }
}
test () ;


//icov-lite 是可以将中文的GBK编码进行转换，64个字节变一个中文 ，不够的地方进行用空格进行补齐。


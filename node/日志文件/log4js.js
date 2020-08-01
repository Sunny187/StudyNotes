var log4js = require('log4js');
async function main() {
    log4js.configure("./log4js.json");
    let logger = log4js.getLogger() ;
    let loggerError = log4js.getLogger ("error") ;
    logger.debug("吴志敏" , "fd" , 12 , "fsdf") ;
    loggerError.error("狐金" , 12 , 12 , 12 ,"1000haa哈") ;
}
main() ;
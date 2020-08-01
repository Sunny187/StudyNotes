let Client = require ("ftp") ;
let fs = require ('fs') ;
class FtpHandler {
    constructor (config) {
        if (!config) {
            this.init (config) ;
        }
    }
    init (config) {
        this.config = config ;
    }
    getConnect () {
        return new Promise ((resovle , reject) => {
            let  c = new Client () ;
            c.connect (
                {
                    host : this.config.host ,
                    user : this.config.user ,
                    password : this.config.password 
                }
            ) ;
            c.on ('ready' , () => {
                resovle (c) ;
            }) ;
            c.on ('error' , (error) => {
                reject (error) ;
            }) ;
        }) ;
    }

    changeFtpDir (socket , dir) {
        return new Promise ((resovle , reject) => {
            socket.cwd(dir , (err) => {
                if (err) {
                    reject (err) ;
                } else {
                    resolve () ;
                }
            }) ;
        }) ;
    }

    putFile (socket , filePath , fileName ) {
        return new Promise ((resolve , reject)=> {
            socket.put (filePath , fileName ,  (err) => {
                if (err) {
                    reject (err) ;
                } else {
                    resolve ('') ;
                }
                socket.end() ;
            }) ;
        }) ;
    }

    getFile (socket , fileName , localFilePath) {
        return new Promise ( (resovle , reject) => {
            let writeStream  = fs.createWriteStream (localFilePath) ;
            socket.get (fileName , (err , stream)=> {
                if (err) {
                    reject (err) ;
                } 
                stream.once ('close' , (err)=>{
                    socket.end () ;
                }) ;
                stream.pipe (writeStream) ;
            }) ;
        }) ;
    }
}

exports.FtpHandler = FtpHandler ;
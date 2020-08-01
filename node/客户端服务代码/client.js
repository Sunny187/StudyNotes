var net = require ('net') ;
function getSocket(ip , port) {
    var promise = new Promise((resolve, reject) => {
        let socket = new net.Socket();
        socket.on('timeout', () => {
            tools.debug(`my socket timeout`);
            socket.end();
        });
        socket.on('data', (buffer) => {
            tools.debug(`client get buffer -> ` , buffer);
        });
        socket.on('end', () => {
            tools.debug('my socket end');
        });
        socket.on('error', (err) => {
            tools.debug(`my socket error happened! ${err}`);
            reject(err);
        });
        socket.connect(port, ip, () => {
            resolve(socket);
        })
    });
    return promise;
}

function test () {
    getSocket ("127.0.0.1" , 3008).then(socket => {
        socket.write ("wzm") ;
    }) ;
}

test () ;
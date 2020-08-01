/**
 * 作用：搭建一个服务器
 * 
 */
let net = require("net");
function Server (port) {
    var server = net.createServer((c) => {
        c.on('end', () => {
            console.log(`client disconnected`);
        });
        c.on('error', (err) => {
            console.log(`error happened!`);
        });
        c.on('data', (buffer) => {
            console.log(`server get buffer ->`, buffer);
        });
        c.on('close', () => {
            console.log(`closed !!!`);
        });
        c.on('timeout', () => {
            console.log('socket on timeout');
        });
    });
    server.on('error', (err) => {
        server.close();
        console.log('server error happen -> ', err);
        //this.restartServer();
    });
    server.on("listening", () => {
        console.log("start listening...");
    });
    server.on("close", () => {
        console.log('server closed ----- ');
        //this.restartServer();
    });
    server.listen(port, () => {
        console.log('SH net server bound on port', port);
    });
}
Server(3008);
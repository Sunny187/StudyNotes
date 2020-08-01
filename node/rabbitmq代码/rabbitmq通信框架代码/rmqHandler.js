var HmCenter = require('./hmCenter');
const fs = require('fs');
const path = require('path');
class RabbitMqHandler {
    constructor() {
    }
    init (ini) {
        this.ini = ini;
        this.myName = 'regMgr';
        this.myStationId = `${tools.padZero(this.ini.mine.line, 2)}${tools.padZero(this.ini.mine.station, 2)}`;
        this.rMq = new HmCenter();
        var bindKeys = ['rsp.regMgr.#','rpc.regMgr.#'];
        let ip = null;
        if (this.ini.rmq && this.ini.rmq.ip) {
            ip = this.ini.rmq.ip;
        } else {
            ip = '127.0.0.1'
        }
        let user = 'admin'
        if (this.ini.rmq && this.ini.rmq.user) {
            user = this.ini.rmq.user
        } 
        let password = 'admin'
        if (this.ini.rmq && this.ini.rmq.password) {
            password = this.ini.rmq.password
        } 
        let option = {
            id : user,
            password : password,
            mqIp: ip,
            myPos: this.myStationId + '1001',
            myName: 'regMgr',
            bindKeys: bindKeys
        }
        this.rMq.init(option);
        this.rMq.on('msgArrive', (info) => {
            this.onRmqMsgArrived(info);
        });
        this.rMq.on('ready',(time) => {
            tools.debug('rmq ready at ',time);
            this.onMqReady(time);
        });
        this.rMq.start() ;
        this.msgRpcTable = {
            quit : (option, info) => {
                process.exit(0);
            },
            handShake : (option, info) => {
                if (option.resopnse) {
                    this.sendResponse(option.src,option.id,{result : 0});
                }
            },
            foo : (option, info) => {
                tools.debug('dummy');
            }
        } ;
    }
    onMqReady(time) {//当MQ连接上的时候，所需要做的事情

    }
    onRmqMsgArrived(info) {
        let keyConetnt = info.key.split('.');
        if (keyConetnt[0] == 'rpc') { 
            if (keyConetnt[1] == 'regMgr' || keyConetnt[1] == 'all') {
                if (info.format == 'json') {
                    let value = JSON.parse(info.msg)
                    let rpcCmd = value.cmd
                    if (this.msgRpcTable.hasOwnProperty(rpcCmd)) {
                        let option = {
                            resopnse : info.isReq,
                            id : info.msgId,
                            src : keyConetnt[2], 
                            cmd : rpcCmd
                        }
                        this.msgRpcTable[rpcCmd](option,value.value);
                    }        
                }
            } 
        }
    }
    sendResponse(dst,msgId,option) {
        let sendKey = 'rsp.'+ dst +'.regMgr';
        let bodyStr = JSON.stringify(option);
        this.rMq.sendResp(sendKey,msgId,dst,'json',bodyStr);
    }
    async sendRmqRpcMsg(dst, cmd, para) {
        return await this.rMq.sendRmqRpcMsg(dst, this.myName, cmd, para);
    }
    
}
module.exports = RabbitMqHandler;
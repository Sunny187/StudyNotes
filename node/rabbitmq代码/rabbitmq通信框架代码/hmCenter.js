var EventEmitter = require('events') ; 
var moment = require('moment') ;
var RabbitMqHelper = require('./helper_rabbitmq') ;
class HmCenterClient extends EventEmitter {
    constructor() {
        super();
        this.sendMsgInfo = {};
        this.localMsgId = 1;
        this.checkMqCntMax = 60;
        this.checkMqCnt = 1;          //立即执行一次
    }
    init(config) {
        this.config = config;
        this.srcName = config.myName;
        this.mqConnStatus = 'NotConnect';
        var qName = config.myPos + '_' + config.myName;
        var bindKeys = [] ;
        if (!config.hasOwnProperty('bindKeys')) {
            let bindKey = '*.' + config.myName + '.#';
            bindKeys.push(bindKey);
        } else {
            bindKeys = config.bindKeys;
        }
        console.log('hmCenter bindKeys is ',bindKeys);
        this.mq = new RabbitMqHelper({
            id : config.id,
            password : config.password,
            mqIp: config.mqIp,
            qName: qName,
            bindKeys: bindKeys,
            exchangeIn: 'topic_hmcenter',
            exchangeOut: 'topic_hmcenter'
        }) ;
        this.mq.on('msgArrive', (mqkey, msg, properties) => {
            this.onMsgArrive(mqkey, msg, properties);
        });
        this.mq.on('error', (error) => {
            this.mqConnStatus = 'NotConnect';
        });
        this.mq.on('connOk', () => {
            this.mqConnStatus = 'Connected';
            this.emit('ready', moment().format('YYYYMMDDHHmmss'));
        });
    }
    async checkMqAlive() {//检查我当前模块的连接状况
        if (this.mqConnStatus == 'NotConnect') {
            this.mqConnStatus = 'Connecting';
            try {
                await this.mq.init();
            } catch (error) {
                console.log('mq init ---', error) ;
                this.mqConnStatus = 'NotConnect' ;
            }
        } 
    }
    start() { //一分钟去检查一次，我的连接状态
        setInterval(async () => {
            this.checkTimeout();
            if (this.checkMqCnt != 0) {
                this.checkMqCnt--;
                if (this.checkMqCnt == 0) {
                    await this.checkMqAlive();
                    this.checkMqCnt = this.checkMqCntMax;
                }
            }
        }, 1000);
    }
    onMsgArrive(mqkey, msg, properties) {
        console.log(`from ${mqkey} get [${msg}]`);
        let msgHeadLen = parseInt(msg.slice(0,10));
        var msgHead = msg.slice(10,10 + msgHeadLen);
        try {
            var msgObj = JSON.parse(msgHead);
        } catch (error) {
            tools.error('onMsgArrive parse Not a JSON head msg', error);
            return;
        }
        var msgBody = msg.slice(10 + msgHeadLen, 10 + msgHeadLen + msgObj.bodyLen);
        var bodyInfo = { 
            key : mqkey,
            isReq : msgObj.isReq,
            msgId : msgObj.msgId,
            format : msgObj.bodyFormat,
            msg : msgBody
        };
        //判断MD5校验
        let mdgWithoutMd5 = msg.slice(0,msg.length - 32);
        let srcMd5Str = msg.slice(msg.length - 32,msg.length)
        let checkMd5Str = tools.hex2Ascii(tools.getMd5Buffer(mdgWithoutMd5)).toUpperCase();
        if (checkMd5Str != srcMd5Str) {
            tools.error(` msg from ${mqkey} md5 error`);
            return;
        } 
        var dispatchMsg = true;

        if (msgObj.isRsp) { //这一块来区别我是返回消息，还是第一次接受到的消息
            var key = msgObj.src + '-' + tools.padZero(msgObj.msgId, 10);
            if (this.sendMsgInfo[key]) {
                if (this.sendMsgInfo[key].callback) {
                    this.sendMsgInfo[key].callback(null, bodyInfo);    
                }
                delete this.sendMsgInfo[key];
                dispatchMsg = false;
            }
            else {
                tools.debug('this msg is unkown');
                dispatchMsg = false;
            }
        }

        if (dispatchMsg) {
            this.emit('msgArrive', bodyInfo);
        }
    }

    send(key,option) {
        var str = JSON.stringify(option.head);
        let headLen = str.length;
        //包头长度 + 报文头 + 报文体 + MD5校验
        var sendStr = headLen.toString().padStart(10 , 0);
                        + str 
                        + option.body;
        
        let md5 = tools.getMd5Buffer(sendStr) ; 
        let md5Str = tools.hex2Ascii(md5).toUpperCase();
        sendStr = sendStr + md5Str;
        tools.debug(`send to ${key} msg -> [${sendStr}]`);
        this.mq.sendStr(key, sendStr,true);
    }

    sendReq(sendkey,dst,format,bodyDataStr,dataLen, callback)  {

        var nowMoment = moment();
        var key = null;
        key = dst + '-' +this.localMsgId.toString().padStart(10 , 0);
        var val = {
            sendTime: nowMoment,
            timestamp: process.hrtime(),
            rPosName: dst,
            callback: callback
        };
        if (!this.sendMsgInfo[key]) {
            this.sendMsgInfo[key] = val;
        } else {
           console.log('[Error] key has exist in sendMsgInfo');
        }
        let headMsg = {
            src : this.srcName,
            dst : dst,
            isReq : true,
            isRsp : false,
            msgId : this.localMsgId++,
            bodyFormat : format,
            bodyLen : dataLen
        }
        this.send(sendkey,{
            head : headMsg,
            body : bodyDataStr
        });
    }

    sendRmqRpcMsg(dst, src, cmd, para) {
        return new Promise((resolve, reject) => {
            let bodyVal = {
                cmd : cmd,
                value : para
            }
            const msgJsonStr = JSON.stringify(bodyVal)
            let sendInfo = {
                dst : dst,
                key : 'rpc.' + dst + '.' + src,
                body : msgJsonStr,
                bodyFormat:'json',
                bodyLen: Buffer.from(msgJsonStr).length
            }
            this.sendReq(sendInfo.key, sendInfo.dst, sendInfo.bodyFormat, sendInfo.body, sendInfo.bodyLen, (error, msgInfo) => {
                if (error) {
                    tools.error('rmq rpc error - timeout, from ->', msgInfo);
                    reject(error);
                } else {
                    resolve(msgInfo);
                }
            })
        });
    }

    sendResp(sendkey,msgId,dst,format,bodyDataStr) {

        if (sendkey && msgId && dst && format && bodyDataStr ) {
        } else {
            tools.error('pello say: [error] not necessary info');
            throw(new Error('pello say: [error] not necessary info'));
            return
        }
        let headMsg = {
            src : this.srcName,
            dst : dst,
            isReq : false,
            isRsp : true,
            msgId : msgId,
            bodyFormat : format,
            bodyLen : Buffer.from(bodyDataStr).length
        }
        this.send(sendkey,{
            head : headMsg,
            body : bodyDataStr
        });
    }

    checkTimeout() {
        var timestamp = process.hrtime();
        var keys = Object.keys(this.sendMsgInfo);
        for (var i = 0; i < keys.length; i++) {
            var timeDifference = timestamp[0] - this.sendMsgInfo[keys[i]].timestamp[0];
            if (!this.sendMsgInfo[keys[i]].timeoutVal) {
                this.sendMsgInfo[keys[i]].timeoutVal = 8;
            }
            if (timeDifference > this.sendMsgInfo[keys[i]].timeoutVal) {
				if (this.sendMsgInfo[keys[i]].callback){
					this.sendMsgInfo[keys[i]].callback(new Error('wait reply timeout'),this.sendMsgInfo[keys[i]].rPosName);
				}
                delete this.sendMsgInfo[keys[i]];
            }
        }
    }
}
module.exports = HmCenterClient;
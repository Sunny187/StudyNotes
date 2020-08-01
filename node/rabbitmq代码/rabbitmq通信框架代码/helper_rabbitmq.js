var amqp = require('amqplib');
var EventEmitter = require('events');
class RabbitMqHelper extends EventEmitter {
    constructor(options) {
        super();
        this.config = {};
        if (options) {
            this.config.ip = options.mqIp;
            if (!options.hasOwnProperty('id')) {
                this.config.id = 'admin';
            } else {
                this.config.id = options.id;
            }
            if (!options.hasOwnProperty('password')) {
                this.config.password = 'admin';
            } else {
                this.config.password = options.password;
            }
            this.config.qName = options.qName;
            this.config.bindKeys = options.bindKeys;
        } else {
            this.config.ip = '127.0.0.1'
            this.config.id = 'guest';
            this.config.password = 'Qaz62442660';
            this.config.qName = options.qName;
            this.config.bindKeys = options.bindKeys;
        }
        this.config.port = 5672;
        this.config.exchangeIn = options.exchangeIn;
        this.config.exchangeOut = options.exchangeOut;
    }
    async init() {
        try {
            var connConfig = {
                hostname: this.config.ip,
                port: this.config.port,
                username: this.config.id,
                password: this.config.password,
                heartbeat: 30
            }
            console.log('connect RabbitMQ info is ==== ', connConfig);
            this.conn = await amqp.connect(connConfig);
            this.conn.on('error', (err) => {
                console.log('[Error] (amqp error event)---', err);
                this.emit('error', err);
            });
            this.conn.on('close', () => {
                tools.debug('[Info] (amqp close event)---');
            });
            console.log("create channel begin --------------------------- ");
            this.ch = await this.conn.createConfirmChannel();
            console.log("create channel ok");
            await this.ch.assertExchange(this.config.exchangeIn, 'topic', { durable: true });
            var q = await this.ch.assertQueue(this.config.qName, { exclusive: true, autoDelete: true });
            for (var i = 0; i < this.config.bindKeys.length; i++) {
                await this.ch.bindQueue(q.queue, this.config.exchangeIn, this.config.bindKeys[i]);
            }
            await this.ch.consume(q.queue, (msg) => {
                if (msg !== null) {
                    this.emit('msgArrive', msg.fields.routingKey, msg.content, msg.properties);
                }
            }, { noAck: true });
            this.emit('connOk');

        } catch (error) {
            console.log("error happen", error);
            this.emit('error', error);
            throw (error);
        }
    }
    async sendStr(key, msgStr, noLog) {
        try {
            if (!noLog) {
                tools.debug("send ---", key, msgStr);
            }
            await this.ch.publish(this.config.exchangeOut, key, Buffer.from(msgStr));

        } catch (error) {
            console.log("error happen", error);
            this.emit('error', error);
            throw (error);
        }
    }
}
module.exports = RabbitMqHelper;
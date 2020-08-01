// 构建消费者
const amqp = require('amqplib');
async function consumer() {
    var connConfig = {
        hostname: "192.168.1.111",
        port: 5672 ,
        username: "wzm",
        password: "123",
        heartbeat: 30
    }
    console.log('connect RabbitMQ info is ==== ',connConfig);
    let connection = await amqp.connect(connConfig);
    connection.on('error', (err) => {
        console.log('[Error] (amqp error event)---', err);
    });
    connection.on('close', () => {
        console.log('[Info] (amqp close event)---');
    });
    const channel = await connection.createChannel();
    const queueName = 'helloMQ';
    await channel.assertQueue(queueName);
    await channel.consume(queueName, msg => {
        console.log('Consumer：', msg.content.toString());
        channel.ack(msg);
    });
}
consumer();
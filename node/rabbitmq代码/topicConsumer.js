const amqp = require('amqplib');

async function consumer() {
   
    const connection = await amqp.connect('amqp://localhost:5672');

    const channel = await connection.createChannel();
    const exchangeName = 'topic_koala_exchange';
    const queueName = 'topic_koala_queue';
    const routingKey = 'topic_routingKey.*';
    await channel.assertExchange(exchangeName, 'topic', { durable: true });
    await channel.assertQueue(queueName);
    await channel.bindQueue(queueName, exchangeName, routingKey);
    await channel.consume(queueName, msg => {
        console.log('Consumer：', msg.content.toString());
        channel.ack(msg);
    });
    console.log('消费端启动成功！');
}

consumer();
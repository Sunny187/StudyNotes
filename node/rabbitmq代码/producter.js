const amqp = require ("amqplib");
const { createConnection } = require("mysql");
async function product(params){
    var connConfig = {
        hostname: "192.168.1.111",
        port: 5672 ,
        username: "wzm",
        password: "123",
        heartbeat: 30
    }
    console.log('connect RabbitMQ info is ==== ',connConfig);
    let conn = await amqp.connect(connConfig);
    conn.on('error', (err) => {
        console.log('[Error] (amqp error event)---', err);
    });
    conn.on('close', () => {
        console.log('[Info] (amqp close event)---');
    });
    const channel = await conn.createChannel () ;
    const routingKey = "helloMQ" ;
    const msg = "wzm" ;
    for (let i = 0 ; i < 1000 ; ++i) {
        await channel.publish('' , routingKey , Buffer.from (`第${i}条：'${msg}'`)) ;
    }
    channel.close () ;
    conn.close() ;
}
product();
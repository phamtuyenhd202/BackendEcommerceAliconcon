'use strict'

const amqplib = require('amqplib')
const amqp_url = 'amqp://guest:123456@localhost'

const log = console.log
console.log = function(){
    log.apply(console, [new Date()].concat(arguments))
}        


const runProducer = async ({msg}) => {
    try {
        //create connect
        const connection = await amqplib.connect(amqp_url)
        if(!connection) console.error('Not connection to rabbitmq')
        //create channel
        const channel = await connection.createChannel()
        
      
        const notificationExchange = "notificationEx"// create direct exchanges 
        const notiQueue = "notifictionQueueProcess"  // asserQueue
        const notificationExchangeDLX = "notificationExchangeDLX" // create direct exchanges 
        const notificationRoutingKeyDLX = "notificationRoutingKeyDLX" // asserQueue

        //1. create exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true,
        })

        //2. create queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,  //cho phép các kết nối khác truy cập vào hằng đợi
            deadLetterExchange: notificationExchangeDLX, // nếu 1 message lỗi hoặc hết hạn thì chuyển đến direct Exchanges DLX
            deadLetterRoutingKey: notificationRoutingKeyDLX // với khóa định tuyến (routing key) bởi notificationRoutingKeyDLX
        })
        //3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange)

        //4. send message
        const msg = 'a new product'
        console.log('Product message:::', msg)
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg),{
            expiration: '10000'
        })

        // setTimeout(() => {
        //     connection.close()
        //     process.exit(0)
        // }, 50000);

    } catch (error) {
        console.error("Error::", error)
    }
}
runProducer ('hello, aliconcon by tuyenpham')
'use strict'
const amqplib = require('amqplib')
const amqp_url = 'amqp://guest:123456@localhost'

async function consumerOrderedMessage(){
    const connection = await amqplib.connect(amqp_url) 
        if(!connection) console.error('Not connection to rabbitmq')
        //create channel
    const channel = await connection.createChannel()

    const queueName = 'ordered-queued-message'
    await channel.assertQueue(queueName, {
        durable: true
    })
    

    for (let i = 0; i < 10; i++) {
        const message = `ordered-queued-message:: ${i}`
        console.log(`Message:: ${message}`)
        
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        })
    }

    setTimeout(() => {
        connection.close()
    }, 1000);
}

consumerOrderedMessage().catch( err => console.error(err))
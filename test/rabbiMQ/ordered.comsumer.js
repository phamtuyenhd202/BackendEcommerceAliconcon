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

    //set prefetch to 1 to ensure only one ack at a time
    channel.prefetch(1)

    channel.consume(queueName, msg => { 
        const message = msg.content.toString()
        
        setTimeout(() => {
            console.log('processed::', message)
            channel.ack(msg)
        }, Math.random() * 1000);

    })

    

}

consumerOrderedMessage().catch( err => console.error(err))
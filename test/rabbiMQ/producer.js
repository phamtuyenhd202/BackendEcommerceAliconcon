'use strict'

const amqplib = require('amqplib')
const amqp_url = 'amqp://guest:123456@localhost'

const runProducer = async ({msg}) => {
    try {
        //create connect
        const connection = await amqplib.connect(amqp_url)
        if(!connection) console.error('Not connection to rabbitmq')

        //create channel
        const channel = await connection.createChannel()

        //create name queue
        const nameQueue = 'testQ1'
        
        //create queue
        await channel.assertQueue(nameQueue, {
            durable: false, ///tính bền bỉ của queue
        })

        //send to queue
        await channel.sendToQueue(nameQueue, Buffer.from(msg))

        // disconnect rabbitmq
        // await channel.dis
        
    } catch (error) {
        console.error("Error::", error)
    }
}
runProducer ('hello, aliconcon by tuyenpham')
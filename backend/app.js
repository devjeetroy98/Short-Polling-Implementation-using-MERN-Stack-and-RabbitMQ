const mongoose = require("mongoose")
const amqp = require("amqplib")
require("dotenv").config()
const EventModel = require("./schemas/eventSchema")
const express = require("express");


const app = express();
app.use(express.json());

const queue = 'EVENT'

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
};

async function connect() {
    try {
        // Connect Database
        mongoose.connect(`${process.env.DB_URI}`, {}).then(() => { })

        // Connect Message Broker
        const connection = await amqp.connect(process.env.AMQP_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, {
            durable: true
        });

        channel.prefetch(1)

        await channel.consume(
            queue,
            async (message) => {
                if (message) {
                    let data = JSON.parse(message.content.toString())
                    await delay(5000);
                    await EventModel.findByIdAndUpdate(data._id, {
                        isEventRegistered: true
                    })
                }
            },
            { noAck: true }
        );
    } catch (err) {
        console.warn(err);
    }
};

connect()


const PORT = process.env.port || 8080
app.listen(PORT, () => console.log("Microservice is running at:", PORT));
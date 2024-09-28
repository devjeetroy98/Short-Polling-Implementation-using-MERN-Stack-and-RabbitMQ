const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const amqp = require("amqplib")
require("dotenv").config()

const EventModel = require("./schemas/eventSchema")
const app = express()
const PORT = process.env.port || 8080


async function connect() {
    const amqpServer = process.env.AMQP_URL;
    const connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue('EVENT', {
        durable: true
    });
}
connect();


mongoose.connect(`${process.env.DB_URI}`, {}).then(() => { })

app.use(cors())
app.use(express.json())

app.post("/rest/create", async (req, res) => {
    let response = await EventModel.create(req.body)
    try {
        channel.sendToQueue('EVENT', Buffer.from(JSON.stringify(response)));
        res.status(201).json(response)
    } catch (e) {
        res.status(500).json({
            message: "Something went wrong!",
            error: e.toString()
        })
    }
})

app.get("/rest/findAll", async (req, res) => {
    let response = await EventModel.find({})
    res.status(200).json(response)
})

app.listen(PORT, () => {
    console.log("API Gateway is running at:", PORT)
})
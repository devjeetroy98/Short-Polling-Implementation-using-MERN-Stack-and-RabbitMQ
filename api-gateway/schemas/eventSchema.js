const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        require: true
    },
    isEventRegistered: {
        type: Boolean,
        require: true,
        default: false
    }
})

const EventModel = mongoose.model("EventModel", EventSchema)

module.exports = EventModel;
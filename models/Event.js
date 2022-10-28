const mongoose = require('mongoose')

const eventSchema =  new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        price: {
            type: Number,
            required: false,
            default: 0
        },
        URL: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        venue: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: false
        },
        region: {
            type: String,
            required: false
        },
        county: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: false
        },
        latitude: {
            type: Number,
            required: false
        },
        longitude: {
            type: Number,
            required: false
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Event', eventSchema)
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 3
    },
    roles: {
        type: [String],
        default: ["User"]
    }
})

module.exports = mongoose.model('User', userSchema)
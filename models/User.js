const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    date: {
        type: Date,
        default: Date.now
    }
})//Que atributos tiene tu tabla en la BD.

module.exports = mongoose.model('User', userSchema)
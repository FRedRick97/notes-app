const mongoose = require('mongoose')

var noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Notes', noteSchema)

const mongoose = require('mongoose')

mongoose.Promise = global.Promise

// mongoose.connect('mongodb://localhost:27017/notesApp', { keepAlive: 120, useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
//     if (err) return console.log(err)
//     else return console.log('Connected')
// })
mongoose.connect('mongodb://localhost:27017/notesApp', { useNewUrlParser: true }, function (err) {
    if (err) return console.log(err)
    return console.log('Connected')
})


module.exports = mongoose

const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/ipayDb', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}); // connect to database

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

module.exports = mongoose
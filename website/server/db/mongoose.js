const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
    socketTimeoutMS: 45000,
    keepAlive: true,
    reconnectTries: 10,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log('connected'))
    .catch(e => console.log(e));

module.exports = {mongoose};
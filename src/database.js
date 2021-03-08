const mongoose = require('mongoose');

const MONGODB_URI = `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE}`

mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(db => console.log(`MongoDB is connected to ${db.connection.host}`))
    .catch(err => console.error(err));
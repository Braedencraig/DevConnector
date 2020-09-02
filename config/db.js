const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

// Handle connection to mongo DB here and bring in in server.js

const connectDB = async () => {
  try {
    console.log('MongoDB Connected!!!!!')
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
  } catch(err) {
    console.error(err.message)
  //   Exit process with failure
    process.exit(1);
  }
}


module.exports = connectDB;
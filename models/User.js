const mongoose = require('mongoose');
// creating a model / schema

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// mongoose.model takes model name which is user and the schema, which is userSchema
// we set a variable called user and set it to mongoose.model() and thats whats exported.
module.exports = User = mongoose.model('user', UserSchema)
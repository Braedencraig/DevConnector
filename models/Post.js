const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  // reference to user, this is how we connect a user to a post
  user: {
    // this creates a refrence to user model, every profile should be associated with user. we use object id, that is created when we create a new User, in the user model _id
    type: mongoose.Schema.Types.ObjectId,
    // reference to the user model
    ref: 'users'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        // will include an array of user objects which will have the ids
        type: mongoose.Schema.Types.ObjectId,
        // this way we know which likes come from which user, a single user can only like a certain post once
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema)
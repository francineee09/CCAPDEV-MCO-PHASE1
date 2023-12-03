const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
},
  content: {
    type: String,
    required: true
},
  mediaPath: {
    type: String
},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
}, 
  createdAt: {
    type: Date,
    default: Date.now
},
  comments: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        date: Date
    }
],
});

module.exports = mongoose.model('Post', postSchema);
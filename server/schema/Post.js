// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  mediaPath: { type: String }, // This will store the path to the media file
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }, // Reference to the User model
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  comments: [
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        date: Date
        // Other comment properties if ever there will be any additionals. 
    }
],
});

postSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
  });

module.exports = mongoose.model('Post', postSchema);

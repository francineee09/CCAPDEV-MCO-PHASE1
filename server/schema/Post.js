// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  mediaPath: { type: String }, // This will store the path to the media file
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);

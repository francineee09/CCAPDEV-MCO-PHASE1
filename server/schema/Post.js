const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title:
  {
    type: String,
    required: true
  },
  content:
  {
    type: String,
    required: true
  },
  mediaPath:
  {
    type: String
  },
  author:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  createdAt:
  {
    type: Date,
    default: Date.now
  },
  updatedAt:
  {
    type: Date,
    default: null
  },
  comments:
  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes:
  [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
});

postSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('Post', postSchema);
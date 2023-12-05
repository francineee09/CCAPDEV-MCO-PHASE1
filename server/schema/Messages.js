const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: String, // will later change this to reference a User model
  content: {
    type: String,
    required: true,
  },
  chat: String, // will later change this to reference a Chat model or use chat IDs
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Message', messageSchema);
// models/Message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
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

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

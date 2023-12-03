const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  profilePictureURL: String,
  bio: String
});

module.exports = mongoose.model('Profile', profileSchema);
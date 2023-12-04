const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    likedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    // Add other fields if needed for further improvements.
});

module.exports = mongoose.model('User', userSchema);

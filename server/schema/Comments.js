// Assuming you are using Mongoose for MongoDB
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: String,
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Assuming your post model is named Post
    // Add other fields as needed
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

// models/Comment.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: String,
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Reference to users who liked this comment
    profile: {type: mongoose.Schema.Types.ObjectId, ref: 'Profile'},
    replies: [
        {
            profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
            content: String,
            commentId:{type:mongoose.Schema.Types.ObjectId},
            date: { type: Date, default: new Date()},
            likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        }
    ],
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

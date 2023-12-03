const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: String,
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }, 
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
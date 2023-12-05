const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: String,
    postId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    likes:
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    profile:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    replies: [
        {
            profile:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Profile'
            },
            content: String,
            commentId:
            {
                type:mongoose.Schema.Types.ObjectId
            },
            date:
            {
                type: Date,
                default: new Date()
            },
            likes:
            [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }],
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
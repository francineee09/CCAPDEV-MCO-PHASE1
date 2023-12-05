const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:
    {
        type: String,
        required: true,
        unique: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true
    },
    password:
    {
        type: String,
        required: true
    },
    likedPosts:
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    likedComments:
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
});

module.exports = mongoose.model('User', userSchema);
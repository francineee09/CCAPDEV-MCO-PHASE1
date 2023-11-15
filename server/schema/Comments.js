const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    profilePic: {
        type: mongoose.Schema.Types.ObjectId, ref:'Profile'
    },
    content:{
        type: String,
        required: true,
        min: 1
    },
    comment_date:{
        type: Date
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId, ref:'comment'
    }],
    main_comment:{
        type: mongoose.Schema.Types.ObjectId, ref:'comment'
    },
    likes:{
        type: Number,
        default: 0
    }
});

CommentSchema.virtual('like').get(function() {
    return this.username;
});

CommentSchema.pre('find', populateAll);

function populateAll(next){
    this.populate('replies');
    this.populate('username');
    this.populate('likes');
    next();
}

module.exports = mongoose.model('Comment', CommentSchema);

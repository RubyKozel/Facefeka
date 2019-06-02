const mongoose = require('mongoose');

const Post = mongoose.model('Post', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: false
    },
    pictures: {
        type: [String],
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    privacy: {
        type: Boolean,
        default: false
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = { Post };
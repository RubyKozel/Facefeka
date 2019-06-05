const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: false
    },
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    likes: {
        type: Number,
        default: 0
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
    is_comment: {
        type: Boolean,
        default: false
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String,
        default: "../../resources/nopic.png"
    }
});

PostSchema.methods.addComment = async function (_id) {
    const comment = await Post.findOne({_id});
    if (!comment) return Promise.reject();
    const comments = this.comments.concat([_id]);
    const post = this;
    return Post.updateOne({_id: post._id}, {$set: {comments}}, {new: true});
};

PostSchema.methods.addLike = async function (amount) {
    const post = this;
    const likes = post.likes + amount;
    return Post.updateOne({_id: post._id}, {$set: {likes}}, {new: true});
};

const Post = mongoose.model('Post', PostSchema);

module.exports = {Post};
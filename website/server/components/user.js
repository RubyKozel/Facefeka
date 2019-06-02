const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    friendList: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false
    },
    birthday: {
        type: Date,
        default: Date.now
    },
    profile_pic: {
        type: String,
        default: ""
    },
    connected: {
        type: Boolean,
        default: false
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => token);
};

UserSchema.methods.toJSON = function () {
    return _.pick(this.toObject(), ['_id', 'email', 'name', 'birthday', 'connected']);
};

UserSchema.methods.removeToken = function (token) {
    const user = this;
    return User.updateOne({_id: user._id}, {$pull: {tokens: {token}}});
};

UserSchema.statics.findByToken = function (token) {
    let decode;
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return this.findOne({
        '_id': decode._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({email});
    return !user ? Promise.reject() : new Promise((res, rej) => {
        bcrypt.compare(password, user.password, (err, succ) => succ ? res(user) : rej());
    })
};

UserSchema.statics.findByName = async function (name) {
    const users = await User.find({name});
    return !users ? Promise.reject() : users;
};

UserSchema.methods.addFriend = async function (_id) {
    const friend = await User.findOne({_id});
    if (!friend) return Promise.reject();
    let friendList = this.friendList.concat([_id]);
    let friendsFriendList = friend.friendList.concat([this._id]);
    const user = this;
    await User.updateOne({_id}, {$set: {friendList: friendsFriendList}});
    return User.updateOne({_id: user._id}, {$set: {friendList}});
};

UserSchema.methods.removeFriend = async function (_id) {
    const friend = await User.findOne({_id});
    if (!friend) return Promise.reject();
    const user = this;
    await User.updateOne({_id}, {$pull: {friendList: this._id}});
    return User.updateOne({_id: user._id}, {$pull: {friendList: _id}});
};

UserSchema.methods.getAllFriends = function () {
    return this.friendList;
};

UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password'))
        next();
    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
    }));
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
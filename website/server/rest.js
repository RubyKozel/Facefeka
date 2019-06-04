require('./config/config');

const properties = require('../websiteUtils/properties.json');
const routes = properties.routes;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const formData = require('express-form-data');
const cloudinary = require('cloudinary');
const {mongoose} = require('./db/mongoose.js');
const {ObjectID} = require('mongodb');
const {Post} = require('./components/post.js');
const {User} = require('./components/user.js');
const {authenticate, validate} = require('./middleware/authenticate');

const app = express();
const clientPath = path.join(__dirname, '../client');

app.use(express.static(clientPath));
app.use(bodyParser.json());
app.use(formData.parse());

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


/*########## RESTFUL API ########### */

/* ### User Routes ### */

app.post(routes.sign_in, async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        await User.updateOne({_id: user._id}, {$set: {connected: true}}, {new: true});
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post(routes.sign_in_auth, authenticate, async (req, res) => {
    try {
        if (req.user) {
            res.status(200).send(req.user);
        } else {
            res.status(400).send(error);
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post(routes.sign_up, async (req, res) => {
    const body = _.pick(req.body, ['email', 'password', 'name', 'birthday']);
    const user = new User(body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.delete(routes.remove_my_token, authenticate, async (req, res) => {
    try {
        if (req.user) {
            await req.user.removeToken(req.token);
            await User.updateOne({_id: req.user._id}, {$set: {connected: false}}, {new: true});
            res.status(200).send(req.user);
        } else {
            res.status(400).send({message: "not ok"});
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post(routes.get_users, authenticate, async (req, res) => {
    await handleRequest(req.user, res, {message: "not ok"}, () => User.findByName(req.body.name));
});

app.get(routes.get_user_by_id, [authenticate, validate], async (req, res) => {
    await handleRequest(req.user, res, {message: "Unable to find user"}, () => User.findOne({_id: req.params.id}));
});

app.get(routes.get_all_users, async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send(users);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post(routes.add_friend_by_id, [authenticate, validate], async (req, res) => {
    try {
        if (req.user) {
            await req.user.addFriend(req.params.id);
            res.status(200).send(req.user);
        } else {
            res.status(400).send({message: "not ok"});
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

app.delete(routes.remove_friend_by_id, [authenticate, validate], async (req, res) => {
    try {
        if (req.user) {
            await req.user.removeFriend(req.params.id);
            res.status(200).send(req.user);
        } else {
            res.status(400).send({message: "not ok"});
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get(routes.friend_list, authenticate, async (req, res) => {
    await handleRequest(req.user, res, {message: "not ok"}, () => req.user.getAllFriends());
});

app.post(routes.upload_profile_pic, authenticate, async (req, res) => {
    const values = Object.values(req.files);
    cloudinary.uploader
        .upload(values[0].path)
        .then((image) =>
            User.findOneAndUpdate(
                {_id: req.user._id},
                {$set: {profile_pic: image.secure_url}},
                {new: true})
        )
        .then(user => res.status(200).send({picture: user.profile_pic}))
        .catch(e => console.log(e));
});

/* ### Post Routes ### */

app.post(routes.new_post, authenticate, async (req, res) => {
    await handleRequest(req.user, res, {message: "failed to upload post"}, () => new Post({
        text: req.body.text,
        pictures: req.body.pictures ? req.body.pictures : [],
        privacy: req.body.privacy,
        is_comment: false,
        _creator: req.user._id
    }).save());
});

app.delete(routes.delete_post_by_id, [authenticate, validate], async (req, res) => {
    try {
        if (req.user) {
            const resp = await Post.findOneAndDelete({_id: req.params.id, _creator: req.user._id});
            res.status(200).send({message: resp ? "Post was deleted successfully" : "Post couldn't be found"});
        } else {
            res.status(400).send({message: "failed to delete post"});
        }
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get(routes.get_post_by_id, [authenticate, validate], async (req, res) => {
    await handleRequest(req.user, res, {message: "failed to get post"}, () => Post.findOne({_id: req.params.id}));
});

app.get(routes.get_all_posts_by_id, [authenticate, validate], async (req, res) => {
    await handleRequest(req.user, res, {message: "failed to get posts"}, () => Post.find({_creator: req.params.id}), true);
});

app.post(routes.comment_post_by_id, [authenticate, validate], async (req, res) => {
    const newPost = new Post({
        text: req.body.text,
        pictures: req.body.pictures ? req.body.pictures : [],
        privacy: false,
        is_comment: true,
        _creator: req.user._id
    });

    await newPost.save();

    let post = await Post.findOne({_id: req.params.id});
    await handleRequest(post, res, {message: "Couldn't find post"}, () => post.addComment(newPost._id));
});

app.post(routes.like_post_by_id, [authenticate, validate], async (req, res) => {
    const post = await Post.findOne({_id: req.params.id});
    await handleRequest(post, res, {message: "Couldn't find post"}, () => post.addLike(req.body.amount));
});

const handleRequest = async (element, res, error, callback, sorted = false) => {
    try {
        if (element) {
            const retValue = await callback();
            if (retValue != null) {
                if (sorted)
                    res.status(200).send(retValue.sort((a, b) => b.date - a.date));
                else
                    res.status(200).send(retValue);
            } else {
                res.status(400).send(error);
            }
        } else {
            res.status(400).send(error);
        }
    } catch (e) {
        res.status(400).send(e);
    }
};


module.exports = {app};
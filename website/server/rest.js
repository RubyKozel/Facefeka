require('./config/config');

const properties = require('../websiteUtils/properties.json');
const routes = properties.routes;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose.js');
const {Post} = require('./components/post.js');
const {User} = require('./components/user.js');
const {authenticate, validate} = require('./middleware/authenticate');

const app = express();
const clientPath = path.join(__dirname, '../client');

app.use(express.static(clientPath));
app.use(bodyParser.json());


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
    await handleRequest(req, res, {message: "not ok"}, () => User.findByName(req.body.name));
});

app.get(routes.get_user_by_id, [authenticate, validate], async (req, res) => {
    await handleRequest(req, res, {message: "Unable to find user"}, () => User.findOne({_id: req.params.id}));
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
    await handleRequest(req, res, {message: "not ok"}, () => req.user.getAllFriends());
});

/* ### Post Routes ### */

app.post(routes.new_post, authenticate, async (req, res) => {
    await handleRequest(req, res, {message: "failed to upload post"}, () => new Post({
        text: req.body.text,
        pictures: req.body.pictures ? req.body.pictures : [],
        privacy: req.body.privacy,
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
    await handleRequest(req, res, {message: "failed to get post"}, () => Post.findOne({_id: req.params.id}));
});

app.get(routes.get_all_posts_by_id, [authenticate, validate], async (req, res) => {
    await handleRequest(req, res, {message: "failed to get posts"}, () => Post.find({_creator: req.params.id}));
});

const handleRequest = async (req, res, error, callback) => {
    try {
        if (req.user) {
            const retValue = await callback();
            res.status(200).send(retValue);
        } else {
            res.status(400).send(error);
        }
    } catch (e) {
        res.status(400).send(e);
    }
};


module.exports = {app};
const {User} = require('../components/user');
const {ObjectID} = require('mongodb');

const authenticate = async (req, res, next) => {
    const token = req.header('x-auth');
    try {
        const user = await User.findByToken(token);
        if (!user) next();
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).send(e);
    }
};

const validate = async (req, res, next) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(400).send({message: "Invalid ID!"});
    } else {
        next();
    }
};

module.exports = { authenticate, validate };
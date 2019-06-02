const {app} = require('./rest.js');
const {User} = require('./components/user');
const moment = require('moment');
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT || 3000;

const generateMessage = (from, text) => {
    const createdAt = moment().valueOf();
    return {from, text, createdAt};
};

const socketMap = {};

io.on('connect',socket => {
    console.log("User connected");

    socket.on('new user', id => {
        socketMap[id] = socket;
    });

    socket.on('join', async (id1, id2) => {
        const unique = id1.concat(id2);
        // register the current socket
        socket.join(unique);
        // register the receiver socket
        let otherSocket = socketMap[id2];
        if (otherSocket) otherSocket.join(unique);
        const user1 = await User.findOne({_id: id1});
        const user2 = await User.findOne({_id: id2});
        io.sockets.in(unique).emit('newMessage', generateMessage('Facefeka', `Private room was created for ${user1.name} and ${user2.name}`));
    });

    socket.on('createMessage', async ({from, text, to}) => {
        const unique = from.concat(to);
        const fromUser = await User.findOne({_id: from});
        io.sockets.in(unique).emit('new message', generateMessage(fromUser.name, text));
    });

    socket.on('leave', (id1, id2) => {
        const unique = id1.concat(id2);
        socket.leave(unique);
        let otherSocket = socketMap[id2];
        if (otherSocket) otherSocket.leave(unique);

    });

    socket.on('disconnect',() => {
        for (let s of socketMap) {
            if (socketMap[s] === socket) {
                delete socketMap[s];
                break;
            }
        }
    });
});

server.listen(port, () => console.log(`listening at port ${port}`));
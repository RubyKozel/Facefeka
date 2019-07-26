const socket = io();
let updateFunction;
let applyError;

const setUpdateFunction = (stateUpdateFunction) => {
    updateFunction = stateUpdateFunction;
};

const setErrorFunction = (errorFunction) => {
    applyError = errorFunction;
};

const newConnection = (id) => {
    socket.emit('newConnection', id);
};

const invite = (id) => {
    socket.emit('invite', id);
};

socket.on('send invitation', () => updateFunction());

socket.on('error', () => applyError());

module.exports = {
    newConnection,
    invite,
    socket,
    setUpdateFunction,
    setErrorFunction
};

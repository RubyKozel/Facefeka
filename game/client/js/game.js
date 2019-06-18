const conn = new WebSocket('ws://localhost:4000');

const canvas = document.getElementById('game');
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const context = canvas.getContext('2d');

let gameInterval = null;
let lastUpdate = 0;
let deltaTime = 0;
let keyUp = false;
let keyDown = false;
let currPlayerCoords = [];

document.onkeydown = (e) => {
    e = e || window.event;
    if (e.code === 'ArrowUp') {
        keyUp = true;
        keyDown = false;
    }
    else if (e.code === 'ArrowDown') {
        keyDown = true;
        keyUp = false;
    }
};

const calculateTime = () => {
    let now = Date.now();
    deltaTime = (now - lastUpdate) / 1000;
    if (deltaTime > 1) deltaTime = 0;
    lastUpdate = now;
};

const play = () => {
    calculateTime();
    const number = localStorage.getItem('roomNumber');
    const index = parseInt(localStorage.getItem('myIndex'));
    conn.send(JSON.stringify({type: 'status', keyUp, keyDown, deltaTime, number, index}));
    keyUp = false;
    keyDown = false;
};

const draw = (players) => {
    let x = 0;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    players.forEach((player, i) => {
        context.beginPath();
        context.fillRect(x, player.y, 5, 30);
        currPlayerCoords[i] = {x, y: player.y};
        x = 295;
    });
};

const drawBall = ({ballX, ballY}) => {
    context.beginPath();
    context.arc(ballX, ballY, 2, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
};

conn.onopen = () => {
    if (localStorage.getItem('action') === 'create') {
        conn.send(JSON.stringify({type: 'createRoom'}));
        conn.send(JSON.stringify({type: 'subscribe', value: 0}));
        conn.send(JSON.stringify({'type': 'name', value: localStorage.getItem('name'), element: 'player-0'}));
        localStorage.setItem('myIndex', '0');
        localStorage.removeItem('action');
    } else if (localStorage.getItem('action') === 'subscribe') {
        conn.send(JSON.stringify({type: 'subscribe', value: 1}));
        conn.send(JSON.stringify({'type': 'name', value: localStorage.getItem('name'), element: 'player-1'}));
        conn.send(JSON.stringify({type: 'start'}));
        localStorage.setItem('myIndex', '1');
        localStorage.removeItem('action');

    }
};


conn.onmessage = (e) => {
    const response = JSON.parse(e.data);
    switch (response.type) {
        case 'name':
            console.log(response.value);
            for (const key in response.value) {
                if (response.value.hasOwnProperty(key))
                    document.getElementById(key).innerText = response.value[key];
            }
            break;
        case 'subscribe':
            localStorage.setItem('roomNumber', response.value);
            break;
        case 'unsubscribe':
            localStorage.removeItem('roomNumber');
            localStorage.removeItem('action');
            break;
        case 'start':
            gameInterval = setInterval(play, 1000 / 60);
            break;
        case 'players':
            draw(Object.values(response.value));
            break;
        case 'ball':
            drawBall(response.value);
            break;
        case 'game over':
            clearInterval(gameInterval);
            const element = `player-${response.value}`;
            alert(`Game over! ${document.getElementById(element).innerHTML} has won!!`);

    }
};






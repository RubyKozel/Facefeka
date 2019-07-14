const properties = require('../../../website/websiteUtils/properties.json');
const {base_url, routes} = properties;
const canvas = document.getElementById('game');
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const context = canvas.getContext('2d');

const conn = new WebSocket(`ws://${base_url}:${process.env.PHP_PORT}`);

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
    } else if (e.code === 'ArrowDown') {
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
    const type = 'status';
    conn.send(JSON.stringify({type, keyUp, keyDown, deltaTime, number, index}));
    keyUp = false;
    keyDown = false;
};

const draw = (players) => {
    let x = 0;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    players.forEach(({y}, i) => {
        context.beginPath();
        context.fillRect(x, y, 5, 30);
        currPlayerCoords[i] = {x, y};
        x = 295;
    });
};

const drawBall = ({ballX, ballY}) => {
    context.beginPath();
    context.arc(ballX, ballY, 2, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
};

conn.onopen = () => init[localStorage.getItem('action')](localStorage.getItem('name'));

conn.onmessage = async (e) => {
    const response = JSON.parse(e.data);
    actions[response.type](response);
};

const init = {
    'create': (name) => initiateGame([
        {type: 'createRoom'},
        {type: 'subscribe', value: 0},
        {type: 'name', value: name, element: 'player-0'}
    ], '0'),
    'subscribe': (name) => initiateGame([
        {type: 'subscribe', value: 1},
        {type: 'name', value: name, element: 'player-1'},
        {type: 'start'}
    ], '1')
};

const initiateGame = (messages, index) => {
    messages.forEach(msg => conn.send(JSON.stringify(msg)));
    localStorage.setItem('myIndex', index);
    localStorage.removeItem('action');
};

const actions = {
    'name': (response) => {
        for (const key in response.value) {
            if (response.value.hasOwnProperty(key))
                document.getElementById(key).innerText = response.value[key];
        }
    },
    'subscribe': (response) => {
        localStorage.setItem('roomNumber', response.value)
    },
    'unsubscribe': (response) => {
        localStorage.removeItem('roomNumber');
        localStorage.removeItem('action');
    },
    'start': (response) => {
        gameInterval = setInterval(play, 1000 / 60);
    },
    'players': (response) => {
        draw(Object.values(response.value));
    },
    'ball': (response) => {
        drawBall(response.value);
    },
    'game over': async (response) => {
        clearInterval(gameInterval);
        const element = `player-${response.value}`;
        if (localStorage.getItem('myIndex') === response.value) {
            const response = await fetch(`${base_url}${routes.add_score_by_id}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    "Content-Type": "application/json",
                    'x-auth': localStorage.getItem('x-auth')
                }
            });
            if (response.status && response.status === 200) {
                const json = await response.json();
                const score = json.score;
                conn.send(JSON.stringify({
                    type: 'alert_winner',
                    value: score,
                    winner: `${document.getElementById(element).innerHTML}`
                }));
            } else {
                console.log("error in getting scores");
            }

        }
    },
    'alert_winner': (response) => {
        const winner = response.winner;
        const winner_score = response.score;
        alert(`${winner} has won!! his score is ${winner_score}!`);
    }
};






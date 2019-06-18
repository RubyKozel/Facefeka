import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home'
import fetch_user from './utils/fetch_user'
import {newConnection} from './utils/invitationSockets'

fetch_user()
    .then(user => {
        newConnection(user._id);
        ReactDOM.render(<Home user={user}/>, document.querySelector('.container'));
    })
    .catch(() => {
        alert('You have to be signed in first!');
        window.location.href = '/facefeka'
    });
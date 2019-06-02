import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home'
import fetch_user from './utils/fetch_user'

let cached_user;

fetch_user().then((user) => {
    cached_user = user;
    ReactDOM.render(<Home user={cached_user}/>, document.querySelector('.container'));
}).catch(() => {
    alert('You have to be signed in first!');
    cached_user = null;
    window.location.href = '/'
});
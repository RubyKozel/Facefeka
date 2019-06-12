import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home'
import fetch_user from './utils/fetch_user'


fetch_user()
    .then(user => ReactDOM.render(<Home user={user}/>, document.querySelector('.container')))
    .catch(() => {
        alert('You have to be signed in first!');
        window.location.href = '/'
    });
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home'
import {fetchUser} from './utils/fetch_user'
import {newConnection} from './utils/invitationSockets'

(async () => {
    try {
        const user = await fetchUser();
        newConnection(user._id);
        ReactDOM.render(<Home user={user}/>, document.querySelector('.container'));
    } catch (e) {
        alert('You have to be signed in first!');
        window.location.href = '/facefeka'
    }
})();
import React from 'react';
import ReactDOM from 'react-dom';
import ProfilePage from './components/ProfilePage';
import {fetchUser} from './utils/fetch_user';

(async () => {
    try {
        const user = await fetchUser();
        const user_profile = localStorage.getItem('user_profile') ? JSON.parse(localStorage.getItem('user_profile')).user_profile : user;
        ReactDOM.render(<ProfilePage user={user} user_profile={user_profile}/>, document.querySelector('.container'));
        localStorage.removeItem('user_profile');
    } catch (e) {
        alert('You have to be signed in first!');
        window.location.href = '/facefeka'
    }
})();
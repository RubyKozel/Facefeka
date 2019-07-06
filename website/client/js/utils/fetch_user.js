import properties from '../../../websiteUtils/properties.json';
import {POST_AUTH} from './requests.js';

const {base_url, routes} = properties;

export const fetchUser = async () => {
    const response = await POST_AUTH(`${base_url}${routes.sign_in_auth}`);
    if (await response.status !== 200) {
        alert('You have to be signed in first!');
        window.location.href = '/facefeka'
    } else {
        return await response.json();
    }
};
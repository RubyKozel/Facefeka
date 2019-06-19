import properties from '../../../websiteUtils/properties.json';

const {base_url, routes} = properties;

const fetch_user = async () => {
    const response = await fetch(`${base_url}${routes.sign_in_auth}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            'x-auth': localStorage.getItem('x-auth')
        }
    });

    if (await response.status !== 200) {
        alert('You have to be signed in first!');
        window.location.href = '/facefeka'
    } else {
        return await response.json();
    }
};

export default fetch_user;
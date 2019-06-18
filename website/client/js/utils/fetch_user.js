import properties from '../../../websiteUtils/properties.json';

const fetch_user = async () => {
    const response = await fetch(`${properties.base_url}${properties.routes.sign_in_auth}`, {
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
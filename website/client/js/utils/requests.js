export const POST_AUTH = async (url, body = {}) => {
    return await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            'x-auth': localStorage.getItem('x-auth')
        },
        body: JSON.stringify(body)
    });
};

export const POST = async (url, body = {}) => {
    return await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });
};

export const POST_FORM_DATA_AUTH = async (url, formData) => {
    return await fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: formData,
        headers: {
            'x-auth': localStorage.getItem('x-auth')
        }
    });
};

export const DELETE = async (url, body = {}) => {
    return await fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            'x-auth': localStorage.getItem('x-auth')
        },
        body: JSON.stringify(body)
    });
};

export const GET = async (url) => {
    return await fetch(url, {
        method: 'GET',
        mode: 'cors'
    });
};

export const GET_AUTH = async (url) => {
    return await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
            'x-auth': localStorage.getItem('x-auth')
        },
    });
};

//module.exports = {POST, POST_AUTH, POST_FORM_DATA_AUTH, GET, GET_AUTH, DELETE};
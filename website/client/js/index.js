import properties from '../../websiteUtils/properties.json';

$(document).ready(() => {
    const base_url = properties.base_url;
    const routes = properties.routes;

    const error_cred = $('#error-cred');
    error_cred.hide();
    const form = $('#login-form');
    form.on('submit', (e) => {
        e.preventDefault();
        const email = form.find('input[id="email"]').val();
        const password = form.find('input[id="password"]').val();
        const rememberMe = form.find('input[id="remember-me"]').is(":checked");

        $.ajax({
            type: "POST",
            url: `${base_url}${routes.sign_in}`,
            data: JSON.stringify({email, password}),
            success: (data, textStatus, xhr) => {
                localStorage.setItem('remember', rememberMe ? "true" : "false");
                localStorage.setItem('x-auth', xhr.getResponseHeader('x-auth'));
                window.location.href = '/facefeka/front.html'
            },
            error: (e) => {
                error_cred.html('Email or password are incorrect');
                error_cred.show();
                $('#login-box').css('height', '360px');
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        });
    });

    if (localStorage.getItem('remember') === 'true') {
        $.ajax({
            type: "POST",
            url: `${base_url}${routes.sign_in_auth}`,
            data: {},
            headers: {
                'x-auth': localStorage.getItem('x-auth')
            },
            success: (data, textStatus, xhr) => {
                window.location.href = '/facefeka/front.html'
            },
            error: (e) => {
                alert("Your token has expired, please login again!");
                localStorage.removeItem('remember');
                localStorage.removeItem('x-auth');
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        });
    }

    if (localStorage.getItem('remember') === 'false') {
        $.ajax({
            type: "DELETE",
            url: `${base_url}${routes.remove_my_token}`,
            data: {},
            headers: {
                'x-auth': localStorage.getItem('x-auth')
            },
            success: () => {
                localStorage.removeItem('remember');
                localStorage.removeItem('x-auth');
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        });
    }
});
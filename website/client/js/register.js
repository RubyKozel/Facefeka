import properties from '../../websiteUtils/properties.json';

$(document).ready(() => {
    const error_email = $('#error-email');
    const error_password = $('#error-password');
    error_email.hide();
    error_password.hide();

    const register = $("#register-form");

    register.on('submit', (e) => {
        e.preventDefault();

        const firstname = register.find('input[id="firstname"]');
        const lastname = register.find('input[id="lastname"]');
        const email = register.find('input[id="email"]');
        const password = register.find('input[id="password"]');
        const birthday = register.find('input[id="birthday"]');

        const form = {
            name: `${firstname.val()} ${lastname.val()}`,
            email: email.val(),
            password: password.val(),
            birthday: new Date(birthday.val())
        };

        $.ajax({
            type: "POST",
            url: `${properties.base_url}${properties.routes.sign_up}`,
            data: JSON.stringify(form),
            success: () => {
                alert(`Welcome to facefeka ${form.name}`);
                window.location.href = '/';
            },
            error: (e) => {
                const resp = e.responseJSON;

                if (resp.errmsg) {
                    email.addClass('invalid');
                    error_email.html('Email already exists');
                    error_email.show();
                } else {
                    const errors = resp.errors;
                    if (errors.email) {
                        email.addClass('invalid');
                        error_email.html('Invalid email');
                        error_email.show();
                    }

                    if (errors.password) {
                        password.addClass('invalid');
                        error_password.html('Password should be minimum 6 characters');
                        error_password.show();
                    }
                }
            },
            dataType: "json",
            contentType: "application/json; charset=utf-8",
        });
    });
});
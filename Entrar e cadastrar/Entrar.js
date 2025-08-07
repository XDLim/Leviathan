document.addEventListener('DOMContentLoaded', () => {
    const loginToggle = document.getElementById('login-toggle');
    const registerToggle = document.getElementById('register-toggle');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    function showForm(formToShow, formToHide, toggleActive, toggleInactive) {
        formToHide.classList.remove('active');
        toggleInactive.classList.remove('active');
        
        formToShow.classList.add('active');
        toggleActive.classList.add('active');
    }

    loginToggle.addEventListener('click', () => {
        showForm(loginForm, registerForm, loginToggle, registerToggle);
    });

    registerToggle.addEventListener('click', () => {
        showForm(registerForm, loginForm, registerToggle, loginToggle);
    });
});
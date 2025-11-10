const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Validação em tempo real
emailInput.addEventListener('blur', validateEmail);
passwordInput.addEventListener('blur', validatePassword);

function validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        emailError.style.display = 'block';
        emailInput.style.borderColor = '#ef4444';
        return false;
    } else {
        emailError.style.display = 'none';
        emailInput.style.borderColor = 'rgba(42, 42, 42, 0.8)';
        return true;
    }
}

function validatePassword() {
    if (passwordInput.value.length < 6) {
        passwordError.style.display = 'block';
        passwordInput.style.borderColor = '#ef4444';
        return false;
    } else {
        passwordError.style.display = 'none';
        passwordInput.style.borderColor = 'rgba(42, 42, 42, 0.8)';
        return true;
    }
}

// Submit do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
        const email = emailInput.value;
        const password = passwordInput.value;
        const remember = document.getElementById('remember').checked;

        console.log('Login:', { email, password, remember });
        
        // Aqui você vai conectar com seu banco de dados
        alert('Login realizado com sucesso!\n\nQuando conectar o banco de dados, substitua este alert pela lógica de autenticação.');
        
        // Exemplo de redirecionamento após login
        // window.location.href = 'dashboard.html';
    }
});

// Login com Google
function loginWithGoogle() {
    console.log('Login com Google iniciado');
    
    // Aqui você vai implementar o OAuth do Google
    alert('Login com Google!\n\nImplemente a autenticação OAuth do Google aqui.');
}

// Limpar erros ao digitar
emailInput.addEventListener('input', function() {
    if (emailError.style.display === 'block') {
        emailError.style.display = 'none';
        emailInput.style.borderColor = 'rgba(42, 42, 42, 0.8)';
    }
});

passwordInput.addEventListener('input', function() {
    if (passwordError.style.display === 'block') {
        passwordError.style.display = 'none';
        passwordInput.style.borderColor = 'rgba(42, 42, 42, 0.8)';
    }
});
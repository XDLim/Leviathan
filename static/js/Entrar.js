// ========== VALIDAÇÃO DE FORMULÁRIO ==========
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
        
        
        // Exemplo de redirecionamento após login
        // window.location.href = 'dashboard.html';
    }
});

// Login com Google
function loginWithGoogle() {
    console.log('Login com Google iniciado');
    
    // Aqui você vai implementar o OAuth do Google
    <script src="https://accounts.google.com/gsi/client" async></script>
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


// ========== CARROSSEL DE VÍDEOS AJUSTADO (Apenas Autoplay) ==========
let currentSlide = 0;
const slides = document.querySelectorAll('.video-slide');
// Indicadores removidos: const indicators = document.querySelectorAll('.indicator');
const totalSlides = slides.length;

// Tempo para trocar de slide automaticamente (em milissegundos)
const autoPlayInterval = 8000; // 8 segundos
let autoPlayTimer;

// Iniciar o carrossel
function initCarousel() {
    showSlide(0);
    startAutoPlay();
}

// Mostrar slide específico
function showSlide(index) {
    // Parar o vídeo anterior
    const previousVideo = slides[currentSlide].querySelector('video');
    if (previousVideo) {
        previousVideo.pause();
    }

    // Remover classe active de todos os slides
    slides.forEach(slide => slide.classList.remove('active'));
    // Indicadores removidos: indicators.forEach(indicator => indicator.classList.remove('active'));

    // Garantir que o índice está dentro do range
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }

    // Adicionar classe active no slide atual
    slides[currentSlide].classList.add('active');
    // Indicadores removidos: indicators[currentSlide].classList.add('active');

    // Iniciar o novo vídeo
    const currentVideo = slides[currentSlide].querySelector('video');
    if (currentVideo) {
        currentVideo.play();
    }
}

// REMOVIDO: changeSlide e goToSlide

// Iniciar reprodução automática
function startAutoPlay() {
    autoPlayTimer = setInterval(() => {
        showSlide(currentSlide + 1);
    }, autoPlayInterval);
}

// Parar reprodução automática
function stopAutoPlay() {
    clearInterval(autoPlayTimer);
}

// REMOVIDO: Adicionar eventos de clique nos indicadores

// Pausar autoplay quando passar o mouse sobre o carrossel
const videoCarousel = document.querySelector('.video-carousel');
videoCarousel.addEventListener('mouseenter', stopAutoPlay);
videoCarousel.addEventListener('mouseleave', startAutoPlay);

// Iniciar o carrossel quando a página carregar
window.addEventListener('load', initCarousel);
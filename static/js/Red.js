document.addEventListener('DOMContentLoaded', () => {

    const mainGameImage = document.getElementById('mainGameImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');

    let currentIndex = 0;

    function updateCarousel(newIndex) {
        // Remover a classe 'active' do thumbnail anterior
        if (thumbnails[currentIndex]) {
            thumbnails[currentIndex].classList.remove('active');
        }

        // Lógica de loop do carrossel
        currentIndex = newIndex;
        if (currentIndex < 0) {
            currentIndex = thumbnails.length - 1;
        } else if (currentIndex >= thumbnails.length) {
            currentIndex = 0;
        }

        // Adicionar a classe 'active' ao novo thumbnail
        if (thumbnails[currentIndex]) {
            thumbnails[currentIndex].classList.add('active');

            // ATENÇÃO: Mudança principal aqui. Agora pegamos o 'src' diretamente do thumbnail.
            const newImageSrc = thumbnails[currentIndex].src;
            mainGameImage.src = newImageSrc;
        }
    }

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    leftArrow.addEventListener('click', () => {
        updateCarousel(currentIndex - 1);
    });

    rightArrow.addEventListener('click', () => {
        updateCarousel(currentIndex + 1);
    });

    const gameTabs = document.querySelectorAll('.game-tabs .tab-item');
    const allTabContents = document.querySelectorAll('.tab-content-container > .tab-content');

    gameTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();

            gameTabs.forEach(t => t.classList.remove('active'));
            event.currentTarget.classList.add('active');

            allTabContents.forEach(content => {
                content.classList.remove('active');
            });

            const targetTab = event.currentTarget.dataset.tab;
            let targetContentId;

            if (targetTab === 'overview') {
                targetContentId = 'overview-wrapper';
            } else if (targetTab === 'genres') {
                targetContentId = 'genres-content';
            }

            const activeContent = document.getElementById(targetContentId);
            if (activeContent) {
                activeContent.classList.add('active');
                console.log(`Aba "${event.currentTarget.textContent}" clicada! Conteúdo de "${targetContentId}" exibido.`);

                if (targetTab === 'overview') {
                    updateCarousel(0);
                }
            }
        });
    });

    // Inicializa o carrossel na primeira imagem assim que a página carrega
    updateCarousel(0);
});
// Aguarda o carregamento completo do documento HTML
document.addEventListener('DOMContentLoaded', () => {

    // Lógica para a barra de preço
    const sliderPreco = document.getElementById('slider-preco');
    const valorPreco = document.getElementById('valor-preco');

    // Adiciona um "ouvinte de evento" para o movimento do slider
    sliderPreco.addEventListener('input', () => {
        // Atualiza o texto do span com o valor atual do slider
        valorPreco.textContent = `R$ ${sliderPreco.value}`;
    });

    // Lógica para os botões de ordenação
    const botoesOrdenacao = document.querySelectorAll('.botao-ordenacao');

    botoesOrdenacao.forEach(botao => {
        botao.addEventListener('click', (evento) => {
            // Previne o comportamento padrão do link
            evento.preventDefault(); 

            // Remove a classe 'ativo' de todos os botões
            botoesOrdenacao.forEach(btn => btn.classList.remove('ativo'));

            // Adiciona a classe 'ativo' no botão clicado
            evento.target.classList.add('ativo');

            // Aqui você pode adicionar a lógica para ordenar os jogos
            const tipoOrdenacao = evento.target.textContent.trim();
            console.log(`Ordenando por: ${tipoOrdenacao}`);
            // Por exemplo, você pode chamar uma função para reordenar a lista de jogos:
            // ordenarJogos(tipoOrdenacao);
        });
    });
});
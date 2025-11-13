// desejos_leviathan.js

// CHAVE DE ARMAZENAMENTO NO NAVEGADOR
const CHAVE_DESEJOS = 'listaDesejosLeviathan';

// DADOS DE EXEMPLO (CATÁLOGO DE JOGOS)
// Estes dados são necessários para que o JS saiba o NOME e o PREÇO de cada ID
const CATALOGO_JOGOS = [
    { id: 2, nome: 'Elden Ring', preco: 249.90, plataforma: 'Multi', imagem: '../static/imagens/menu/Elden Ring.jpg', emPromocao: false, precoAntigo: null },
    { id: 5, nome: 'God of War Ragnarök', preco: 199.92, plataforma: 'PS5/PC', imagem: '../static/imagens/menu/God of War.png', emPromocao: true, precoAntigo: 349.99 },
    { id: 4, nome: 'Fortnite', preco: 0.00, plataforma: 'Multi', imagem: '../static/imagens/menu/Fortnite.png', emPromocao: false, precoAntigo: null },
    // Adicione os outros 8 jogos aqui...
];

// ===========================================
// FUNÇÕES DE MANIPULAÇÃO DO LOCAL STORAGE
// ===========================================

/**
 * Lê a lista de desejos salva no localStorage.
 * @returns {Array<number>} Um array de IDs de jogos na lista.
 */
function lerListaDesejos() {
    const desejosString = localStorage.getItem(CHAVE_DESEJOS);
    // Retorna a lista salva (convertida para array) ou um array vazio.
    return desejosString ? JSON.parse(desejosString) : [];
}

/**
 * Salva a lista de desejos atualizada no localStorage.
 * @param {Array<number>} listaAtual O array de IDs a ser salvo.
 */
function salvarListaDesejos(listaAtual) {
    localStorage.setItem(CHAVE_DESEJOS, JSON.stringify(listaAtual));
}

// ===========================================
// FUNCIONALIDADES PRINCIPAIS
// ===========================================

/**
 * Remove um item específico da lista de desejos.
 * @param {number} jogoId O ID do jogo a ser removido.
 */
function removerItem(jogoId) {
    let lista = lerListaDesejos();
    
    // Filtra (mantém) apenas os IDs que SÃO DIFERENTES do ID a ser removido
    const novaLista = lista.filter(id => id !== jogoId);
    
    salvarListaDesejos(novaLista);
    
    // Atualiza a interface (re-renderiza a lista)
    renderizarListaDesejos();
}

/**
 * Limpa toda a lista de desejos (remover todos os itens).
 */
function limparLista() {
    // Confirmação para evitar exclusão acidental
     {
        localStorage.removeItem(CHAVE_DESEJOS); // Remove a chave do localStorage
        renderizarListaDesejos(); // Atualiza a interface
    }
}

// ===========================================
// FUNÇÃO DE RENDERIZAÇÃO DA INTERFACE
// ===========================================

/**
 * Renderiza (desenha) a lista de desejos na página HTML.
 */
function renderizarListaDesejos() {
    const listaDesejosIDs = lerListaDesejos();
    const container = document.querySelector('.container_itens_desejos_leviathan');
    
    // Limpa o conteúdo atual do container
    container.innerHTML = '';
    
    if (listaDesejosIDs.length === 0) {
        // Exibe a mensagem de lista vazia
        container.innerHTML = `<p class="mensagem_lista_vazia_leviathan">Sua Lista de Desejos está vazia. Adicione alguns jogos!</p>`;
        // Esconde o botão de Limpar Lista
        document.querySelector('.btn_limpar_lista_leviathan').style.display = 'none';
        return;
    }

    // Garante que o botão Limpar Lista esteja visível
    document.querySelector('.btn_limpar_lista_leviathan').style.display = 'inline-block';

    listaDesejosIDs.forEach(jogoId => {
        const jogo = CATALOGO_JOGOS.find(j => j.id === jogoId);

        // Se o jogo não for encontrado no catálogo, ignora
        if (!jogo) return;

        // Formatação de Preço
        const precoFormatado = `R$ ${jogo.preco.toFixed(2).replace('.', ',')}`;
        let precoElemento = `<span class="item_preco_atual_leviathan">${precoFormatado}</span>`;
        
        if (jogo.emPromocao) {
            const precoAntigoFormatado = `R$ ${jogo.precoAntigo.toFixed(2).replace('.', ',')}`;
            precoElemento = `
                <span class="item_preco_atual_leviathan promocao">
                    <span class="preco_antigo_leviathan">${precoAntigoFormatado}</span>
                    ${precoFormatado}
                </span>`;
        } else if (jogo.preco === 0) {
             precoElemento = `<span class="item_preco_atual_leviathan gratis">Grátis</span>`;
        }

        // HTML do item a ser inserido (usando as classes do seu CSS)
        const itemHTML = `
            <div class="item_desejo_leviathan" data-id="${jogo.id}">
                <figure class="item_imagem_leviathan">
                    <img src="${jogo.imagem}" alt="Capa do Jogo ${jogo.nome}">
                </figure>
                <div class="item_detalhes_leviathan">
                    <h3 class="item_nome_leviathan">${jogo.nome}</h3>
                    <p class="item_plataforma_leviathan">Plataforma: ${jogo.plataforma}</p>
                    ${precoElemento}
                </div>
                <div class="item_acoes_leviathan">
                    <button class="btn_mover_carrinho_leviathan" onclick="adicionarAoCarrinho(${jogo.id})"> Mover para o Carrinho</button>
                    <button class="btn_remover_desejo_leviathan" onclick="removerItem(${jogo.id})">Remover</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', itemHTML);
    });
}

// ===========================================
// INICIALIZAÇÃO E LISTENERS
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderiza a lista ao carregar a página
    renderizarListaDesejos();
    
    // 2. Adiciona o listener para o botão de limpar lista
    const btnLimpar = document.querySelector('.btn_limpar_lista_leviathan');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', limparLista);
    }
    
    // 3. Adiciona alguns itens de exemplo na primeira vez que o usuário entrar
    // APENAS PARA TESTE. Remova esta parte na versão final.
    if (lerListaDesejos().length === 0) {
        salvarListaDesejos([2, 5, 4]); 
        renderizarListaDesejos();
    }
});

// A função 'adicionarAoCarrinho' é a mesma que você usou antes,
// mas deve ser definida ou importada aqui para que o botão 'Mover para o Carrinho' funcione.
// Para fins de demonstração do Desejos, vamos deixá-la aqui:

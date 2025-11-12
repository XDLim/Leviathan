// carrinho_leviathan.js
// Funcionalidades de manipulação, cálculo e renderização do Carrinho de Compras.

// ===========================================
// 1. CONFIGURAÇÕES
// ===========================================
const CHAVE_CARRINHO = 'carrinhoLeviathan';

// DADOS DE REFERÊNCIA (CATÁLOGO DE JOGOS)
// Usado para buscar nome, preço e imagem baseado no ID.
const CATALOGO_JOGOS = [
    { id: 2, nome: 'Elden Ring', preco: 249.90, plataforma: 'Multi', imagem: 'caminho/para/imagem/eldenring/capa.jpg' },
    { id: 5, nome: 'God of War Ragnarök', preco: 299.99, plataforma: 'PS5/PC', imagem: 'caminho/para/imagem/godofwar/capa.jpg' },
    { id: 1, nome: 'Cyberpunk 2077', preco: 199.90, plataforma: 'Multi', imagem: 'caminho/para/imagem/cyberpunk/capa.jpg' },
    // Adicione o restante do seu catálogo aqui...
];

// ===========================================
// 2. FUNÇÕES DE ARMAZENAMENTO (LOCAL STORAGE)
// ===========================================

/**
 * Lê os itens do carrinho salvos no localStorage.
 * @returns {Array<{id: number, quantidade: number}>} O array de itens do carrinho.
 */
function lerCarrinho() {
    const carrinhoString = localStorage.getItem(CHAVE_CARRINHO);
    // Garante que o formato seja Array, mesmo que localStorage esteja vazio ou corrompido.
    return carrinhoString ? JSON.parse(carrinhoString) : [];
}

/**
 * Salva o estado atual do carrinho no localStorage.
 * @param {Array<{id: number, quantidade: number}>} carrinhoAtual O array de itens a ser salvo.
 */
function salvarCarrinho(carrinhoAtual) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinhoAtual));
}

// ===========================================
// 3. LÓGICA DO CARRINHO
// ===========================================

/**
 * Remove um item específico do carrinho.
 * Esta função é chamada ao clicar no 'X' ou quando a quantidade chega a zero.
 * @param {number} jogoId O ID do jogo a ser removido.
 */
window.removerItem = function(jogoId) {
    let carrinho = lerCarrinho();
    
    // Filtra (mantém) apenas os itens que SÃO DIFERENTES do ID a ser removido
    const novoCarrinho = carrinho.filter(item => item.id !== jogoId);
    
    salvarCarrinho(novoCarrinho);
    renderizarCarrinho(); // Atualiza a interface
}

/**
 * Ajusta a quantidade de um item no carrinho.
 * Esta função é chamada ao clicar nos botões '+' e '-'.
 * @param {number} jogoId O ID do jogo.
 * @param {number} delta O valor para ajustar a quantidade (+1 ou -1).
 */
window.ajustarQuantidade = function(jogoId, delta) {
    let carrinho = lerCarrinho();
    const item = carrinho.find(i => i.id === jogoId);
    
    if (item) {
        item.quantidade += delta;
        
        // Se a quantidade cair para 0 ou menos, remove o item
        if (item.quantidade < 1) {
            removerItem(jogoId);
            return;
        }
        
        salvarCarrinho(carrinho);
    }
    
    renderizarCarrinho(); // Atualiza a interface
}

// ===========================================
// 4. CÁLCULOS E FORMATAÇÃO
// ===========================================

/**
 * Calcula o subtotal e o total final do carrinho.
 * @param {Array<{id: number, quantidade: number}>} carrinho O carrinho atual.
 * @returns {{subtotal: number, total: number}} O objeto com os totais.
 */
function calcularTotais(carrinho) {
    let subtotal = 0;
    
    carrinho.forEach(item => {
        const jogo = CATALOGO_JOGOS.find(j => j.id === item.id);
        if (jogo) {
            subtotal += jogo.preco * item.quantidade;
        }
    });
    
    const frete = 0; // Frete Grátis
    const total = subtotal + frete;
    
    return { subtotal, total };
}

/**
 * Formata um valor numérico para o formato de moeda brasileira (R$).
 * @param {number} valor O valor numérico.
 * @returns {string} O valor formatado (ex: R$ 1.000,00).
 */
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

// ===========================================
// 5. RENDERIZAÇÃO DA INTERFACE (A FUNÇÃO CENTRAL)
// ===========================================

/**
 * Renderiza (desenha) todos os itens e atualiza os totais na página.
 */
function renderizarCarrinho() {
    const carrinho = lerCarrinho();
    const containerItens = document.querySelector('.carrinho-itens-lista');
    const resumoSubtotal = document.getElementById('subtotal');
    const resumoTotal = document.getElementById('total-final');
    const btnCheckout = document.querySelector('.btn-checkout');

    // 1. Limpa o conteúdo atual do container
    containerItens.innerHTML = '';
    
    if (carrinho.length === 0) {
        // Exibe a mensagem de carrinho vazio
        containerItens.innerHTML = `<p id="carrinho-vazio-mensagem">Seu carrinho está vazio.</p>`;
        
        // Zera totais e desabilita o botão
        const zeroMoeda = formatarMoeda(0);
        if (resumoSubtotal) resumoSubtotal.textContent = zeroMoeda;
        if (resumoTotal) resumoTotal.textContent = zeroMoeda;
        if (btnCheckout) btnCheckout.style.display = 'none';

        return;
    }

    // 2. Garante que o botão de checkout esteja visível
    if (btnCheckout) btnCheckout.style.display = 'block';

    // 3. RENDERIZA OS ITENS
    carrinho.forEach(item => {
        const jogo = CATALOGO_JOGOS.find(j => j.id === item.id);

        if (!jogo) return;

        const precoTotalItem = jogo.preco * item.quantidade;
        
        // HTML do item a ser inserido (usando classes do Carrinho_Leviathan.css)
        const itemHTML = `
            <div class="item-carrinho" data-id="${jogo.id}">
                <div class="item-imagem">
                    <img src="${jogo.imagem}" alt="Capa do Jogo ${jogo.nome}">
                </div>
                <div class="item-detalhes">
                    <h3>${jogo.nome}</h3>
                    <p>Plataforma: ${jogo.plataforma}</p>
                </div>
                <div class="item-quantidade">
                    <button onclick="ajustarQuantidade(${jogo.id}, -1)">-</button>
                    <input type="number" min="1" value="${item.quantidade}" readonly>
                    <button onclick="ajustarQuantidade(${jogo.id}, 1)">+</button>
                </div>
                <div class="item-preco">${formatarMoeda(precoTotalItem)}</div>
                <button class="btn-remover" onclick="removerItem(${jogo.id})">X</button>
            </div>
        `;
        containerItens.insertAdjacentHTML('beforeend', itemHTML);
    });

    // 4. ATUALIZA O RESUMO
    const { subtotal, total } = calcularTotais(carrinho);
    
    if (resumoSubtotal) resumoSubtotal.textContent = formatarMoeda(subtotal);
    if (resumoTotal) resumoTotal.textContent = formatarMoeda(total);
}

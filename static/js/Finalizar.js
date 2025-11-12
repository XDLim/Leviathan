// checkout_leviathan.js
// Funcionalidades de validação básica e controle de interface para o Checkout.

// ===========================================
// 1. CONFIGURAÇÕES E DADOS DE REFERÊNCIA
// ===========================================
const CHAVE_CARRINHO = 'carrinhoLeviathan';

// DADOS DE REFERÊNCIA (Para fins de demonstração, o total será fixo ou lido do localStorage)

/**
 * Formata um valor numérico para o formato de moeda brasileira (R$).
 * @param {number} valor O valor numérico.
 * @returns {string} O valor formatado (ex: R$ 1.000,00).
 */
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

/**
 * Obtém o valor total do carrinho.
 * (Em um projeto real, esta função faria o cálculo dinâmico).
 * @returns {number} O valor total.
 */
function obterTotalDoCarrinho() {
    // Por simplicidade, vamos usar um valor fixo se o carrinho não estiver no storage
    // Ou você pode ler do seu JSON real para calcular.
    return 449.82; 
}


// ===========================================
// 2. CONTROLE DE INTERFACE (Botões de Pagamento e Títulos)
// ===========================================

/**
 * Controla a exibição dos detalhes do cartão ao selecionar a opção de pagamento.
 */
function controlarOpcoesDePagamento() {
    const opcoes = document.querySelectorAll('.opcao_pagamento_leviathan');
    
    opcoes.forEach(opcao => {
        const inputRadio = opcao.querySelector('input[type="radio"]');
        // Usa o seletor mais genérico para pegar o painel de detalhes
        const detalhes = opcao.querySelector('.detalhes_pagamento_leviathan');
        
        // Função para atualizar a visualização (usada no load e no change)
        const updateView = () => {
             // Remove a classe 'ativo' e esconde detalhes de todos
            opcoes.forEach(o => {
                o.classList.remove('ativo');
                const d = o.querySelector('.detalhes_pagamento_leviathan');
                if (d) d.style.display = 'none';
            });

            // Adiciona a classe 'ativo' e mostra detalhes no selecionado
            if (inputRadio.checked) {
                opcao.classList.add('ativo');
                if (detalhes) detalhes.style.display = 'block';
            }
        };

        // Adiciona o listener para mudanças
        if (inputRadio) {
            inputRadio.addEventListener('change', updateView);
        }
        
        // Define o estado inicial
        updateView();
    });
}

/**
 * Atualiza os valores monetários na página (botão e resumo).
 */
function atualizarValoresDaPagina() {
    const total = obterTotalDoCarrinho();
    const totalFormatado = formatarMoeda(total);
    const subtotalFormatado = formatarMoeda(total); // Subtotal = Total (sem frete)

    // Botão de Pagar
    const btn = document.querySelector('.btn_finalizar_compra_leviathan');
    if (btn) {
        btn.textContent = `Pagar ${totalFormatado}`;
    }

    // Resumo
    const resumoSubtotal = document.getElementById('subtotal_checkout');
    const resumoTotal = document.getElementById('total_final_checkout');

    if (resumoSubtotal) resumoSubtotal.textContent = subtotalFormatado;
    if (resumoTotal) resumoTotal.textContent = totalFormatado;
}

// ===========================================
// 3. VALIDAÇÃO E ENVIO DE FORMULÁRIO
// ===========================================

/**
 * Manipulador de evento para envio do formulário.
 * @param {Event} event O evento de envio do formulário.
 */
function handleCheckoutSubmit(event) {
    event.preventDefault(); // Impede o envio padrão

    const form = event.target;
    
    // 1. Validação dos Termos
    const termosAceitos = document.getElementById('termos_leviathan').checked;
    if (!termosAceitos) {
        alert("Você deve concordar com os Termos de Serviço para continuar.");
        return;
    }
    
    // 2. Validação Específica para Cartão de Crédito (Exemplo)
    const pagamentoSelecionado = form.querySelector('input[name="pagamento"]:checked').value;
    if (pagamentoSelecionado === 'cartao') {
        const numCartao = document.getElementById('numero_cartao_leviathan').value.replace(/\s/g, '');
        if (numCartao.length < 16) {
            alert("Por favor, insira um número de cartão válido.");
            return;
        }
        // Validações adicionais (validade, CVV, nome, etc.) iriam aqui.
    }
    
    // Se a validação passar:
    
    
    // Em produção, aqui você faria a chamada API para processar o pagamento.
    
    // Opcional: Limpar o carrinho e redirecionar
    // localStorage.removeItem(CHAVE_CARRINHO);
    // window.location.href = 'pagina_de_confirmacao.html';
}

// ===========================================
// 4. INICIALIZAÇÃO
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Configura a exibição das opções de pagamento (mostrar/esconder detalhes)
    controlarOpcoesDePagamento();
    
    // 2. Atualiza os textos do resumo e do botão
    atualizarValoresDaPagina();
    
    // 3. Adiciona o listener para o formulário de checkout
    const form = document.getElementById('form_checkout_leviathan');
    if (form) {
        form.addEventListener('submit', handleCheckoutSubmit);
    }
});
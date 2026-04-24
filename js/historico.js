// URL da API
const URL_API = 'http://10.110.12.71:1880/api/leituras';

// Tempo de atualização automática (10 segundos)
const TEMPO_ATUALIZACAO = 10000;


// ----------------------------------------------------------
// ELEMENTOS DO DOM
// ----------------------------------------------------------

const corpoTabela = document.getElementById('corpoTabelaHistorico');


// ----------------------------------------------------------
// ESTADO LOCAL
// ----------------------------------------------------------

let todasLeituras = [];


// ----------------------------------------------------------
// FUNÇÕES AUXILIARES
// ----------------------------------------------------------

/**
 * Formata data ISO para padrão brasileiro
 */
const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR');
};


/**
 * Exibe mensagem na tabela
 */
const mostrarMensagemTabela = (mensagem) => {
    corpoTabela.innerHTML = `
        <tr class="linha-placeholder">
            <td colspan="4">${mensagem}</td>
        </tr>
    `;
};


// ----------------------------------------------------------
// API
// ----------------------------------------------------------

/**
 * Busca todas as leituras
 */
const buscarTodasLeituras = async () => {
    try {
        const resposta = await fetch(URL_API, {
            cache: 'no-store'
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();

        console.log(`Leituras carregadas: ${dados.length}`);

        return dados;

    } catch (erro) {
        console.error('Erro ao buscar leituras:', erro);
        mostrarMensagemTabela('Erro ao carregar dados.');
        return [];
    }
};


// ----------------------------------------------------------
// TABELA
// ----------------------------------------------------------

/**
 * Renderiza tabela
 */
const renderizarTabela = (leituras) => {

    corpoTabela.innerHTML = '';

    if (!leituras || leituras.length === 0) {
        mostrarMensagemTabela('Nenhuma leitura encontrada.');
        return;
    }

    // Ordena da mais recente para mais antiga
    const ordenadas = [...leituras].sort((a, b) => {
        return new Date(b.datahora) - new Date(a.datahora);
    });

    ordenadas.forEach((leitura) => {

        const linha = document.createElement('tr');

        // ID
        const tdId = document.createElement('td');
        tdId.textContent = leitura.id ?? '-';

        // Temperatura
        const tdTemp = document.createElement('td');
        const temp = parseFloat(leitura.temperatura || 0);
        tdTemp.textContent = `${temp.toFixed(1)} °C`;

        // Umidade
        const tdUmidade = document.createElement('td');
        const umidade = parseFloat(leitura.umidade || 0);
        tdUmidade.textContent = `${umidade.toFixed(1)} %`;

        // Data Hora
        const tdData = document.createElement('td');
        tdData.textContent = formatarDataHora(leitura.datahora);

        linha.appendChild(tdId);
        linha.appendChild(tdTemp);
        linha.appendChild(tdUmidade);
        linha.appendChild(tdData);

        corpoTabela.appendChild(linha);
    });
};


// ----------------------------------------------------------
// AUTENTICAÇÃO
// ----------------------------------------------------------

/**
 * Verifica login
 */
const verificarAutenticacao = () => {

    const usuarioLogado = localStorage.getItem('usuarioLogado');

    if (!usuarioLogado) {
        window.location.href = '../index.html';
    }
};


// ----------------------------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------------------------

/**
 * Carrega histórico inicial
 */
const inicializarHistorico = async () => {

    mostrarMensagemTabela('Carregando dados...');

    todasLeituras = await buscarTodasLeituras();

    renderizarTabela(todasLeituras);
};


// ----------------------------------------------------------
// ATUALIZAÇÃO AUTOMÁTICA
// ----------------------------------------------------------

/**
 * Atualiza tabela automaticamente
 */
const iniciarAtualizacaoAutomatica = () => {

    setInterval(async () => {

        console.log('Atualizando histórico...');

        todasLeituras = await buscarTodasLeituras();

        renderizarTabela(todasLeituras);

    }, TEMPO_ATUALIZACAO);
};


// ----------------------------------------------------------
// EXECUÇÃO
// ----------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {

    verificarAutenticacao();

    inicializarHistorico();

    iniciarAtualizacaoAutomatica();

});

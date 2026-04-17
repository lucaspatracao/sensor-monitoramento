/**
 * Módulo de Histórico
 * 
 * Exibe uma tabela com todas as leituras armazenadas no banco de dados.
 * Permite filtrar por período (data/hora inicial e final).
 */

// ----- CONFIGURAÇÕES -----
const URL_API = 'http://10.110.12.73:1880/api/leituras';

// ----- ELEMENTOS DO DOM -----
const corpoTabela = document.getElementById('corpoTabelaHistorico');
const formularioFiltros = document.getElementById('formularioFiltros');
const campoDataInicio = document.getElementById('dataInicio');
const campoDataFim = document.getElementById('dataFim');
const botaoLimpar = document.getElementById('botaoLimparFiltros');

// ----- ESTADO LOCAL -----
let todasLeituras = []; // Cache de todas as leituras carregadas

// ----- FUNÇÕES AUXILIARES -----

/**
 * Formata uma data ISO para exibição na tabela.
 * @param {string} dataISO - Data no formato ISO 8601.
 * @returns {string} - Data/hora no padrão brasileiro.
 */
const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR');
};

// ----- COMUNICAÇÃO COM A API -----

/**
 * Busca todas as leituras da API.
 * @returns {Promise<Array>} - Array de leituras.
 */
const buscarTodasLeituras = async () => {
    try {
        const resposta = await fetch(URL_API);
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
        const dados = await resposta.json();
        console.log(`📋 ${dados.length} leituras carregadas`);
        return dados;
    } catch (erro) {
        console.error('Erro ao buscar histórico:', erro);
        return [];
    }
};

// ----- RENDERIZAÇÃO DA TABELA -----

/**
 * Preenche a tabela com as leituras fornecidas.
 * @param {Array} leituras - Lista de leituras a serem exibidas.
 */
const renderizarTabela = (leituras) => {
    corpoTabela.innerHTML = '';

    if (!leituras || leituras.length === 0) {
        const linhaVazia = document.createElement('tr');
        linhaVazia.classList.add('linha-placeholder');
        linhaVazia.innerHTML = `<td colspan="4">Nenhuma leitura encontrada.</td>`;
        corpoTabela.appendChild(linhaVazia);
        return;
    }

    // Ordena da mais recente para a mais antiga
    const leiturasOrdenadas = [...leituras].sort((a, b) => new Date(b.datahora) - new Date(a.datahora));

    leiturasOrdenadas.forEach(leitura => {
        const linha = document.createElement('tr');

        // Coluna ID
        const celulaId = document.createElement('td');
        celulaId.textContent = leitura.id ?? '-';

        // Coluna Temperatura
        const celulaTemperatura = document.createElement('td');
        const temp = parseFloat(leitura.temperatura);
        celulaTemperatura.textContent = `${temp.toFixed(1)} °C`;

        // Coluna Umidade
        const celulaUmidade = document.createElement('td');
        const umid = parseFloat(leitura.umidade);
        celulaUmidade.textContent = `${umid.toFixed(1)} %`;

        // Coluna Data/Hora
        const celulaDataHora = document.createElement('td');
        celulaDataHora.textContent = formatarDataHora(leitura.datahora);

        linha.appendChild(celulaId);
        linha.appendChild(celulaTemperatura);
        linha.appendChild(celulaUmidade);
        linha.appendChild(celulaDataHora);

        corpoTabela.appendChild(linha);
    });
};

// ----- FILTROS -----

/**
 * Aplica os filtros de data/hora sobre o cache local.
 * @returns {Array} - Leituras que atendem ao critério de filtro.
 */
const filtrarLeituras = () => {
    const inicio = campoDataInicio.value;
    const fim = campoDataFim.value;

    if (!inicio && !fim) return todasLeituras;

    return todasLeituras.filter(leitura => {
        const dataLeitura = new Date(leitura.datahora);
        let dentro = true;

        if (inicio) {
            dentro = dentro && dataLeitura >= new Date(inicio);
        }
        if (fim) {
            const dataFimAjustada = new Date(fim);
            dataFimAjustada.setHours(23, 59, 59, 999);
            dentro = dentro && dataLeitura <= dataFimAjustada;
        }
        return dentro;
    });
};

/**
 * Atualiza a tabela com os dados filtrados.
 */
const aplicarFiltro = () => {
    const filtradas = filtrarLeituras();
    renderizarTabela(filtradas);
};

/**
 * Remove os filtros e exibe todas as leituras novamente.
 */
const limparFiltros = () => {
    campoDataInicio.value = '';
    campoDataFim.value = '';
    renderizarTabela(todasLeituras);
};

// ----- INICIALIZAÇÃO -----

/**
 * Carrega os dados e prepara a tabela.
 */
const inicializarHistorico = async () => {
    corpoTabela.innerHTML = `<tr class="linha-placeholder"><td colspan="4">Carregando dados...</td></tr>`;
    todasLeituras = await buscarTodasLeituras();
    renderizarTabela(todasLeituras);
};

/**
 * Verifica se o usuário está autenticado.
 */
const verificarAutenticacao = () => {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = '../index.html';
    }
};

// ----- REGISTRO DE EVENTOS E INICIALIZAÇÃO -----
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
    inicializarHistorico();

    if (formularioFiltros) {
        formularioFiltros.addEventListener('submit', (evento) => {
            evento.preventDefault();
            aplicarFiltro();
        });
    }

    if (botaoLimpar) {
        botaoLimpar.addEventListener('click', limparFiltros);
    }

    // Atualização automática a cada 10 segundos
    setInterval(async () => {
        todasLeituras = await buscarTodasLeituras();
        aplicarFiltro(); // Reaplica o filtro ativo (se houver)
    }, 10000);
});
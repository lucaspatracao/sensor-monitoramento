/**
 * Módulo de Histórico
 * Exibe uma tabela com todas as leituras, com filtro por período.
 */

const URL_API = 'http://192.168.1.100:1880/api/leituras';

// Elementos do DOM
const corpoTabela = document.getElementById('corpoTabelaHistorico');
const formularioFiltros = document.getElementById('formularioFiltros');
const campoDataInicio = document.getElementById('dataInicio');
const campoDataFim = document.getElementById('dataFim');
const botaoFiltrar = document.getElementById('botaoFiltrar');
const botaoLimpar = document.getElementById('botaoLimparFiltros');

// Cache das leituras para evitar múltiplas requisições
let todasLeituras = [];

/**
 * Formata data/hora para exibição na tabela.
 * @param {string} dataISO
 * @returns {string}
 */
const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR');
};

/**
 * Busca todas as leituras da API.
 * @returns {Promise<Array>}
 */
const buscarTodasLeituras = async () => {
    try {
        const resposta = await fetch(URL_API);

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}`);
        }

        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error('Erro ao buscar histórico:', erro);
        return [];
    }
};

/**
 * Renderiza a tabela com as leituras fornecidas.
 * @param {Array} leituras - Array de leituras
 */
const renderizarTabela = (leituras) => {
    corpoTabela.innerHTML = '';

    if (!leituras || leituras.length === 0) {
        const linhaVazia = document.createElement('tr');
        linhaVazia.classList.add('linha-placeholder');
        linhaVazia.innerHTML = `<td colspan="2">Nenhuma leitura encontrada.</td>`;
        corpoTabela.appendChild(linhaVazia);
        return;
    }

    // Ordena as leituras da mais recente para a mais antiga
    const leiturasOrdenadas = [...leituras].sort((a, b) => new Date(b.datahora) - new Date(a.datahora));

    leiturasOrdenadas.forEach(leitura => {
        const linha = document.createElement('tr');
        const celulaDataHora = document.createElement('td');
        const celulaTemperatura = document.createElement('td');

        celulaDataHora.textContent = formatarDataHora(leitura.datahora);
        celulaTemperatura.textContent = `${leitura.temperatura.toFixed(1)} °C`;

        linha.appendChild(celulaDataHora);
        linha.appendChild(celulaTemperatura);
        corpoTabela.appendChild(linha);
    });
};

/**
 * Filtra as leituras com base nas datas selecionadas.
 * @returns {Array} - Leituras filtradas
 */
const filtrarLeituras = () => {
    const dataInicio = campoDataInicio.value;
    const dataFim = campoDataFim.value;

    if (!dataInicio && !dataFim) {
        return todasLeituras;
    }

    return todasLeituras.filter(leitura => {
        const dataLeitura = new Date(leitura.datahora);
        let dentroDoIntervalo = true;

        if (dataInicio) {
            const inicio = new Date(dataInicio);
            dentroDoIntervalo = dentroDoIntervalo && dataLeitura >= inicio;
        }

        if (dataFim) {
            const fim = new Date(dataFim);
            // Ajusta o fim do dia para incluir leituras da data final
            fim.setHours(23, 59, 59, 999);
            dentroDoIntervalo = dentroDoIntervalo && dataLeitura <= fim;
        }

        return dentroDoIntervalo;
    });
};

/**
 * Aplica o filtro e atualiza a tabela.
 */
const aplicarFiltro = () => {
    const leiturasFiltradas = filtrarLeituras();
    renderizarTabela(leiturasFiltradas);
};

/**
 * Limpa os campos de filtro e exibe todas as leituras.
 */
const limparFiltros = () => {
    campoDataInicio.value = '';
    campoDataFim.value = '';
    renderizarTabela(todasLeituras);
};

/**
 * Inicializa a página de histórico.
 */
const inicializarHistorico = async () => {
    // Exibe "Carregando..." na tabela
    corpoTabela.innerHTML = `<tr class="linha-placeholder"><td colspan="2">Carregando dados...</td></tr>`;

    todasLeituras = await buscarTodasLeituras();
    renderizarTabela(todasLeituras);
};

// Configura os eventos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    inicializarHistorico();

    // Evento de submit do formulário de filtros
    formularioFiltros.addEventListener('submit', (evento) => {
        evento.preventDefault();
        aplicarFiltro();
    });

    // Evento do botão limpar
    botaoLimpar.addEventListener('click', limparFiltros);

    // Atualização automática a cada 10 segundos (opcional)
    setInterval(async () => {
        todasLeituras = await buscarTodasLeituras();
        aplicarFiltro(); // Mantém o filtro ativo se houver
    }, 10000);
});
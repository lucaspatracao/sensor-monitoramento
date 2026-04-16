/**
 * Módulo de Histórico
 * Exibe tabela com ID, Temperatura, Umidade e Data/Hora.
 */

const URL_API = 'http://192.168.1.100:1880/api/leituras';

const corpoTabela = document.getElementById('corpoTabelaHistorico');
const formularioFiltros = document.getElementById('formularioFiltros');
const campoDataInicio = document.getElementById('dataInicio');
const campoDataFim = document.getElementById('dataFim');
const botaoLimpar = document.getElementById('botaoLimparFiltros');

let todasLeituras = [];

const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR');
};

const buscarTodasLeituras = async () => {
    try {
        const resposta = await fetch(URL_API);
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
        return await resposta.json();
    } catch (erro) {
        console.error('Erro ao buscar histórico:', erro);
        return [];
    }
};

const renderizarTabela = (leituras) => {
    corpoTabela.innerHTML = '';

    if (!leituras || leituras.length === 0) {
        const linhaVazia = document.createElement('tr');
        linhaVazia.classList.add('linha-placeholder');
        linhaVazia.innerHTML = `<td colspan="4">Nenhuma leitura encontrada.</td>`;
        corpoTabela.appendChild(linhaVazia);
        return;
    }

    const leiturasOrdenadas = [...leituras].sort((a, b) => new Date(b.datahora) - new Date(a.datahora));

    leiturasOrdenadas.forEach(leitura => {
        const linha = document.createElement('tr');

        const celulaId = document.createElement('td');
        celulaId.textContent = leitura.id ?? '-';

        const celulaTemperatura = document.createElement('td');
        celulaTemperatura.textContent = `${leitura.temperatura.toFixed(1)} °C`;

        const celulaUmidade = document.createElement('td');
        celulaUmidade.textContent = `${leitura.umidade.toFixed(1)} %`;

        const celulaDataHora = document.createElement('td');
        celulaDataHora.textContent = formatarDataHora(leitura.datahora);

        linha.appendChild(celulaId);
        linha.appendChild(celulaTemperatura);
        linha.appendChild(celulaUmidade);
        linha.appendChild(celulaDataHora);

        corpoTabela.appendChild(linha);
    });
};

const filtrarLeituras = () => {
    const inicio = campoDataInicio.value;
    const fim = campoDataFim.value;

    if (!inicio && !fim) return todasLeituras;

    return todasLeituras.filter(leitura => {
        const dataLeitura = new Date(leitura.datahora);
        let dentro = true;
        if (inicio) dentro = dentro && dataLeitura >= new Date(inicio);
        if (fim) {
            const dataFimAjustada = new Date(fim);
            dataFimAjustada.setHours(23, 59, 59, 999);
            dentro = dentro && dataLeitura <= dataFimAjustada;
        }
        return dentro;
    });
};

const aplicarFiltro = () => {
    const filtradas = filtrarLeituras();
    renderizarTabela(filtradas);
};

const limparFiltros = () => {
    campoDataInicio.value = '';
    campoDataFim.value = '';
    renderizarTabela(todasLeituras);
};

const inicializarHistorico = async () => {
    corpoTabela.innerHTML = `<tr class="linha-placeholder"><td colspan="4">Carregando dados...</td></tr>`;
    todasLeituras = await buscarTodasLeituras();
    renderizarTabela(todasLeituras);
};

document.addEventListener('DOMContentLoaded', () => {
    inicializarHistorico();

    formularioFiltros.addEventListener('submit', (e) => {
        e.preventDefault();
        aplicarFiltro();
    });

    botaoLimpar.addEventListener('click', limparFiltros);

    setInterval(async () => {
        todasLeituras = await buscarTodasLeituras();
        aplicarFiltro();
    }, 10000);
});
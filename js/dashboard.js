/**
 * ============================================================
 * Modulo do Dashboard - Sensora
 * ============================================================
 * Exibe em tempo real:
 * - Valor atual de temperatura e umidade.
 * - Grafico de evolucao da temperatura e umidade (Chart.js).
 * 
 * Comunicacao com backend:
 * - API REST (GET) - atualizacao a cada 10 segundos

 * ============================================================
 */

// ----- CONFIGURACOES -----
const URL_API = 'http://10.110.12.71:1880/api/leituras'; // Endpoint para buscar leituras via HTTP
const INTERVALO_ATUALIZACAO = 10000;                       // Intervalo de 10 segundos (em milissegundos) para atualizacao periodica

// ----- ELEMENTOS DO DOM -----
// Obtem referencias para os elementos HTML que serao atualizados
const elementoValorTemperatura = document.getElementById('valorTemperaturaAtual'); // Span/div da temperatura
const elementoValorUmidade = document.getElementById('valorUmidadeAtual');         // Span/div da umidade
const canvas = document.getElementById('graficoTemperatura');                       // Canvas para o grafico Chart.js
const ctx = canvas ? canvas.getContext('2d') : null;                                // Contexto 2D do canvas (para desenhar)

// ----- VARIAVEIS GLOBAIS -----
let graficoTemperatura = null;   // Armazena a instancia atual do grafico Chart.js
let leiturasCache = [];          // Cache local com as ultimas 100 leituras recebidas
let intervaloAPI = null;         // Referencia para o intervalo de atualizacao periodica (setInterval)

// ----- FUNCOES AUXILIARES -----

/**
 * Formata uma data no formato ISO 8601 para exibicao no eixo X do grafico.
 * @param {string} dataISO - Data em formato ISO (ex: "2026-04-17T10:30:00")
 * @returns {string} - Horario formatado como "HH:MM:SS"
 */
const formatarHorario = (dataISO) => {
    const data = new Date(dataISO);                       // Converte a string ISO para objeto Date
    return data.toLocaleTimeString('pt-BR', {             // Formata para horario brasileiro
        hour: '2-digit',                                  // Hora com 2 digitos (ex: 09)
        minute: '2-digit',                                // Minuto com 2 digitos (ex: 05)
        second: '2-digit'                                 // Segundo com 2 digitos (ex: 30)
    });
};

// ----- API REST -----

/**
 * Busca todas as leituras disponiveis no banco de dados via API REST.
 * @returns {Promise<Array>} - Promise que resolve para um array de leituras
 */
const buscarLeituras = async () => {
    try {
        const resposta = await fetch(URL_API);            // Faz a requisicao GET para a API
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`); // Lanca erro se status nao for 2xx
        const dados = await resposta.json();               // Converte a resposta para JSON
        console.log('Dados atualizados via API:', new Date().toLocaleTimeString(), '-', dados.length, 'registros');
        return dados;                                      // Retorna o array de leituras
    } catch (erro) {
        console.error('Falha ao buscar leituras:', erro); // Loga o erro no console
        return [];                                         // Retorna array vazio em caso de falha
    }
};

// ----- INTERFACE -----

/**
 * Atualiza todos os elementos visuais do dashboard com os dados fornecidos.
 * @param {Array} leituras - Array de objetos de leitura (temperatura, umidade, datahora)
 */
const atualizarInterface = (leituras) => {
    // Se nao ha leituras, exibe placeholder
    if (!leituras || leituras.length === 0) {
        if (elementoValorTemperatura) elementoValorTemperatura.textContent = '-- °C';
        if (elementoValorUmidade) elementoValorUmidade.textContent = '-- %';
        return;                                           // Sai da funcao
    }

    // Ordena as leituras por data/hora (crescente) para o grafico
    const leiturasOrdenadas = [...leituras].sort((a, b) => new Date(a.datahora) - new Date(b.datahora));
    
    // A ultima leitura (mais recente) fica no final do array ordenado
    const ultima = leiturasOrdenadas[leiturasOrdenadas.length - 1];

    // Atualiza os valores exibidos de temperatura e umidade
    if (elementoValorTemperatura) {
        elementoValorTemperatura.textContent = `${parseFloat(ultima.temperatura).toFixed(1)} °C`;
    }
    if (elementoValorUmidade) {
        elementoValorUmidade.textContent = `${parseFloat(ultima.umidade).toFixed(1)} %`;
    }

    // Atualiza o indicador de "ultima atualizacao" (se existir no HTML)
    const spanAtualizacao = document.getElementById('ultimaAtualizacao');
    if (spanAtualizacao) {
        spanAtualizacao.textContent = new Date().toLocaleTimeString('pt-BR');
    }

    // Atualiza o grafico Chart.js (apenas se o canvas existir)
    if (ctx) {
        // Prepara os dados para o grafico
        const rotulos = leiturasOrdenadas.map(l => formatarHorario(l.datahora));      // Horarios para eixo X
        const valoresTemperatura = leiturasOrdenadas.map(l => parseFloat(l.temperatura)); // Valores de temperatura
        const valoresUmidade = leiturasOrdenadas.map(l => parseFloat(l.umidade));         // Valores de umidade

        // Destroi o grafico anterior (se existir) para recria-lo com novos dados
        if (graficoTemperatura) graficoTemperatura.destroy();

        // Cria um novo grafico Chart.js
        graficoTemperatura = new Chart(ctx, {
            type: 'line',                                 // Tipo: grafico de linha
            data: {
                labels: rotulos,                          // Rótulos do eixo X (horarios)
                datasets: [
                    {
                        label: 'Temperatura (°C)',        // Legenda da serie
                        data: valoresTemperatura,         // Dados da temperatura
                        borderColor: '#f97316',           // Cor da linha (laranja)
                        backgroundColor: 'rgba(249, 115, 22, 0.1)', // Cor de preenchimento (transparente)
                        borderWidth: 2,                   // Espessura da linha
                        tension: 0.2,                     // Suavizacao da curva
                        fill: true,                       // Preenche area sob a linha
                        yAxisID: 'y'                      // Usa o eixo Y esquerdo
                    },
                    {
                        label: 'Umidade (%)',             // Legenda da segunda serie
                        data: valoresUmidade,             // Dados da umidade
                        borderColor: '#0ea5e9',           // Cor da linha (azul)
                        backgroundColor: 'rgba(14, 165, 233, 0.1)', // Cor de preenchimento
                        borderWidth: 2,                   // Espessura da linha
                        tension: 0.2,                     // Suavizacao da curva
                        fill: true,                       // Preenche area sob a linha
                        yAxisID: 'y1'                     // Usa o eixo Y direito
                    }
                ]
            },
            options: {
                responsive: true,                         // Grafico se adapta ao tamanho do container
                maintainAspectRatio: false,               // Nao mantem proporcao fixa
                interaction: {
                    mode: 'index',                        // Tooltip mostra dados de todas as series no mesmo ponto
                    intersect: false
                },
                plugins: {
                    legend: { 
                        display: true,                    // Exibe a legenda
                        position: 'top'                   // Posicao da legenda (topo)
                    }
                },
                scales: {
                    x: { 
                        grid: { display: false },         // Oculta as linhas de grade do eixo X
                        ticks: { maxRotation: 45, minRotation: 45 } // Rotaciona os rotulos para caber
                    },
                    y: {
                        type: 'linear',                   // Eixo linear
                        display: true,                    // Exibe o eixo Y esquerdo
                        position: 'left',                 // Posicionado a esquerda
                        title: {
                            display: true,                // Exibe titulo do eixo
                            text: 'Temperatura (°C)'
                        },
                        beginAtZero: false,               // Nao comeca necessariamente do zero
                        grid: { color: '#e2e8f0' }        // Cor das linhas de grade
                    },
                    y1: {
                        type: 'linear',                   // Eixo linear
                        display: true,                    // Exibe o eixo Y direito
                        position: 'right',                // Posicionado a direita
                        title: {
                            display: true,                // Exibe titulo do eixo
                            text: 'Umidade (%)'
                        },
                        beginAtZero: false,               // Nao comeca necessariamente do zero
                        min: 0,                           // Valor minimo 0%
                        max: 100,                         // Valor maximo 100%
                        grid: { drawOnChartArea: false }  // Nao desenha linhas de grade duplicadas
                    }
                }
            }
        });
    }
};

// ----- ATUALIZACAO PERIODICA -----

/**
 * Inicia o intervalo que atualiza os dados via API REST a cada INTERVALO_ATUALIZACAO.
 */
const iniciarAtualizacaoPeriodica = () => {
    if (intervaloAPI) clearInterval(intervaloAPI);       // Limpa intervalo anterior (se existir)
    
    intervaloAPI = setInterval(async () => {             // Cria novo intervalo
        console.log('Atualizando via API...');
        leiturasCache = await buscarLeituras();          // Busca dados frescos da API
        atualizarInterface(leiturasCache);               // Atualiza a tela
    }, INTERVALO_ATUALIZACAO);                           // Repete a cada 5 segundos
};

/**
 * Para o intervalo de atualizacao periodica.
 */
const pararAtualizacaoPeriodica = () => {
    if (intervaloAPI) {
        clearInterval(intervaloAPI);                     // Cancela o intervalo
        intervaloAPI = null;                             // Limpa a referencia
    }
};

// ----- INICIALIZACAO -----

/**
 * Carrega os dados iniciais do dashboard via API REST.
 */
const carregarDashboard = async () => {
    // Exibe "Carregando..." enquanto os dados sao buscados
    if (elementoValorTemperatura) elementoValorTemperatura.textContent = 'Carregando...';
    if (elementoValorUmidade) elementoValorUmidade.textContent = 'Carregando...';

    leiturasCache = await buscarLeituras();              // Busca dados iniciais
    atualizarInterface(leiturasCache);                   // Exibe na tela
};

/**
 * Verifica se o usuario esta autenticado.
 * Redireciona para a pagina de login se nao estiver.
 */
const verificarAutenticacao = () => {
    const usuarioLogado = localStorage.getItem('usuarioLogado'); // Verifica localStorage
    if (!usuarioLogado) {
        window.location.href = '../index.html';          // Redireciona para login
    }
};

// ----- PONTO DE ENTRADA -----
// Este bloco executa assim que o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard inicializado - Atualizacao a cada 10 segundos');
    verificarAutenticacao();                             // 1. Verifica se usuario esta logado
    carregarDashboard();                                 // 2. Carrega dados iniciais

    iniciarAtualizacaoPeriodica();                       // 4. Inicia atualizacao periodica a cada 5s
});

/**
 * Módulo do Dashboard
 * 
 * Exibe em tempo real:
 * - Valor atual de temperatura e umidade.
 * - Gráfico de evolução da temperatura (Chart.js).
 * 
 * Comunica‑se com o backend via:
 * - API REST (GET) para carregar o histórico inicial.
 * - WebSocket para receber atualizações em tempo real.
 */

// ----- CONFIGURAÇÕES -----
const URL_API = 'http://10.110.12.73:1880/api/leituras';
const URL_WS = 'ws://10.110.12.73:1880/ws/leituras';

// ----- ELEMENTOS DO DOM -----
const elementoValorTemperatura = document.getElementById('valorTemperaturaAtual');
const elementoValorUmidade = document.getElementById('valorUmidadeAtual');
const canvas = document.getElementById('graficoTemperatura');
const ctx = canvas ? canvas.getContext('2d') : null;

// ----- VARIÁVEIS GLOBAIS DO MÓDULO -----
let graficoTemperatura = null;   // Instância do gráfico Chart.js
let ws = null;                   // Conexão WebSocket
let leiturasCache = [];          // Cache local das últimas leituras

// ----- FUNÇÕES AUXILIARES -----

/**
 * Formata uma data ISO para exibição no eixo X do gráfico.
 * @param {string} dataISO - Data no formato ISO 8601.
 * @returns {string} - Horário no formato HH:MM.
 */
const formatarHorario = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

// ----- COMUNICAÇÃO COM A API REST (GET) -----

/**
 * Busca todas as leituras disponíveis via API REST.
 * @returns {Promise<Array>} - Array de leituras.
 */
const buscarLeituras = async () => {
    try {
        const resposta = await fetch(URL_API);
        if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);
        return await resposta.json();
    } catch (erro) {
        console.error('Falha ao buscar leituras:', erro);
        return [];
    }
};

// ----- COMUNICAÇÃO VIA WEBSOCKET (TEMPO REAL) -----

/**
 * Estabelece a conexão WebSocket com o servidor.
 * Em caso de queda, tenta reconectar automaticamente após 5 segundos.
 */
const conectarWebSocket = () => {
    try {
        ws = new WebSocket(URL_WS);

        ws.onopen = () => {
            console.log('🟢 WebSocket conectado');
        };

        ws.onmessage = (evento) => {
            try {
                const novaLeitura = JSON.parse(evento.data);
                console.log('📡 Nova leitura recebida via WebSocket:', novaLeitura);

                // Adiciona a nova leitura ao cache, mantendo no máximo 100 registros
                leiturasCache.push(novaLeitura);
                if (leiturasCache.length > 100) {
                    leiturasCache.shift();
                }

                atualizarInterface(leiturasCache);
            } catch (erro) {
                console.error('Erro ao processar mensagem do WebSocket:', erro);
            }
        };

        ws.onerror = (erro) => {
            console.error('Erro no WebSocket:', erro);
        };

        ws.onclose = () => {
            console.log('🔴 WebSocket desconectado, tentando reconectar em 5 segundos...');
            setTimeout(conectarWebSocket, 5000);
        };
    } catch (erro) {
        console.error('Erro ao criar WebSocket:', erro);
    }
};

// ----- ATUALIZAÇÃO DA INTERFACE (DOM) -----

/**
 * Atualiza os elementos visuais com os dados mais recentes.
 * @param {Array} leituras - Lista de leituras (ordenadas ou não).
 */
const atualizarInterface = (leituras) => {
    if (!leituras || leituras.length === 0) {
        if (elementoValorTemperatura) elementoValorTemperatura.textContent = '-- °C';
        if (elementoValorUmidade) elementoValorUmidade.textContent = '-- %';
        return;
    }

    // Ordena cronologicamente para o gráfico
    const leiturasOrdenadas = [...leituras].sort((a, b) => new Date(a.datahora) - new Date(b.datahora));

    // Última leitura (a mais recente após ordenação)
    const ultima = leiturasOrdenadas[leiturasOrdenadas.length - 1];

    if (elementoValorTemperatura) {
        elementoValorTemperatura.textContent = `${parseFloat(ultima.temperatura).toFixed(1)} °C`;
    }
    if (elementoValorUmidade) {
        elementoValorUmidade.textContent = `${parseFloat(ultima.umidade).toFixed(1)} %`;
    }

    // Atualiza o gráfico (somente se o canvas existir)
    if (ctx) {
        const rotulos = leiturasOrdenadas.map(l => formatarHorario(l.datahora));
        const valoresTemperatura = leiturasOrdenadas.map(l => parseFloat(l.temperatura));

        if (graficoTemperatura) graficoTemperatura.destroy();

        graficoTemperatura = new Chart(ctx, {
            type: 'line',
            data: {
                labels: rotulos,
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: valoresTemperatura,
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    borderWidth: 2,
                    tension: 0.2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { maxRotation: 45, minRotation: 45 }
                    },
                    y: {
                        beginAtZero: false,
                        grid: { color: '#e2e8f0' }
                    }
                }
            }
        });
    }
};

// ----- INICIALIZAÇÃO DO DASHBOARD -----

/**
 * Carrega os dados iniciais via API REST e atualiza a interface.
 */
const carregarDashboard = async () => {
    if (elementoValorTemperatura) elementoValorTemperatura.textContent = 'Carregando...';
    if (elementoValorUmidade) elementoValorUmidade.textContent = 'Carregando...';

    leiturasCache = await buscarLeituras();
    atualizarInterface(leiturasCache);
};

/**
 * Verifica se há um usuário logado; caso contrário, redireciona para o login.
 */
const verificarAutenticacao = () => {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado) {
        window.location.href = '../index.html';
    }
};

// ----- PONTO DE ENTRADA -----
document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Dashboard inicializado');
    verificarAutenticacao();
    carregarDashboard();
    conectarWebSocket();

    // Fallback: atualização periódica via API a cada 30 segundos
    setInterval(carregarDashboard, 30000);
});
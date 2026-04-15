/**
 * Módulo do Dashboard
 * Exibe a temperatura atual e um gráfico com histórico.
 * Utiliza fetch para consumir a API do Node-RED.
 */

// URL base da API (ajustar conforme IP do servidor)
const URL_API = 'http://192.168.1.100:1880/api/leituras';

// Elementos do DOM
const elementoValorTemperatura = document.getElementById('valorTemperaturaAtual');
const ctx = document.getElementById('graficoTemperatura').getContext('2d');

let graficoTemperatura = null;

/**
 * Função utilitária para formatar data/hora no padrão brasileiro.
 * @param {string} dataISO - Data em formato ISO 8601
 * @returns {string} - Data/hora formatada
 */
const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

/**
 * Função utilitária para formatar apenas o horário (para o gráfico).
 * @param {string} dataISO
 * @returns {string}
 */
const formatarHorario = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

/**
 * Realiza a requisição à API para obter as leituras.
 * Utiliza fetch com async/await conforme material.
 * @returns {Promise<Array>} - Array de leituras
 */
const buscarLeituras = async () => {
    try {
        const resposta = await fetch(URL_API);

        // Verifica se a resposta foi bem-sucedida (status 2xx)
        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status}: ${resposta.statusText}`);
        }

        const dados = await resposta.json();
        return dados;
    } catch (erro) {
        console.error('Falha ao buscar leituras:', erro);
        // Em caso de erro, retorna array vazio para não quebrar a interface
        return [];
    }
};

/**
 * Atualiza a interface com os dados recebidos.
 * @param {Array} leituras - Array de objetos { temperatura, datahora }
 */
const atualizarInterface = (leituras) => {
    // Se não houver dados, exibe placeholder
    if (!leituras || leituras.length === 0) {
        elementoValorTemperatura.textContent = '-- °C';
        if (graficoTemperatura) {
            graficoTemperatura.destroy();
            graficoTemperatura = null;
        }
        return;
    }

    // Ordena as leituras pela data (mais antiga primeiro) para o gráfico
    const leiturasOrdenadas = [...leituras].sort((a, b) => new Date(a.datahora) - new Date(b.datahora));

    // Atualiza o valor atual (última leitura da lista original)
    const ultimaLeitura = leituras[0];
    elementoValorTemperatura.textContent = `${ultimaLeitura.temperatura.toFixed(1)} °C`;

    // Prepara dados para o gráfico
    const rotulos = leiturasOrdenadas.map(leitura => formatarHorario(leitura.datahora));
    const valores = leiturasOrdenadas.map(leitura => leitura.temperatura);

    // Cria ou atualiza o gráfico
    if (graficoTemperatura) {
        graficoTemperatura.destroy();
    }

    graficoTemperatura = new Chart(ctx, {
        type: 'line',
        data: {
            labels: rotulos,
            datasets: [{
                label: 'Temperatura (°C)',
                data: valores,
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
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: (contexto) => `${contexto.raw.toFixed(1)} °C`
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#e2e8f0'
                    }
                }
            }
        }
    });
};

/**
 * Função principal que orquestra a atualização periódica.
 */
const carregarDashboard = async () => {
    // Exibe um indicador de carregamento (opcional)
    elementoValorTemperatura.textContent = 'Carregando...';

    const leituras = await buscarLeituras();
    atualizarInterface(leituras);
};

// Inicializa o dashboard quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    carregarDashboard();

    // Configura atualização automática a cada 5 segundos
    setInterval(carregarDashboard, 5000);
});
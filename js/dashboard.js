/**
 * Módulo do Dashboard
 * Exibe temperatura e umidade atuais, e gráfico de temperatura.
 */

const URL_API = 'http://192.168.1.100:1880/api/leituras';

const elementoValorTemperatura = document.getElementById('valorTemperaturaAtual');
const elementoValorUmidade = document.getElementById('valorUmidadeAtual');
const ctx = document.getElementById('graficoTemperatura').getContext('2d');

let graficoTemperatura = null;

const formatarHorario = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

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

const atualizarInterface = (leituras) => {
    if (!leituras || leituras.length === 0) {
        elementoValorTemperatura.textContent = '-- °C';
        elementoValorUmidade.textContent = '-- %';
        if (graficoTemperatura) {
            graficoTemperatura.destroy();
            graficoTemperatura = null;
        }
        return;
    }

    // Ordena por data/hora crescente para o gráfico
    const leiturasOrdenadas = [...leituras].sort((a, b) => new Date(a.datahora) - new Date(b.datahora));

    // Última leitura (mais recente)
    const ultima = leituras[0];
    elementoValorTemperatura.textContent = `${ultima.temperatura.toFixed(1)} °C`;
    elementoValorUmidade.textContent = `${ultima.umidade.toFixed(1)} %`;

    // Dados para o gráfico (apenas temperatura por enquanto)
    const rotulos = leiturasOrdenadas.map(l => formatarHorario(l.datahora));
    const valoresTemperatura = leiturasOrdenadas.map(l => l.temperatura);

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
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => `${ctx.raw.toFixed(1)} °C`
                    }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: false,
                    grid: { color: '#e2e8f0' }
                }
            }
        }
    });
};

const carregarDashboard = async () => {
    elementoValorTemperatura.textContent = 'Carregando...';
    elementoValorUmidade.textContent = 'Carregando...';
    const leituras = await buscarLeituras();
    atualizarInterface(leituras);
};

document.addEventListener('DOMContentLoaded', () => {
    carregarDashboard();
    setInterval(carregarDashboard, 5000);
});
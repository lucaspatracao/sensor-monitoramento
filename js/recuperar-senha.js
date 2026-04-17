/**
 * Módulo de Recuperação de Senha (Front‑end)
 * 
 * Responsável por:
 * - Validar os campos do formulário.
 * - Enviar a nova senha para a API do Node‑RED.
 * - Exibir mensagens de feedback.
 * - Redirecionar para a tela de login após sucesso.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ----- ELEMENTOS DO DOM -----
    const formulario = document.getElementById('formRecuperar');
    const campoEmail = document.getElementById('email');
    const campoNovaSenha = document.getElementById('novaSenha');
    const campoConfirmarSenha = document.getElementById('confirmarSenha');
    const mensagemDiv = document.getElementById('mensagem');
    const botaoEnviar = document.querySelector('button[type="submit"]');

    // ----- CONFIGURAÇÃO DA API -----
    const URL_API = 'http://10.110.12.73:1880/api/recuperar-senha';

    // ----- FUNÇÃO PARA EXIBIR MENSAGENS -----
    /**
     * Exibe uma mensagem de feedback na div reservada.
     * @param {string} texto - Mensagem a ser exibida.
     * @param {string} tipo - 'sucesso', 'erro' ou 'info'.
     */
    const exibirMensagem = (texto, tipo = 'info') => {
        const cores = {
            sucesso: 'green',
            erro: 'red',
            info: 'blue'
        };
        mensagemDiv.innerHTML = `<span style="color: ${cores[tipo] || 'black'};">${texto}</span>`;
    };

    // ----- VALIDAÇÕES -----
    /**
     * Verifica se todos os campos estão preenchidos corretamente.
     * @returns {boolean} - true se o formulário for válido.
     */
    const validarFormulario = () => {
        const email = campoEmail.value.trim();
        const novaSenha = campoNovaSenha.value;
        const confirmacao = campoConfirmarSenha.value;

        if (!email || !novaSenha || !confirmacao) {
            exibirMensagem('Todos os campos são obrigatórios', 'erro');
            return false;
        }

        if (novaSenha !== confirmacao) {
            exibirMensagem('As senhas não coincidem', 'erro');
            return false;
        }

        if (novaSenha.length < 6) {
            exibirMensagem('A senha deve ter pelo menos 6 caracteres', 'erro');
            return false;
        }

        return true;
    };

    // ----- ENVIO PARA A API -----
    /**
     * Envia os dados de recuperação para o backend.
     * @param {Object} dados - Objeto com email, novaSenha e confirmarSenha.
     * @returns {Promise<Object>} - Resposta da API.
     */
    const enviarRecuperacao = async (dados) => {
        const resposta = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const dadosResposta = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dadosResposta.error || `Erro HTTP ${resposta.status}`);
        }

        return dadosResposta;
    };

    // ----- EVENTO DE SUBMISSÃO -----
    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        // 1. Validar campos
        if (!validarFormulario()) {
            return;
        }

        // 2. Preparar dados
        const dados = {
            email: campoEmail.value.trim().toLowerCase(),
            novaSenha: campoNovaSenha.value,
            confirmarSenha: campoConfirmarSenha.value
        };

        // 3. Feedback visual
        botaoEnviar.disabled = true;
        botaoEnviar.textContent = 'Alterando...';
        exibirMensagem('Alterando senha...', 'info');

        try {
            const resposta = await enviarRecuperacao(dados);

            if (resposta.success) {
                exibirMensagem('Senha alterada com sucesso! Redirecionando...', 'sucesso');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            } else {
                exibirMensagem(resposta.error || 'Erro ao alterar senha', 'erro');
            }
        } catch (erro) {
            console.error('Erro na recuperação:', erro);
            exibirMensagem('Erro de conexão com o servidor', 'erro');
        } finally {
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = 'Alterar Senha';
        }
    });
});
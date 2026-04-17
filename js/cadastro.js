/**
 * Módulo de Cadastro (Front‑end)
 * 
 * Responsável por:
 * - Validar os campos do formulário de cadastro.
 * - Enviar os dados do novo usuário para a API do Node‑RED.
 * - Exibir mensagens de feedback na própria página.
 * - Redirecionar para a tela de login após sucesso.
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {

    // ----- ELEMENTOS DO DOM -----
    const formulario = document.getElementById('formularioCadastro');
    const campoNome = document.getElementById('nomeCompleto');
    const campoEmail = document.getElementById('email');
    const campoSenha = document.getElementById('senha');
    const campoConfirmarSenha = document.getElementById('confirmarSenha');
    const botaoCadastrar = document.getElementById('botaoCadastrar');
    const mensagemDiv = document.getElementById('mensagem');

    // ----- CONFIGURAÇÃO DA API -----
    const URL_API = 'http://10.110.12.73:1880/api/cadastro';

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
        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim();
        const senha = campoSenha.value;
        const confirmacao = campoConfirmarSenha.value;

        if (!nome || !email || !senha || !confirmacao) {
            exibirMensagem('Todos os campos são obrigatórios', 'erro');
            return false;
        }

        if (senha !== confirmacao) {
            exibirMensagem('As senhas não coincidem', 'erro');
            return false;
        }

        if (senha.length < 6) {
            exibirMensagem('Senha deve ter pelo menos 6 caracteres', 'erro');
            return false;
        }

        return true;
    };

    // ----- ENVIO PARA A API -----
    /**
     * Envia os dados do formulário para o backend.
     * @param {Object} dados - Objeto com nomeCompleto, email e senha.
     * @returns {Promise<Object>} - Resposta da API.
     */
    const enviarCadastro = async (dados) => {
        const resposta = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const dadosResposta = await resposta.json();

        if (!resposta.ok) {
            // Monta um erro com a mensagem vinda do backend ou genérica
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
            nomeCompleto: campoNome.value.trim(),
            email: campoEmail.value.trim().toLowerCase(),
            senha: campoSenha.value
        };

        // 3. Feedback visual: desabilitar botão e mostrar "enviando"
        botaoCadastrar.disabled = true;
        botaoCadastrar.textContent = 'Cadastrando...';
        exibirMensagem('Enviando para o servidor...', 'info');

        try {
            const resposta = await enviarCadastro(dados);

            if (resposta.success) {
                exibirMensagem('Conta criada com sucesso no MySQL! Redirecionando...', 'sucesso');
                // Redireciona após 2 segundos
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);
            } else {
                // Caso o backend retorne success: false
                exibirMensagem(`Erro: ${resposta.error || 'Falha no cadastro'}`, 'erro');
            }
        } catch (erro) {
            console.error('Erro no cadastro:', erro);
            exibirMensagem('Erro de conexão com o servidor', 'erro');
        } finally {
            // Reabilita o botão
            botaoCadastrar.disabled = false;
            botaoCadastrar.textContent = 'Cadastrar';
        }
    });
});
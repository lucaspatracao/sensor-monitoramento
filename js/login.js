/**
 * Módulo de Login (Front‑end)
 * 
 * Responsável por:
 * - Capturar os dados do formulário de login.
 * - Enviar uma requisição POST para a API de autenticação do Node‑RED.
 * - Tratar a resposta e armazenar a sessão no localStorage.
 * - Redirecionar o usuário para o dashboard em caso de sucesso.
 */

// Aguarda o carregamento completo do DOM antes de manipular os elementos
document.addEventListener('DOMContentLoaded', function() {
    console.log('login.js carregado - MODO API');

    // ----- ELEMENTOS DO DOM -----
    const formulario = document.getElementById('formularioLogin');
    const campoUsuario = document.getElementById('usuario');
    const campoSenha = document.getElementById('senha');
    const botaoEntrar = document.getElementById('botaoEntrar');

    // Se algum elemento essencial não for encontrado, interrompe a execução
    if (!formulario || !campoUsuario || !campoSenha) {
        console.error('Elementos do formulário não encontrados');
        return;
    }

    // ----- CONFIGURAÇÃO DA API -----
    const URL_API = 'http://10.110.12.73:1880/api/login';

    /**
     * Realiza a autenticação do usuário via API.
     * @param {string} usuario - Nome de usuário ou e‑mail.
     * @param {string} senha - Senha informada.
     * @returns {Promise<Object>} - Objeto com a propriedade `success` e, em caso de sucesso, `user`.
     */
    async function fazerLoginAPI(usuario, senha) {
        console.log('Tentando login na API:', usuario);

        try {
            const resposta = await fetch(URL_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    usuario: usuario,
                    senha: senha
                })
            });

            console.log('📡 Status da resposta:', resposta.status);

            const dados = await resposta.json();
            console.log('📦 Dados recebidos:', dados);

            return dados;
        } catch (erro) {
            console.error('Erro de rede ou CORS:', erro);
            return {
                success: false,
                error: 'Erro de conexão com o servidor'
            };
        }
    }

    // ----- EVENTO DE SUBMISSÃO DO FORMULÁRIO -----
    formulario.addEventListener('submit', async function(evento) {
        evento.preventDefault(); // Impede o recarregamento da página

        const usuario = campoUsuario.value.trim();
        const senha = campoSenha.value;

        console.log('🔐 Tentando login com:', usuario);

        // Validação básica
        if (!usuario || !senha) {
            alert('Preencha todos os campos');
            return;
        }

        // Feedback visual: desabilita o botão enquanto a requisição é processada
        botaoEntrar.disabled = true;
        botaoEntrar.textContent = 'Entrando...';

        try {
            const resultado = await fazerLoginAPI(usuario, senha);

            if (resultado.success) {
                console.log('✅ Login aprovado pela API!');

                // Persiste os dados do usuário no navegador
                localStorage.setItem('usuarioLogado', JSON.stringify(resultado.user));

                // Redireciona para o dashboard
                window.location.href = 'html/dashboard.html';
            } else {
                alert(resultado.error || 'Usuário ou senha inválidos');
            }
        } catch (erro) {
            console.error('Erro inesperado:', erro);
            alert('Erro ao processar login');
        } finally {
            // Reabilita o botão independentemente do resultado
            botaoEntrar.disabled = false;
            botaoEntrar.textContent = 'Entrar';
        }
    });

    console.log('Sistema de login configurado (API apenas)');
});
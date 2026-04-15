/**
 * Módulo de Login (Acessar)
 * Gerencia a autenticação do usuário.
 */

// Aguarda o carregamento completo do DOM antes de executar
document.addEventListener('DOMContentLoaded', () => {
    const formularioLogin = document.getElementById('formularioLogin');
    const botaoEntrar = document.getElementById('botaoEntrar');
    const campoUsuario = document.getElementById('usuario');
    const campoSenha = document.getElementById('senha');

    /**
     * Função assíncrona que simula a autenticação do usuário.
     * Em um sistema real, faria uma requisição POST para o backend.
     * @param {string} usuario - Nome de usuário
     * @param {string} senha - Senha do usuário
     * @returns {Promise<boolean>} - true se autenticado, false caso contrário
     */
    const autenticarUsuario = async (usuario, senha) => {
        // Simulação de requisição HTTP (em produção, usar fetch real)
        console.log(`Tentando autenticar: ${usuario}`);

        // Simula um atraso de rede
        await new Promise(resolve => setTimeout(resolve, 500));

        // Credenciais de demonstração (apenas para teste)
        const USUARIO_DEMO = 'admin';
        const SENHA_DEMO = '123456';

        if (usuario === USUARIO_DEMO && senha === SENHA_DEMO) {
            return true;
        }
        return false;
    };

    /**
     * Manipula o evento de submit do formulário de login.
     * @param {Event} evento - Evento de submit
     */
    const aoSubmeterLogin = async (evento) => {
        evento.preventDefault(); // Impede o envio tradicional do formulário

        const usuario = campoUsuario.value.trim();
        const senha = campoSenha.value;

        // Validação básica
        if (!usuario || !senha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Desabilita botão e mostra feedback visual (simples)
        botaoEntrar.disabled = true;
        botaoEntrar.textContent = 'Entrando...';

        try {
            const autenticado = await autenticarUsuario(usuario, senha);

            if (autenticado) {
                // Armazena informação de login (simples, apenas para demonstração)
                localStorage.setItem('usuarioLogado', usuario);
                // Redireciona para o dashboard
                window.location.href = 'html/dashboard.html';
            } else {
                alert('Usuário ou senha inválidos.');
            }
        } catch (erro) {
            console.error('Erro durante autenticação:', erro);
            alert('Ocorreu um erro ao tentar fazer login. Tente novamente.');
        } finally {
            // Reabilita o botão
            botaoEntrar.disabled = false;
            botaoEntrar.textContent = 'Entrar';
        }
    };

    // Registra o evento de submit
    formularioLogin.addEventListener('submit', aoSubmeterLogin);
});
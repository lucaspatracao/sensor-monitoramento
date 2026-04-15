/**
 * Módulo de Cadastro (Criar Conta)
 * Gerencia a criação de novas contas de usuário.
 */

document.addEventListener('DOMContentLoaded', () => {
    const formularioCadastro = document.getElementById('formularioCadastro');
    const botaoCadastrar = document.getElementById('botaoCadastrar');
    const campoNome = document.getElementById('nomeCompleto');
    const campoEmail = document.getElementById('email');
    const campoSenha = document.getElementById('senhaCadastro');
    const campoConfirmarSenha = document.getElementById('confirmarSenha');

    /**
     * Valida os campos do formulário de cadastro.
     * @returns {boolean} - true se válido, false caso contrário
     */
    const validarFormulario = () => {
        const nome = campoNome.value.trim();
        const email = campoEmail.value.trim();
        const senha = campoSenha.value;
        const confirmacao = campoConfirmarSenha.value;

        if (!nome || !email || !senha || !confirmacao) {
            alert('Todos os campos são obrigatórios.');
            return false;
        }

        // Validação simples de e-mail
        if (!email.includes('@') || !email.includes('.')) {
            alert('Por favor, informe um e-mail válido.');
            return false;
        }

        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return false;
        }

        if (senha !== confirmacao) {
            alert('As senhas não coincidem.');
            return false;
        }

        return true;
    };

    /**
     * Simula o envio dos dados de cadastro para o servidor.
     * @param {Object} dados - Dados do formulário
     * @returns {Promise<Object>} - Resposta simulada do servidor
     */
    const enviarCadastro = async (dados) => {
        console.log('Enviando dados de cadastro:', dados);

        // Simula latência de rede
        await new Promise(resolve => setTimeout(resolve, 800));

        // Em produção, seria algo como:
        // const resposta = await fetch('https://api.exemplo.com/usuarios', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(dados)
        // });
        // if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
        // return await resposta.json();

        // Simula sucesso
        return { id: Date.now(), ...dados, criadoEm: new Date().toISOString() };
    };

    /**
     * Manipula o evento de submit do formulário de cadastro.
     * @param {Event} evento - Evento de submit
     */
    const aoSubmeterCadastro = async (evento) => {
        evento.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        botaoCadastrar.disabled = true;
        botaoCadastrar.textContent = 'Cadastrando...';

        const dadosUsuario = {
            nomeCompleto: campoNome.value.trim(),
            email: campoEmail.value.trim(),
            senha: campoSenha.value // Em produção, nunca envie senha em texto puro!
        };

        try {
            const resposta = await enviarCadastro(dadosUsuario);
            console.log('Cadastro realizado com sucesso:', resposta);
            alert('Conta criada com sucesso! Você será redirecionado para o login.');
            window.location.href = '../index.html';
        } catch (erro) {
            console.error('Erro no cadastro:', erro);
            alert('Não foi possível criar a conta. Tente novamente mais tarde.');
        } finally {
            botaoCadastrar.disabled = false;
            botaoCadastrar.textContent = 'Cadastrar';
        }
    };

    formularioCadastro.addEventListener('submit', aoSubmeterCadastro);
});
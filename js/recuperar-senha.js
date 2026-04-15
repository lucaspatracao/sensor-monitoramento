/**
 * Módulo de Recuperação de Senha
 * Gerencia o envio de e-mail para redefinição de senha.
 */

document.addEventListener('DOMContentLoaded', () => {
    const formularioRecuperacao = document.getElementById('formularioRecuperarSenha');
    const botaoEnviar = document.getElementById('botaoEnviar');
    const campoEmail = document.getElementById('emailRecuperacao');

    /**
     * Simula o envio de um e-mail de recuperação.
     * @param {string} email - E-mail do usuário
     * @returns {Promise<void>}
     */
    const enviarEmailRecuperacao = async (email) => {
        console.log(`Solicitação de recuperação para: ${email}`);

        // Simula tempo de resposta do servidor
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Em uma aplicação real, faria um POST para o backend
        // const resposta = await fetch('https://api.exemplo.com/recuperar-senha', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email })
        // });
        // if (!resposta.ok) throw new Error('Falha na solicitação');
    };

    /**
     * Manipula o envio do formulário de recuperação.
     * @param {Event} evento - Evento de submit
     */
    const aoSubmeterRecuperacao = async (evento) => {
        evento.preventDefault();

        const email = campoEmail.value.trim();

        if (!email) {
            alert('Por favor, informe seu e-mail.');
            return;
        }

        if (!email.includes('@') || !email.includes('.')) {
            alert('E-mail inválido.');
            return;
        }

        botaoEnviar.disabled = true;
        botaoEnviar.textContent = 'Enviando...';

        try {
            await enviarEmailRecuperacao(email);
            alert('Se o e-mail estiver cadastrado, você receberá as instruções para redefinir sua senha.');
            // Redireciona para o login após alguns segundos
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        } catch (erro) {
            console.error('Erro na recuperação:', erro);
            alert('Ocorreu um erro. Tente novamente mais tarde.');
        } finally {
            botaoEnviar.disabled = false;
            botaoEnviar.textContent = 'Enviar';
        }
    };

    formularioRecuperacao.addEventListener('submit', aoSubmeterRecuperacao);
});
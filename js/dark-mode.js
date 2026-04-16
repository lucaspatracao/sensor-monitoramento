/**
 * Módulo de Modo Escuro (Dark Mode)
 * Alterna a classe 'modo-escuro' no body e salva preferência no localStorage.
 */

(function () {
    'use strict';

    // Aguarda o DOM carregar completamente
    document.addEventListener('DOMContentLoaded', function () {
        const CHAVE_STORAGE = 'temaEscuro';
        const botaoDark = document.getElementById('botaoDarkMode');

        // Se o botão não existir, sai silenciosamente
        if (!botaoDark) {
            console.warn('Botão de Dark Mode não encontrado.');
            return;
        }

        const textoBotao = botaoDark.querySelector('.texto-dark-mode');

        // Verifica preferência salva e aplica
        const temaSalvo = localStorage.getItem(CHAVE_STORAGE);
        if (temaSalvo === 'true') {
            document.body.classList.add('modo-escuro');
            if (textoBotao) textoBotao.textContent = 'Claro';
        } else {
            if (textoBotao) textoBotao.textContent = 'Escuro';
        }

        // Função para alternar o modo
        const alternarModoEscuro = function () {
            const estaEscuro = document.body.classList.toggle('modo-escuro');
            localStorage.setItem(CHAVE_STORAGE, estaEscuro);
            if (textoBotao) {
                textoBotao.textContent = estaEscuro ? 'Claro' : 'Escuro';
            }
        };

        // Registra o evento de clique
        botaoDark.addEventListener('click', alternarModoEscuro);
    });
})();
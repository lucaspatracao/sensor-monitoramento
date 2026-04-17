/**
 * Módulo de Modo Escuro (Dark Mode)
 * 
 * Responsável por:
 * - Alternar a classe CSS 'modo-escuro' no elemento <body>.
 * - Persistir a preferência do usuário no localStorage.
 * - Atualizar o texto do botão conforme o estado atual.
 * 
 * Utiliza uma IIFE (Immediately Invoked Function Expression) para encapsulamento.
 */

(function () {
    'use strict';

    // Aguarda o DOM estar completamente carregado
    document.addEventListener('DOMContentLoaded', function () {
        // ----- CONSTANTES -----
        const CHAVE_STORAGE = 'temaEscuro';

        // ----- ELEMENTOS DO DOM -----
        const botaoDark = document.getElementById('botaoDarkMode');

        // Se o botão não existir (página sem dark mode), encerra silenciosamente
        if (!botaoDark) {
            console.warn('Botão de Dark Mode não encontrado nesta página.');
            return;
        }

        const textoBotao = botaoDark.querySelector('.texto-dark-mode');

        // ----- INICIALIZAÇÃO DO ESTADO -----
        const temaSalvo = localStorage.getItem(CHAVE_STORAGE);

        if (temaSalvo === 'true') {
            document.body.classList.add('modo-escuro');
            if (textoBotao) textoBotao.textContent = 'Claro';
        } else {
            if (textoBotao) textoBotao.textContent = 'Escuro';
        }

        // ----- FUNÇÃO DE ALTERNÂNCIA -----
        const alternarModoEscuro = function () {
            // Adiciona ou remove a classe 'modo-escuro'
            const estaEscuro = document.body.classList.toggle('modo-escuro');

            // Salva a preferência no localStorage
            localStorage.setItem(CHAVE_STORAGE, estaEscuro);

            // Atualiza o texto do botão
            if (textoBotao) {
                textoBotao.textContent = estaEscuro ? 'Claro' : 'Escuro';
            }
        };

        // ----- REGISTRO DO EVENTO -----
        botaoDark.addEventListener('click', alternarModoEscuro);
    });
})();
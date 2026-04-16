# 🌡️ Sistema de Monitoramento de Temperatura e Umidade – Sensora

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Node‑RED](https://img.shields.io/badge/Node‑RED-8F0000?logo=nodered&logoColor=white)](https://nodered.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Arduino](https://img.shields.io/badge/Arduino-00979D?logo=arduino&logoColor=white)](https://www.arduino.cc/)

Bem‑vindo ao repositório do **Sensora**, um sistema completo de monitoramento industrial desenvolvido como parte da **Situação de Aprendizagem Integrada**. O projeto integra hardware (Arduino), backend (Node‑RED + MySQL) e frontend (HTML, CSS, JavaScript) para coletar, armazenar e visualizar dados de temperatura e umidade em tempo real.

---

## 🔗 Links Úteis

[![Figma](https://img.shields.io/badge/Figma-Protótipo-FF4785?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/design/RbVW0UL3P43XijopxDG3q9/Prot%C3%B3tipo---Projeto-Integrador--Sensor-?node-id=0-1&t=Wv3d4aSLGvWhPtcc-1)

[![Google Drive](https://img.shields.io/badge/Google%20Drive-Documentação-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/drive/folders/1OU1aApusqg9-RoorB-O9dqr2atFL1dph)

[![GitHub](https://img.shields.io/badge/GitHub-Repositório-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lucaspatracao/sensor-monitoramento)

---

## 📋 Sumário

- [Visão Geral](#-visão-geral)
- [Objetivos da Atividade](#-objetivos-da-atividade)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Funcionalidades](#-funcionalidades)
- [Entregáveis Obrigatórios](#-entregáveis-obrigatórios)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Guia de Instalação e Execução](#-guia-de-instalação-e-execução)
- [Capturas de Tela](#-capturas-de-tela)
- [Links Úteis](#-links-úteis)
- [Equipe de Desenvolvimento](#-equipe-de-desenvolvimento)
- [Licença](#-licença)

---

## 🌐 Visão Geral

O **Sensora** é uma solução de monitoramento que coleta dados ambientais (temperatura e umidade) por meio de sensores conectados a uma placa **Arduino**. Os dados são transmitidos via comunicação serial (USB) para um servidor que executa o **Node‑RED**, responsável por processar as informações e armazená‑las em um banco de dados **MySQL**. Uma interface web desenvolvida com **HTML, CSS e JavaScript** consome uma API REST fornecida pelo Node‑RED e exibe os dados em dashboards interativos e históricos detalhados.

O sistema foi projetado para ser executado em **três computadores distintos** (PC Servidor, PC Programador/Arduino e PC Cliente), simulando um ambiente industrial real onde aquisição, processamento e visualização ocorrem em máquinas separadas.

---

## 🎯 Objetivos da Atividade

Conforme definido na **Situação de Aprendizagem Integrada**, o projeto atende aos seguintes requisitos:

- [x] Aquisição de dados via sensor conectado à plataforma **Arduino**.
- [x] Comunicação dos dados com o backend via **RS232 (USB emulada)**.
- [x] Armazenamento em banco de dados **MySQL**.
- [x] Processamento e disponibilização das informações via **API REST**.
- [x] Visualização em **dashboards e interfaces web** responsivas.
- [x] Documentação completa: **fluxograma, diagrama de rede, modelo de banco, caso de uso e protótipo**.

---

## 🏗️ Arquitetura do Sistema

O sistema é composto por dois módulos principais, conforme ilustrado abaixo:

```
┌─────────────────┐     (USB/Serial)     ┌──────────────────────────────┐
│   Arduino Uno   │ ──────────────────▶ │      PC Servidor              │
│   + Sensor DHT  │                     │                              │
└─────────────────┘                     │  ┌─────────────────────────┐ │
                                        │  │       Node‑RED          │ │
                                        │  │  • Serial In            │ │
                                        │  │  • Function (Parse)     │ │
                                        │  │  • MySQL (Insert/Select)│ │
                                        │  │  • HTTP Endpoints       │ │
                                        │  └───────────┬─────────────┘ │
                                        │              │               │
                                        │  ┌───────────▼─────────────┐ │
                                        │  │   MySQL Database        │ │
                                        │  │   sensor.leitura        │ │
                                        │  └─────────────────────────┘ │
                                        └──────────────┬───────────────┘
                                                       │ HTTP (JSON)
                                                       ▼
                                        ┌──────────────────────────────┐
                                        │       PC Cliente             │
                                        │                              │
                                        │  ┌─────────────────────────┐ │
                                        │  │   Interface Web         │ │
                                        │  │  • Login / Cadastro     │ │
                                        │  │  • Dashboard            │ │
                                        │  │  • Histórico            │ │
                                        │  │  • Modo Escuro          │ │
                                        │  └─────────────────────────┘ │
                                        └──────────────────────────────┘
```

- **Módulo 1 (Servidor):** Executa o Node‑RED, recebe os dados seriais do Arduino, processa e armazena no MySQL, e expõe endpoints HTTP para consulta.
- **Módulo 2 (Cliente):** Interface web pura (HTML, CSS, JavaScript) que consome a API e apresenta os dados em tempo real.

---

## ⚙️ Funcionalidades

### 🔐 Autenticação (Opcional, mas implementada)
- Tela de **Login** com validação de credenciais.
- Tela de **Cadastro** para novos usuários.
- Tela de **Recuperação de Senha** (simulada).

### 📊 Dashboard
- Exibição em tempo real da **temperatura** e **umidade** atuais.
- **Gráfico de linha** mostrando a evolução da temperatura nos últimos minutos.
- Atualização automática a cada **5 segundos**.
- Botão de atalho para acessar o **Histórico**.

### 📜 Histórico
- **Tabela** com todas as leituras armazenadas (ID, Temperatura, Umidade, Data/Hora).
- **Filtros por período** (data inicial e final) para consulta refinada.
- Atualização automática a cada **10 segundos**.

### 🌙 Modo Escuro (Dark Mode)
- Botão flutuante no canto inferior direito para alternar entre tema claro e escuro.
- **Persistência** da preferência do usuário via `localStorage`.
- Apenas cores de fundo e texto são alteradas; **cores de destaque (azul, laranja) permanecem inalteradas**.

### 📱 Responsividade
- Layout adaptável para dispositivos móveis, tablets e desktops.
- Menu de navegação flexível e tabelas com scroll horizontal em telas pequenas.

---

## 📦 Entregáveis Obrigatórios

| # | Entregável | Descrição | Status |
|---|------------|-----------|--------|
| 1 | **Fluxograma do Hardware** | Representação do fluxo: Sensor → Arduino → Serial → Node‑RED. | ✅ Concluído |
| 2 | **Infraestrutura de Rede** | Diagrama com endereçamento IPv4, gateway e explicação do fluxo de comunicação. | ✅ Concluído |
| 3 | **Diagrama do Banco de Dados** | Modelo lógico da tabela `leitura` (id, temperatura, umidade, datahora). | ✅ Concluído |
| 4 | **Diagrama de Caso de Uso** | Ator "Operador" e casos de uso: Login, Visualizar Dashboard, Consultar Histórico. | ✅ Concluído |
| 5 | **Protótipo da Interface (Figma)** | Telas de Login, Cadastro, Dashboard e Histórico. | ✅ Concluído |

---

## 📁 Estrutura do Projeto

```
raiz_do_projeto/
│
├── index.html                     # Página de Login (única na raiz)
├── img/
│   └── sensor-logo.png            # Logo do sistema
│
├── html/                          # Demais páginas HTML
│   ├── cadastro.html
│   ├── recuperar-senha.html
│   ├── dashboard.html
│   └── historico.html
│
├── css/                           # Folhas de estilo
│   ├── estilo.css                 # Estilos globais
│   ├── login.css
│   ├── cadastro.css
│   ├── recuperar-senha.css
│   ├── dashboard.css
│   └── historico.css
│
├── js/                            # Scripts JavaScript
│   ├── dark-mode.js               # Lógica do modo escuro
│   ├── login.js
│   ├── cadastro.js
│   ├── recuperar-senha.js
│   ├── dashboard.js               # Consome API e atualiza gráfico/valores
│   └── historico.js               # Preenche tabela e gerencia filtros
│
└── dados/                         # Dados simulados para testes
    └── leituras_mock.json
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** – Estrutura semântica das páginas.
- **CSS3** – Estilização com Flexbox, Grid, variáveis e design responsivo.
- **JavaScript (ES6+)** – Manipulação do DOM, requisições `fetch` (async/await), eventos e lógica de atualização em tempo real.
- **Chart.js** – Biblioteca para renderização de gráficos interativos.

### Backend e Infraestrutura
- **Node‑RED** – Plataforma de integração para recepção de dados seriais, processamento e exposição de API REST.
- **MySQL** – Banco de dados relacional para persistência das leituras.
- **Arduino IDE** – Programação do microcontrolador.
- **Arduino Uno + Sensor DHT11/LM35** – Aquisição de dados de temperatura e umidade.

### Ferramentas de Apoio
- **Figma** – Prototipação da interface.
- **Draw.io / Lucidchart** – Criação dos diagramas UML e de rede.
- **Git & GitHub** – Versionamento de código.
- **Google Drive** – Armazenamento e compartilhamento da documentação.

---

## 🚀 Guia de Instalação e Execução

> **Nota:** O sistema é projetado para três computadores, mas pode ser testado em uma única máquina ajustando os caminhos e URLs.

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/sensora-monitoramento.git
cd sensora-monitoramento
```

### 2. Configure o Servidor (Membro 1)

1. Instale o **Node‑RED** e os nós complementares (`node-red-node-serialport`, `node-red-node-mysql`).
2. Configure o nó `serial in` com a porta correta do Arduino e baud rate `9600`.
3. Configure a conexão com o banco de dados `sensor` (tabela `leitura` com colunas `id`, `temperatura`, `umidade`, `datahora`).
4. Importe o fluxo JSON (disponível na pasta `node-red-flow/`).
5. Habilite **CORS** no arquivo `settings.js` do Node‑RED.
6. Anote o **endereço IPv4** do PC Servidor.

### 3. Programe o Arduino (Membro 2)

1. Monte o circuito com o sensor (DHT11 ou LM35) conectado ao Arduino.
2. Carregue o sketch (`arduino/sketch.ino`) utilizando a Arduino IDE.
3. Conecte o Arduino ao PC Servidor via USB.

### 4. Execute a Interface Web (Membro 3)

1. Abra o arquivo `index.html` no navegador do PC Cliente (ou utilize a extensão **Live Server** do VS Code).
2. Substitua a variável `URL_API` nos arquivos `dashboard.js` e `historico.js` pelo IP real do servidor:
   ```javascript
   const URL_API = 'http://192.168.1.100:1880/api/leituras';
   ```
3. Navegue pelas telas de login, dashboard e histórico.

### 5. Testes com Dados Simulados (Opcional)

Caso o backend ainda não esteja pronto, utilize o arquivo `dados/leituras_mock.json` alterando a `URL_API` para `../dados/leituras_mock.json` durante o desenvolvimento.

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte da **Situação de Aprendizagem Integrada**. Sinta‑se à vontade para estudar, modificar e adaptar o código conforme necessário.

---

## 👥 Desenvolvido por

| Membro | Redes Sociais |
|:------:|:-------------:|
| **Lucas Patracão** | [![Instagram](https://img.shields.io/badge/Instagram-@lnpatracao-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/lnpatracao) |
| **Rafael Rubiá** | [![Instagram](https://img.shields.io/badge/Instagram-@rafa_rubia7-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/rafa_rubia7) |
| **Samuel Santana** | [![Instagram](https://img.shields.io/badge/Instagram-@_samusantana_-E4405F?style=flat-square&logo=instagram&logoColor=white)](https://www.instagram.com/_samusantana_) |

**Equipe Sensora © 2026**

---

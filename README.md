# 🌌 Portfólio Oficial — Vitor Nascimento (`vitorns-dev`)

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

Portfólio web interativo desenvolvido para apresentar minha trajetória acadêmica, competências técnicas, projetos práticos e currículo profissional, com foco em oportunidades de **Estágio em Tecnologia da Informação** (**Desenvolvimento de Software**, **Quality Assurance (QA)** e **Suporte Técnico / Help Desk**).

🔗 **Acesse online:** [vitorns-dev.vercel.app](https://vitorns-dev.vercel.app/)

---

## ✨ Funcionalidades Principais

* **🌀 Vórtice Temporal & Fenda Dimensional (`canvas`):** Animação de fundo interativa em HTML5 Canvas inspirada em *Doctor Who*, com estrelas em profundidade, círculos giratórios de Gallifrey e uma **Fenda Dimensional clicável** que teletransporta o visitante diretamente para projetos em destaque.
* **💻 Terminal Interativo (`vitor@tardis:~$`):** Linha de comando funcional na página inicial com suporte a comandos como `help`, `about`, `skills`, `curriculo`, `fenda` e `hire`.
* **🔍 Paleta de Comandos (`Ctrl + K`):** Menu rápido acessível por teclado ou botão no topo para navegar entre seções, alternar temas, ativar efeitos sonoros e disparar ações.
* **🎮 Mini-Game Pong Retro:** Jogo completo embutido na aba **Projetos**, com suporte a toque (mobile), mouse e teclado (`W`/`S` ou `↑`/`↓`), placar de vitórias salvo localmente e confetes ao vencer.
* **📄 Currículo Interativo & Impressão:** Modal visual com todas as informações profissionais, botão para download direto em PDF e folha de estilo `@media print` otimizada para impressão.
* **🧊 Cubo 3D Interativo & Micro-interações:** Cubo CSS 3D arrastável com minhas tecnologias, cards com efeito *tilt* 3D, botões magnéticos e sintetizador de áudio via **Web Audio API**.
* **🌓 Temas & Acessibilidade:** Alternância entre **Modo Escuro**, **Modo Claro** (sincronizado automaticamente com o tema do sistema operacional via `prefers-color-scheme`) e **Modo TARDIS / Sci-Fi** secreto, além de suporte a `prefers-reduced-motion` e navegação por teclado.

---

## 📂 Estrutura do Projeto

```text
├── index.html                                    # Estrutura SPA, semântica e modal de currículo
├── css/
│   └── style.css                                 # Variáveis de tema, responsividade, 3D, animações e @media print
├── js/
│   ├── main.js                                   # Controle de rotas SPA, temas, menu mobile, Ctrl+K e eventos
│   ├── vortex.js                                 # Renderização do Vórtice Temporal, Gallifrey e Fenda em Canvas
│   ├── pong.js                                   # Lógica, física e renderização do Mini-Game Pong
│   ├── terminal.js                               # Interpretador de comandos do terminal interativo
│   └── dados.js                                  # Dados estruturados de projetos, skills e links
├── docs/
│   └── Currículo - Vitor Nascimento dos Santos.pdf
└── imagens/
    └── minha foto.jpg
```

---

## 🛠️ Tecnologias Utilizadas

* **Front-End:** HTML5 Semântico, CSS3 (Grid, Flexbox, Custom Properties, 3D Transforms) e JavaScript Vanilla (ES6+ Modules).
* **Gráficos & Áudio Nativos:** HTML5 Canvas 2D API e Web Audio API (sem bibliotecas externas).
* **Versionamento & Deploy:** Git, GitHub e hospedagem contínua via Vercel.

---

## 🚀 Como Executar Localmente

Como o projeto utiliza **ES Modules** (`type="module"`), é necessário rodá-lo através de um servidor local:

```bash
# 1. Clone o repositório
git clone [https://github.com/vitorns-dev/seu-repositorio.git](https://github.com/vitorns-dev/seu-repositorio.git)

# 2. Acesse a pasta do projeto
cd seu-repositorio

# 3. Inicie um servidor local (exemplo com Python ou extensão Live Server do VS Code)
python -m http.server 5500
```

Depois, abra `http://localhost:5500` no navegador.

---

## 📬 Contato

* **Nome:** Vitor Nascimento dos Santos
* **GitHub:** [github.com/vitorns-dev](https://github.com/vitorns-dev)
* **LinkedIn:** [linkedin.com/in/vitor-nascimento-dos-santos](https://linkedin.com/in/vitor-nascimento-dos-santos)
* **E-mail:** vitornsantos405@gmail.com

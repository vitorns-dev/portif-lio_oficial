import { EMAIL, SKILLS, PROJETOS } from './dados.js';

export function iniciarTerminal({ VIEWS, irPara, abrirCurriculo, toggleTheme, teletransportar, impulsoVortex, confete, ativarSciFi, som }) {
    const termLog = document.getElementById('term-log');
    const termInput = document.getElementById('term-input');
    const termBody = document.getElementById('term-body');
    const terminalBox = document.getElementById('terminal');
    const historico = [];
    let hPos = 0;

    function termPrint(txt, cls = '') {
        const d = document.createElement('div');
        d.className = 'term-line ' + cls;
        d.textContent = txt;
        termLog.appendChild(d);
        termBody.scrollTop = termBody.scrollHeight;
    }

    const COMANDOS = {
        help: () => [
            'Comandos disponíveis:',
            '  about      quem sou eu',
            '  skills     minhas competências técnicas',
            '  curriculo  visualizar currículo oficial',
            '  projetos   meus repositórios',
            '  contato    como falar comigo',
            '  fenda      entrar na fenda (teletransporte para projetos)',
            '  vortex     acelerar o Vórtice Temporal',
            '  goto <aba> inicio | sobre | projetos | contato',
            '  tema       alternar claro/escuro',
            '  hire       a melhor decisão do seu dia',
            '  clear      limpar terminal'
        ],
        about: () => [
            'Vitor Nascimento dos Santos',
            'Estudante de ADS na UNINOVE (2º Semestre) e Front-End no Instituto PROA.',
            'Foco: estágio em Dev de Software, QA ou Suporte Técnico (Help Desk). São Paulo - SP.'
        ],
        whoami: () => ['visitante (Senhor do Tempo em potencial 😉)'],
        skills: () => SKILLS.map(s => `${s.n.padEnd(40, '.')} ${s.p}%`),
        curriculo: () => { setTimeout(() => abrirCurriculo(true), 250); return ['📄 Abrindo currículo oficial...']; },
        ls: () => ['projetos/', 'Currículo - Vitor Nascimento dos Santos.pdf', 'sobre.txt', 'contato.txt', 'tardis.exe'],
        projetos: () => PROJETOS.map(p => `• ${p.t}  [${p.tags.join(', ')}]`),
        contato: () => ['WhatsApp: (11) 93769-6501', 'E-mail:   ' + EMAIL, 'GitHub:   github.com/vitorns-dev', 'LinkedIn: /in/vitor-nascimento-dos-santos'],
        tema: () => { toggleTheme(); return ['Tema alternado.']; },
        fenda: () => { setTimeout(() => teletransportar(), 250); return ['🌀 Entrando na Fenda Dimensional...']; },
        vortex: () => { impulsoVortex(2.5); som(520, 'sine', 0.12); return ['🌀 Impulso no Vórtice Temporal ativado!']; },
        hire: () => { confete(); setTimeout(() => irPara('contato'), 1200); return ['✔ Candidato "Vitor" adicionado ao pipeline.', '→ Abrindo a aba de contato...']; },
        sudo: () => ['Boa tentativa. Aqui o acesso root é só do meu GitHub 😄'],
        'tardis.exe': () => { ativarSciFi(true); return ['Modo TARDIS / Sci-Fi ativado.']; }
    };

    function executarTerminal(linha) {
        const [cmd, ...args] = linha.trim().split(/\s+/);
        if (!cmd) return;
        termPrint('vitor@tardis:~$ ' + linha, 'cmd');
        const c = cmd.toLowerCase();
        if (c === 'clear') { termLog.innerHTML = ''; return; }
        if (c === 'goto') {
            const alvo = (args[0] || '').toLowerCase();
            if (VIEWS.includes(alvo)) {
                termPrint('Indo para ' + alvo + '...', 'ok');
                setTimeout(() => irPara(alvo), 400);
            } else {
                termPrint('Uso: goto inicio | sobre | projetos | contato', 'err');
            }
            return;
        }
        if (COMANDOS[c]) COMANDOS[c]().forEach(l => termPrint(l));
        else termPrint(`comando não encontrado: ${cmd}. Digite "help".`, 'err');
    }

    termInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            const v = termInput.value; termInput.value = '';
            if (v.trim()) { historico.push(v); hPos = historico.length; som(520, 'square', 0.04); }
            executarTerminal(v);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault(); if (hPos > 0) termInput.value = historico[--hPos] || '';
        } else if (e.key === 'ArrowDown') {
            e.preventDefault(); hPos = Math.min(historico.length, hPos + 1); termInput.value = historico[hPos] || '';
        }
    });

    termBody.addEventListener('click', () => {
        if (!getSelection().toString()) termInput.focus({ preventScroll: true });
    });

    document.getElementById('btn-minimizar-term').addEventListener('click', () => {
        terminalBox.classList.toggle('recolhido');
        const recolhido = terminalBox.classList.contains('recolhido');
        document.getElementById('btn-minimizar-term').textContent = recolhido ? '+' : '_';
        som(400, 'sine', 0.05);
    });

    return { print: termPrint };
}
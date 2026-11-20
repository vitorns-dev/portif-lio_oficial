import { EMAIL, GITHUB, LINKEDIN, SKILLS, HARD, SOFT, PROJETOS } from './dados.js';
import { iniciarVortex } from './vortex.js';
import { iniciarPong } from './pong.js';
import { iniciarTerminal } from './terminal.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)');
const safeGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

const VIEWS = ['inicio', 'sobre', 'projetos', 'contato'];
let viewAtual = 'inicio';

// Áudio
let audioAtivo = false, audioCtx = null;
function som(freq = 440, tipo = 'sine', dur = 0.08) {
    if (!audioAtivo) return;
    try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = tipo; o.frequency.value = freq;
        g.gain.setValueAtTime(0.05, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(); o.stop(audioCtx.currentTime + dur);
    } catch (e) {}
}

function toggleAudio() {
    audioAtivo = !audioAtivo;
    const btnAudio = $('#btn-audio');
    if (btnAudio) btnAudio.innerHTML = audioAtivo ? '<span>🔊</span>' : '<span>🔇</span>';
    toast(audioAtivo ? '🔊 Efeitos sonoros ativados!' : '🔇 Som desativado.');
    if (audioAtivo) som(600, 'triangle', 0.1);
}

// Notificações Toast
function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    $('#toast-container').appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

// Tema & Sincronização com o Sistema
function sincronizarColorScheme() {
    const claro = root.classList.contains('claro');
    const sciFi = root.classList.contains('sci-fi-ativo');
    const metaScheme = $('#meta-color-scheme');
    const metaTheme = $('#meta-theme-color');
    if (metaScheme) metaScheme.setAttribute('content', claro ? 'only light' : 'dark');
    if (metaTheme) metaTheme.setAttribute('content', claro ? '#f8fafc' : (sciFi ? '#02121a' : '#050811'));
}

function atualizarBotaoTema() {
    const claro = root.classList.contains('claro');
    const btnTema = $('#tema');
    if (btnTema) {
        btnTema.innerHTML = claro ? '<span>☀</span> <span class="texto-btn">Claro</span>' : '<span>☾</span> <span class="texto-btn">Escuro</span>';
    }
}

function aplicarTemaSistema() {
    const temaSalvo = safeGet('tema');
    const usarClaro = temaSalvo === 'claro' || (!temaSalvo && !sistemaEscuro.matches);
    root.classList.toggle('claro', usarClaro);
    sincronizarColorScheme();
    atualizarBotaoTema();
}

sistemaEscuro.addEventListener('change', e => {
    if (!safeGet('tema')) {
        root.classList.remove('sci-fi-ativo');
        root.classList.toggle('claro', !e.matches);
        sincronizarColorScheme();
        atualizarBotaoTema();
    }
});

function toggleTheme() {
    som(440, 'square', 0.08);
    root.classList.remove('sci-fi-ativo');
    root.classList.toggle('claro');
    safeSet('tema', root.classList.contains('claro') ? 'claro' : 'escuro');
    sincronizarColorScheme();
    atualizarBotaoTema();
}

// Menu Hambúrguer Mobile
const btnHamburguer = $('#btn-hamburguer');
const navMenu = $('#nav-menu');
function toggleMenuMobile(forcar) {
    const abrir = forcar === undefined ? !navMenu.classList.contains('aberto') : forcar;
    navMenu.classList.toggle('aberto', abrir);
    btnHamburguer.classList.toggle('aberto', abrir);
    btnHamburguer.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    if (abrir) som(580, 'sine', 0.06);
}
btnHamburguer.addEventListener('click', e => { e.stopPropagation(); toggleMenuMobile(); });
$$('#nav-menu a').forEach(link => link.addEventListener('click', () => toggleMenuMobile(false)));
document.addEventListener('click', e => {
    if (navMenu.classList.contains('aberto') && !navMenu.contains(e.target) && !btnHamburguer.contains(e.target)) {
        toggleMenuMobile(false);
    }
});

// Modal de Currículo
function abrirCurriculo(abrir = true) {
    const ov = $('#cv-overlay');
    ov.classList.toggle('aberto', abrir);
    if (abrir) som(620, 'sine', 0.09);
}
$('#btn-ver-cv').addEventListener('click', () => abrirCurriculo(true));
$('#btn-fechar-cv').addEventListener('click', () => abrirCurriculo(false));
$('#cv-overlay').addEventListener('click', e => { if (e.target.id === 'cv-overlay') abrirCurriculo(false); });
$('#btn-imprimir-cv').addEventListener('click', () => window.print());
[$('#btn-baixar-cv'), $('#btn-baixar-cv-modal')].forEach(btn => {
    if (btn) btn.addEventListener('click', () => {
        som(680, 'triangle', 0.1);
        toast('⬇️ Baixando Currículo - Vitor Nascimento dos Santos.pdf...');
    });
});

// Navegação SPA & Voo Aleatório da TARDIS
let primeiraView = true;
let ultimoTrajetoTardis = '';
const TRAJETOS_TARDIS = [
    'voando-direita',
    'voando-esquerda',
    'voando-baixo-cima',
    'voando-cima-baixo',
    'voando-diagonal-direita',
    'voando-diagonal-esquerda'
];

function voarTardis() {
    if (reduceMotion) return;
    const tardis = $('#tardis-voando');
    if (!tardis) return;

    tardis.classList.remove(...TRAJETOS_TARDIS);
    void tardis.offsetWidth;

    const opcoes = TRAJETOS_TARDIS.filter(t => t !== ultimoTrajetoTardis);
    const trajeto = opcoes[Math.floor(Math.random() * opcoes.length)];
    ultimoTrajetoTardis = trajeto;

    if (trajeto === 'voando-direita' || trajeto === 'voando-esquerda') {
        tardis.style.top = Math.floor(15 + Math.random() * 52) + '%';
        tardis.style.left = '0px';
    } else if (trajeto === 'voando-baixo-cima' || trajeto === 'voando-cima-baixo') {
        tardis.style.top = '0px';
        tardis.style.left = Math.floor(15 + Math.random() * 65) + '%';
    } else {
        tardis.style.top = '0px';
        tardis.style.left = '0px';
    }

    tardis.classList.add(trajeto);
}

function mostrarView(nome, destacarProjetoId = null) {
    if (!VIEWS.includes(nome)) nome = 'inicio';
    viewAtual = nome;
    toggleMenuMobile(false);
    $$('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + nome));
    $$('nav a').forEach(a => {
        const on = a.id === 'link-' + nome;
        a.classList.toggle('ativo', on);
        if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.title = ({
        inicio: 'Vitor Nascimento | Desenvolvimento de Software, QA & Suporte TI',
        sobre: 'Sobre | Vitor Nascimento',
        projetos: 'Projetos | Vitor Nascimento',
        contato: 'Contato | Vitor Nascimento'
    })[nome];

    vortex.impulso(1.0);
    if (!primeiraView) voarTardis();
    primeiraView = false;

    if (nome === 'sobre') animarSkills();
    if (nome === 'inicio') animarContadores();
    if (nome !== 'projetos' && pong.isAtivo()) pong.setAtivo(false);

    if (nome === 'projetos' && destacarProjetoId) {
        $$('.btn-filtro').forEach(b => b.classList.toggle('ativo', b.dataset.filtro === 'todos'));
        $$('.projeto-card').forEach(c => c.classList.remove('oculto', 'destaque-teletransporte'));
        atualizarContadorProjetos();
        const cardAlvo = document.getElementById(destacarProjetoId);
        if (cardAlvo) {
            setTimeout(() => {
                cardAlvo.classList.add('destaque-teletransporte');
                cardAlvo.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
                setTimeout(() => cardAlvo.classList.remove('destaque-teletransporte'), 2800);
            }, 80);
        }
    } else {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        mostrarTip();
    }
}

function irPara(nome, destacarProjetoId = null) {
    som(550, 'sine', 0.08);
    if (location.hash.slice(1) === nome) mostrarView(nome, destacarProjetoId);
    else {
        location.hash = nome;
        if (destacarProjetoId) mostrarView(nome, destacarProjetoId);
    }
}
window.addEventListener('hashchange', () => mostrarView(location.hash.slice(1)));

// Inicialização dos Módulos
const vortex = iniciarVortex({ reduceMotion, som, toast, irPara });
const pong = iniciarPong({ som, confete: vortex.confete, safeGet, safeSet, isViewProjetos: () => viewAtual === 'projetos' });

function ativarSciFi(forcar) {
    const on = forcar === undefined ? !root.classList.contains('sci-fi-ativo') : forcar;
    root.classList.toggle('sci-fi-ativo', on);
    if (on) {
        root.classList.remove('claro');
        sincronizarColorScheme();
        atualizarBotaoTema();
    } else {
        aplicarTemaSistema();
    }
    vortex.impulso(2.0);
    toast(on ? '✨ [Modo TARDIS] Vórtice Temporal em carga máxima!' : '🌙 Tema padrão restaurado.');
    som(660, 'triangle', 0.15);
}

const terminal = iniciarTerminal({
    VIEWS, irPara, abrirCurriculo, toggleTheme,
    teletransportar: vortex.teletransportar,
    impulsoVortex: vortex.impulso,
    confete: vortex.confete,
    ativarSciFi, som
});

// Estado de Energia Temporal (Curtidas) & Contador de Projetos
let curtidasProjetos = {};
try {
    curtidasProjetos = JSON.parse(safeGet('curtidas_projetos') || '{}') || {};
} catch (e) {
    curtidasProjetos = {};
}

function salvarCurtidas() {
    safeSet('curtidas_projetos', JSON.stringify(curtidasProjetos));
}

function atualizarContadorProjetos() {
    const el = $('#contador-projetos');
    if (!el) return;
    const total = $$('.projeto-card').length;
    const visiveis = $$('.projeto-card:not(.oculto)').length;
    el.innerHTML = visiveis === total
        ? `📡 <strong>${visiveis}</strong> ${visiveis === 1 ? 'projeto ativo' : 'projetos ativos'} no radar`
        : `📡 Exibindo <strong>${visiveis}</strong> de <strong>${total}</strong> projetos`;
}

// Conteúdo Dinâmico e Animações
function montarConteudo() {
    $('#skill-bars').innerHTML = SKILLS.map(s => `
        <div><div class="skill-info-bar"><span>${s.n}</span><span class="pct">0%</span></div>
        <div class="skill-bar-bg"><div class="skill-bar-fill" data-p="${s.p}"></div></div></div>`).join('');
    $('#hard-skills').innerHTML = HARD.map(s => `<div class="skill-item">${s}</div>`).join('');
    $('#soft-skills').innerHTML = SOFT.map(s => `<div class="skill-item">${s}</div>`).join('');

    const grid = $('#grid-projetos');
    const cards = PROJETOS.map(p => {
        const qtd = Number(curtidasProjetos[p.id]) || 0;
        return `
        <div id="${p.id}" class="projeto-card tilt" data-categoria="${p.cat}">
            <h3>${p.t}</h3>
            <div class="projeto-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
            <p>${p.d}</p>
            <div class="projeto-footer">
                <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="projeto-link">Ver repositório no GitHub &rarr;</a>
                <button type="button" class="btn-like-projeto${qtd > 0 ? ' curtido' : ''}" data-id="${p.id}" aria-label="Enviar energia temporal para ${p.t}" title="Enviar Energia Temporal">
                    <span class="like-icone">✦</span>
                    <span class="like-qtd">${qtd}</span>
                </button>
            </div>
        </div>`;
    }).join('');
    grid.insertAdjacentHTML('afterbegin', cards);

    const filtrosEl = $('.filtros-container');
    if (filtrosEl && !$('#contador-projetos')) {
        filtrosEl.insertAdjacentHTML('afterend', '<p id="contador-projetos" class="contador-projetos" aria-live="polite"></p>');
    }
    atualizarContadorProjetos();
}

$('#grid-projetos').addEventListener('click', e => {
    const btn = e.target.closest('.btn-like-projeto');
    if (!btn) return;
    const id = btn.dataset.id;
    const atual = (Number(curtidasProjetos[id]) || 0) + 1;
    curtidasProjetos[id] = atual;
    salvarCurtidas();

    $('.like-qtd', btn).textContent = atual;
    btn.classList.add('curtido');
    btn.classList.remove('pulso');
    void btn.offsetWidth;
    btn.classList.add('pulso');

    som(640 + Math.min(atual, 8) * 35, 'triangle', 0.09);
    if (atual === 1) toast('✦ Energia Temporal enviada para o projeto!');
});

function contar(el, alvo, dur = 1100, sufixo = '') {
    if (reduceMotion) { el.textContent = alvo + sufixo; return; }
    const t0 = performance.now();
    const passo = now => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(alvo * e) + sufixo;
        if (k < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
}
function animarContadores() { $$('[data-count]').forEach(el => contar(el, +el.dataset.count)); }
function animarSkills() {
    $$('.skill-bar-fill').forEach(f => { f.style.width = '0%'; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
        $$('.skill-bar-fill').forEach(f => {
            f.style.width = f.dataset.p + '%';
            contar(f.parentElement.previousElementSibling.querySelector('.pct'), +f.dataset.p, 1300, '%');
        });
    }));
}

function digitar(el, texto, vel, fim) {
    let i = 0; el.textContent = '';
    (function tick() {
        if (i < texto.length) { el.textContent += texto[i++]; setTimeout(tick, vel); } else if (fim) fim();
    })();
}
function saudacao() {
    const h = new Date().getHours();
    const s = h >= 5 && h < 12 ? '🌅 Bom dia!' : h >= 12 && h < 18 ? '☀️ Boa tarde!' : '🌙 Boa noite!';
    $('#saudacao-titulo').innerHTML = `${s} <span class="gradient-text">Seja bem-vindo ao meu portfólio</span>`;
}

const STATUS = ['Disponível para Estágio em TI (Tarde)', 'Foco: Desenvolvimento de Software, QA & Suporte Técnico', 'Presencial, Híbrido ou 100% Remoto em São Paulo - SP'];
let iStatus = 0;
function mudarStatus() {
    iStatus = (iStatus + 1) % STATUS.length;
    $('#status-texto').textContent = STATUS[iStatus];
    som(700, 'sine', 0.1);
}

// Easter Eggs (Logo & Konami)
let cliquesLogo = 0, ultimoClique = 0;
$('#logo').addEventListener('click', () => {
    const agora = Date.now();
    cliquesLogo = agora - ultimoClique > 1500 ? 1 : cliquesLogo + 1;
    ultimoClique = agora;
    som(500 + cliquesLogo * 50, 'sine', 0.08);
    if (cliquesLogo >= 5) { ativarSciFi(); cliquesLogo = 0; }
});
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let kPos = 0;
function checarKonami(e) {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kPos = k === KONAMI[kPos] ? kPos + 1 : (k === KONAMI[0] ? 1 : 0);
    if (kPos === KONAMI.length) { kPos = 0; toast('🎮 Código Konami! +30 vidas e confete.'); vortex.confete(); }
}

// Efeito Magnético e Tilt 3D
const fino = window.matchMedia('(pointer: fine)').matches;
let cardAtual = null;
function resetCard(c) { if (c) c.style.transform = ''; }

const mags = new Map(); let magRaf = 0, mx = -999, my = -999;
function magTick() {
    let ocupado = false;
    const selecaoMagnetica = fino ? '.magnetic-el' : '.magnetic-el:not(nav a)';
    $$(selecaoMagnetica).forEach(el => {
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        const st = mags.get(el) || { x: 0, y: 0 }; mags.set(el, st);
        const cX = r.left + r.width / 2 - st.x, cY = r.top + r.height / 2 - st.y;
        const d = Math.hypot(mx - cX, my - cY);
        const tx = d < 70 ? (mx - cX) * .3 : 0, ty = d < 70 ? (my - cY) * .3 : 0;
        st.x += (tx - st.x) * .22; st.y += (ty - st.y) * .22;
        if (Math.abs(tx - st.x) > .05 || Math.abs(ty - st.y) > .05) ocupado = true;
        el.style.translate = (Math.abs(st.x) < .05 && Math.abs(st.y) < .05) ? '' : `${st.x}px ${st.y}px`;
    });
    magRaf = ocupado ? requestAnimationFrame(magTick) : 0;
}

document.addEventListener('pointermove', e => {
    vortex.setMouse(e.clientX, e.clientY);
    if (!fino || e.pointerType !== 'mouse') return;

    if (!e.target.closest('button, a, input, textarea, .card, .projeto-card, header, nav, .terminal-box, .cv-modal')) {
        document.body.style.cursor = vortex.distanciaFenda(e.clientX, e.clientY) < 220 ? 'pointer' : '';
    } else {
        document.body.style.cursor = '';
    }

    mx = e.clientX; my = e.clientY;
    if (!magRaf) magRaf = requestAnimationFrame(magTick);

    const card = e.target.closest && e.target.closest('.tilt');
    if (card !== cardAtual) { resetCard(cardAtual); cardAtual = card; }
    if (card) {
        const r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--x', x + 'px'); card.style.setProperty('--y', y + 'px');
        if (!reduceMotion) {
            const rx = (-(y - r.height / 2) / r.height) * 6, ry = ((x - r.width / 2) / r.width) * 6;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
        }
    }
});
document.addEventListener('pointerleave', () => {
    resetCard(cardAtual); cardAtual = null; mx = my = -999;
    vortex.setMouse(-1000, -1000);
    document.body.style.cursor = '';
    if (!magRaf) magRaf = requestAnimationFrame(magTick);
});

// Cubo 3D
const cuboC = $('#cubo-interativo'), cubo = $('#elemento-cubo');
let arrasto = false, sx = 0, sy = 0, rotX = -15, rotY = 25;
cuboC.addEventListener('pointerdown', e => { arrasto = true; sx = e.clientX; sy = e.clientY; cuboC.setPointerCapture(e.pointerId); });
cuboC.addEventListener('pointermove', e => {
    if (!arrasto) return;
    rotY += (e.clientX - sx) * .5; rotX -= (e.clientY - sy) * .5;
    cubo.style.animation = 'none'; cubo.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    sx = e.clientX; sy = e.clientY;
});
['pointerup', 'pointercancel'].forEach(ev => cuboC.addEventListener(ev, () => { arrasto = false; }));

// Filtros de Projetos
$$('.btn-filtro').forEach(btn => btn.addEventListener('click', () => {
    som(500, 'sine', .05);
    $$('.btn-filtro').forEach(b => b.classList.remove('ativo')); btn.classList.add('ativo');
    const f = btn.dataset.filtro;
    $$('.projeto-card').forEach(c => c.classList.toggle('oculto', !(f === 'todos' || c.dataset.categoria === f)));
    atualizarContadorProjetos();
}));

// Paleta de Comandos (Ctrl+K)
const ACOES = [
    { l: 'Visualizar Currículo Oficial', k: '📄', f: () => abrirCurriculo(true) },
    { l: 'Ir para Início', k: '1', f: () => irPara('inicio') },
    { l: 'Ir para Sobre Mim & Formação', k: '2', f: () => irPara('sobre') },
    { l: 'Ver Projetos & Mini-Game Pong', k: '3', f: () => irPara('projetos') },
    { l: 'Entrar em Contato / Formulário', k: '4', f: () => irPara('contato') },
    { l: 'Entrar na Fenda Dimensional (Teletransporte)', k: '🌀', f: () => vortex.teletransportar() },
    { l: 'Acelerar Vórtice Temporal', k: '⚡', f: () => { vortex.impulso(2.5); som(520, 'sine', 0.12); } },
    { l: 'Alternar Tema (Claro / Escuro)', k: 'T', f: toggleTheme },
    { l: 'Ativar / Desativar Efeitos Sonoros', k: 'M', f: toggleAudio },
    { l: 'Copiar meu e-mail', k: '@', f: copiarEmail },
    { l: 'Abrir GitHub (vitorns-dev)', k: 'Git', f: () => window.open(GITHUB, '_blank', 'noopener') },
    { l: 'Abrir LinkedIn', k: 'In', f: () => window.open(LINKEDIN, '_blank', 'noopener') },
    { l: 'Modo TARDIS / Sci-Fi', k: '✨', f: () => ativarSciFi() },
    { l: 'Soltar confete 🎉', k: '🎉', f: () => vortex.confete() }
];
let cmdSel = 0, cmdLista = ACOES;
function renderCmd() {
    const el = $('#cmd-list-items');
    el.innerHTML = cmdLista.length ? '' : '<div class="cmd-vazio">Nenhum comando encontrado</div>';
    cmdLista.forEach((a, i) => {
        const d = document.createElement('div');
        d.className = 'cmd-item' + (i === cmdSel ? ' selecionado' : '');
        d.innerHTML = '<span></span><span class="cmd-shortcut"></span>';
        d.children[0].textContent = a.l; d.children[1].textContent = a.k;
        d.addEventListener('click', () => rodarCmd(a));
        el.appendChild(d);
    });
}
function abrirCmd(abrir) {
    const ov = $('#cmd-overlay'), inp = $('#cmd-input');
    ov.classList.toggle('aberto', abrir);
    if (abrir) { inp.value = ''; cmdLista = ACOES; cmdSel = 0; renderCmd(); inp.focus(); som(700, 'sine', .08); }
    else inp.blur();
}
function rodarCmd(a) { abrirCmd(false); a.f(); }
$('#cmd-input').addEventListener('input', e => {
    const t = e.target.value.toLowerCase().trim();
    cmdLista = ACOES.filter(a => a.l.toLowerCase().includes(t)); cmdSel = 0; renderCmd();
});
$('#cmd-input').addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdSel = Math.min(cmdLista.length - 1, cmdSel + 1); renderCmd(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cmdSel = Math.max(0, cmdSel - 1); renderCmd(); }
    else if (e.key === 'Enter' && cmdLista[cmdSel]) rodarCmd(cmdLista[cmdSel]);
});
$('#cmd-overlay').addEventListener('click', e => { if (e.target.id === 'cmd-overlay') abrirCmd(false); });

$('#btn-cmd').addEventListener('click', () => abrirCmd(true));
$('#btn-audio').addEventListener('click', toggleAudio);
$('#tema').addEventListener('click', toggleTheme);

// Atalhos de Teclado
const digitando = () => ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
window.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); abrirCmd(!$('#cmd-overlay').classList.contains('aberto')); return; }
    if (e.key === 'Escape') { abrirCmd(false); abrirCurriculo(false); toggleMenuMobile(false); return; }
    if (digitando()) return;
    checarKonami(e);

    if (viewAtual === 'projetos') {
        const k = e.key.toLowerCase();
        if (k === 'w' || e.key === 'ArrowUp') { pong.setDir('up', true); if (pong.isAtivo()) e.preventDefault(); }
        if (k === 's' || e.key === 'ArrowDown') { pong.setDir('down', true); if (pong.isAtivo()) e.preventDefault(); }
        if (e.code === 'Space' && document.activeElement.tagName !== 'BUTTON') { e.preventDefault(); pong.toggle(); return; }
        if (k === 'w' || k === 's') return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const mapa = { '1': 'inicio', '2': 'sobre', '3': 'projetos', '4': 'contato' };
    if (mapa[e.key]) irPara(mapa[e.key]);
    else if (e.key.toLowerCase() === 't') toggleTheme();
    else if (e.key.toLowerCase() === 'm') toggleAudio();
});
window.addEventListener('keyup', e => {
    const k = e.key.toLowerCase();
    if (k === 'w' || e.key === 'ArrowUp') pong.setDir('up', false);
    if (k === 's' || e.key === 'ArrowDown') pong.setDir('down', false);
});
window.addEventListener('blur', () => pong.pararControles());

// Contato e Formulário
function copiarEmail() {
    const ok = () => toast('📋 E-mail copiado: ' + EMAIL);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(EMAIL).then(ok).catch(() => toast('E-mail: ' + EMAIL));
    else toast('E-mail: ' + EMAIL);
}
$('#btn-copiar-email').addEventListener('click', copiarEmail);

$('#btn-enviar').addEventListener('click', e => {
    const b = e.currentTarget, r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
    const c = document.createElement('span'); c.className = 'ripple';
    c.style.width = c.style.height = d + 'px';
    c.style.left = (e.clientX - r.left - d / 2) + 'px'; c.style.top = (e.clientY - r.top - d / 2) + 'px';
    const velho = $('.ripple', b); if (velho) velho.remove();
    b.appendChild(c);
});

$('#form-contato').addEventListener('submit', e => {
    e.preventDefault();
    const nome = $('#nome').value.trim(), email = $('#email').value.trim(), tel = $('#telefone').value.trim(), msg = $('#mensagem').value.trim();
    if (!nome || !/^\S+@\S+\.\S+$/.test(email)) return toast('⚠️ Preencha nome e um e-mail válido.');
    if (msg.length < 10) return toast('⚠️ Escreva uma mensagem um pouco mais detalhada.');
    const corpo = `${msg}\n\n--\n${nome}\n${email}${tel ? '\n' + tel : ''}`;
    som(784, 'square', .2); vortex.confete();
    toast(`✨ Valeu, ${nome.split(' ')[0]}! Abrindo seu app de e-mail...`);
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Contato via portfólio: ' + nome)}&body=${encodeURIComponent(corpo)}`;
});

// Balão de Dica
const tipBox = $('#terminal-tooltip');
let tipFechadoManual = false;
let tipTimeout = null;

function mostrarTip() {
    if (tipFechadoManual) return;
    tipBox.classList.remove('oculto-tip');
    clearTimeout(tipTimeout);
    tipTimeout = setTimeout(() => tipBox.classList.add('oculto-tip'), 12000);
}

function esconderTip() {
    tipBox.classList.add('oculto-tip');
    clearTimeout(tipTimeout);
}

const dicas = [
    '🌀 Toque na Fenda à direita para ir direto aos Projetos!',
    '📄 Veja ou baixe meu currículo na aba Início!',
    '🎯 Tem um Pong jogável na aba Projetos!',
    '🔍 Toque na lupa no topo para abrir o menu rápido!'
];
let iDica = 0;
const tipInterval = setInterval(() => {
    if (tipFechadoManual) return;
    iDica = (iDica + 1) % dicas.length;
    $('#tip-texto').textContent = dicas[iDica];
}, 6000);

mostrarTip();

$('#btn-fechar-tip').addEventListener('click', () => {
    tipFechadoManual = true;
    esconderTip();
    clearInterval(tipInterval);
});

// Scroll & Timer
window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    $('#scroll-progress').style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
    $('#btn-topo').classList.toggle('visivel', scrollY > 250);

    if (scrollY > 120) esconderTip();
    else if (scrollY < 40) mostrarTip();
}, { passive: true });
$('#btn-topo').addEventListener('click', () => { som(600, 'sine', .08); window.scrollTo({ top: 0, behavior: 'smooth' }); });

let seg = 0;
setInterval(() => {
    seg++;
    const m = Math.floor(seg / 60), s = seg % 60;
    $('#sessao-timer').textContent = 'Tempo na página: ' + (m ? `${m}m ${s}s` : `${s}s`);
}, 1000);

document.addEventListener('click', e => {
    const g = e.target.closest('[data-goto]'); if (g) irPara(g.dataset.goto);
});
$('#status-badge').addEventListener('click', mudarStatus);
$('#status-badge').addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mudarStatus(); } });

// Boot Inicial
montarConteudo();
aplicarTemaSistema();
saudacao();
mostrarView(location.hash.slice(1));
digitar($('#term-auto'), 'tardis --scan-portfolio', 65, () => {
    ['Vórtice Temporal: ONLINE • Círculos de Gallifrey: ATIVOS.', 'Clique na Fenda à direita para entrar no portal de Projetos!', 'Digite "help", "curriculo" ou "fenda" para testar.'].forEach(l => terminal.print(l));
});
setTimeout(() => digitar($('#bio-digitada'), 'Olá! Sou Vitor Nascimento dos Santos, estudante de Análise e Desenvolvimento de Sistemas na UNINOVE (2º Semestre) e Front-End no Instituto PROA, focado em Desenvolvimento de Software, QA e Suporte Técnico.', 22), 500);